/**
 * scripts/audit-content-coverage.mjs
 * Ground-truth key-path diff: en.json vs ta.json vs MongoDB vs Admin UI
 */
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// ── Load .env.local ────────────────────────────────────────────────────────
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (m) {
      let v = m[2] || '';
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      process.env[m[1]] = v.trim();
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI missing'); process.exit(1); }

// ── Flatten JSON to dot-notation key paths ────────────────────────────────
function flatten(obj, prefix = '', result = {}) {
  if (obj === null || obj === undefined) {
    result[prefix] = { type: 'null', value: null };
    return result;
  }
  if (Array.isArray(obj)) {
    result[prefix] = { type: 'array', length: obj.length };
    obj.forEach((item, i) => flatten(item, `${prefix}[${i}]`, result));
    return result;
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      result[prefix] = { type: 'object_empty', value: {} };
    } else {
      keys.forEach(k => flatten(obj[k], prefix ? `${prefix}.${k}` : k, result));
    }
    return result;
  }
  result[prefix] = { type: typeof obj, length: String(obj).length };
  return result;
}

// ── UI editability map: fields with REAL form controls (not JSON textarea) ─
// Based on implemented admin UI pages
const UI_EDITABLE = new Set([
  // Site settings page real controls
  'footer.copyright', 'footer.address', 'footer.quickLinks.heading',
  'footer.quickLinks.home', 'footer.quickLinks.aboutUs', 'footer.quickLinks.ourServices', 'footer.quickLinks.contactUs',
  'footer.medicalServices.heading', 'footer.medicalServices.opd', 'footer.medicalServices.physiotherapy',
  'footer.medicalServices.laboratory', 'footer.medicalServices.homeVisit',
  'footer.contactInfo.heading', 'footer.contactInfo.phone1', 'footer.contactInfo.phone2',
  // Collection editors: services
  'servicesPage.items.opd.title', 'servicesPage.items.opd.description', 'servicesPage.items.opd.viewDetails',
  'servicesPage.items.clinic.title', 'servicesPage.items.clinic.description',
  'servicesPage.items.ecg.title', 'servicesPage.items.ecg.description',
  'servicesPage.items.physiotherapy.title', 'servicesPage.items.physiotherapy.description',
  'servicesPage.items.specialist.title', 'servicesPage.items.specialist.description',
  'servicesPage.items.laboratory.title', 'servicesPage.items.laboratory.description',
  'servicesPage.items.nebulizer.title', 'servicesPage.items.nebulizer.description',
  'servicesPage.items.elders.title', 'servicesPage.items.elders.description',
  'servicesPage.items.homevisit.title', 'servicesPage.items.homevisit.description',
  'servicesPage.items.ambulance.title', 'servicesPage.items.ambulance.description',
  // serviceSinglePage - via Service CRUD editor
  'serviceSinglePage.services.opd.name', 'serviceSinglePage.services.opd.tagline',
  'serviceSinglePage.services.opd.desc1', 'serviceSinglePage.services.opd.desc2',
  'serviceSinglePage.services.opd.whyTitle', 'serviceSinglePage.services.opd.whyDesc',
  'serviceSinglePage.services.opd.whyPoint1', 'serviceSinglePage.services.opd.whyPoint2',
  // blog posts collection editor
  'blogPage.posts.post1.title', 'blogPage.posts.post1.category',
  'blogPage.posts.post2.title', 'blogPage.posts.post2.category',
  'blogPage.posts.post3.title', 'blogPage.posts.post3.category',
  'blogPage.posts.post4.title', 'blogPage.posts.post4.category',
  'blogPage.posts.post5.title', 'blogPage.posts.post5.category',
  'blogPage.posts.post6.title', 'blogPage.posts.post6.category',
  // team members collection editor
  'teamPage.members.arulanandem.name', 'teamPage.members.arulanandem.role',
  'teamPage.members.murugamoorthy.name', 'teamPage.members.murugamoorthy.role',
  'teamPage.members.sivaselvan.name', 'teamPage.members.sivaselvan.role',
  'teamPage.members.shobana.name', 'teamPage.members.shobana.role',
  'teamPage.members.raj.name', 'teamPage.members.raj.role',
  'teamPage.members.sujikala.name', 'teamPage.members.sujikala.role',
  // testimonials
  'testimonialsPage.items.t1.name', 'testimonialsPage.items.t1.quote', 'testimonialsPage.items.t1.role',
  'testimonialsPage.items.t2.name', 'testimonialsPage.items.t2.quote', 'testimonialsPage.items.t2.role',
  'testimonialsPage.items.t3.name', 'testimonialsPage.items.t3.quote', 'testimonialsPage.items.t3.role',
  'testimonialsPage.items.t4.name', 'testimonialsPage.items.t4.quote', 'testimonialsPage.items.t4.role',
  'testimonialsPage.items.t5.name', 'testimonialsPage.items.t5.quote', 'testimonialsPage.items.t5.role',
  'testimonialsPage.items.t6.name', 'testimonialsPage.items.t6.quote', 'testimonialsPage.items.t6.role',
  // case studies
  'caseStudyPage.items.cs1.title', 'caseStudyPage.items.cs1.desc',
  'caseStudyPage.items.cs2.title', 'caseStudyPage.items.cs2.desc',
  'caseStudyPage.items.cs3.title', 'caseStudyPage.items.cs3.desc',
  'caseStudyPage.items.cs4.title', 'caseStudyPage.items.cs4.desc',
  'caseStudyPage.items.cs5.title', 'caseStudyPage.items.cs5.desc',
  'caseStudyPage.items.cs6.title', 'caseStudyPage.items.cs6.desc',
  // page singleton meta fields (real inputs)
  'aboutPage.metaTitle', 'bookAppointmentPage.metaTitle', 'blogPage.metaTitle',
  'caseStudyPage.metaTitle', 'teamPage.metaTitle', 'testimonialsPage.metaTitle',
  'imageGalleryPage.metaTitle', 'videoGalleryPage.metaTitle', 'pricingPage.metaTitle',
  'faqsPage.metaTitle', 'contactPage.metaTitle', 'notFoundPage.metaTitle',
  'serviceSinglePage.metaTitle', 'homePage.metaTitle',
  // breadcrumbs (real inputs)
  'aboutPage.breadcrumb.home', 'aboutPage.breadcrumb.current',
]);

// ── MongoDB models (minimal inline schemas to avoid import issues) ─────────
const L = { en: { type: String, default: '' }, ta: { type: String, default: '' } };

const ServiceSchema = new mongoose.Schema({ name: L, slug: String, tagline: L, desc1: L, desc2: L,
  whyTitle: L, whyDesc: L, whyPoint1: L, whyPoint2: L, iconClass: String,
  listingIcon: String, heroImage: String, benefitImage: String,
  process: [{ step: String, title: L, desc: L }],
  benefits: { en: [String], ta: [String] },
  faqs: [{ q: L, a: L }],
  status: String }, { strict: false });
const BlogPostSchema = new mongoose.Schema({ title: L, slug: String, category: L, content: mongoose.Schema.Types.Mixed,
  author: L, tags: { en: [String], ta: [String] }, status: String }, { strict: false });
const TeamMemberSchema = new mongoose.Schema({ name: L, slug: String, role: L, bio: L,
  education: [{ degree: L, details: L }], skills: [{ name: L, percentage: Number }],
  status: String }, { strict: false });
const CaseStudySchema = new mongoose.Schema({ title: L, slug: String, category: L, overview: L,
  challenge: L, solution: L, results: L,
  faqs: [{ q: L, a: L }], status: String }, { strict: false });
const TestimonialSchema = new mongoose.Schema({ authorName: L, authorRole: L, quote: L, status: String }, { strict: false });
const PageSingletonSchema = new mongoose.Schema({ pageSlug: String, metaTitle: L, metaDescription: L,
  breadcrumb: { home: L, current: L }, content: mongoose.Schema.Types.Mixed }, { strict: false });
const SiteSettingsSchema = new mongoose.Schema({ singletonKey: String }, { strict: false });

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
const CaseStudy = mongoose.models.CaseStudy || mongoose.model('CaseStudy', CaseStudySchema);
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
const PageSingleton = mongoose.models.PageSingleton || mongoose.model('PageSingleton', PageSingletonSchema);
const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

// ── Check if a key path is migrated to MongoDB ───────────────────────────
function isMigrated(keyPath, dbSnapshot) {
  const { services, blogs, team, cases, testimonials, pages, settings } = dbSnapshot;

  // ── serviceSinglePage.services.<id>.* → Service collection ───────────────
  const ssm = keyPath.match(/^serviceSinglePage\.services\.(\w+)\.(.+)$/);
  if (ssm) {
    const [, svcId, field] = ssm;
    const svc = services.find(s => s.slug === svcId);
    if (!svc) return false;
    // process/benefits/faqs arrays
    if (field.startsWith('process[')) return svc.process?.length > 0;
    if (field.startsWith('benefits[') || field === 'benefits') return svc.benefits?.en?.length > 0;
    if (field.startsWith('faqs[')) return svc.faqs?.length > 0;
    // check direct field
    const val = svc[field.split('.')[0]];
    return val !== undefined && val !== null && val !== '';
  }

  // ── servicesPage.items.<id>.* → Service.name / slug via pageSingleton ────
  if (keyPath.startsWith('servicesPage.items.')) {
    const parts = keyPath.split('.');
    const svcId = parts[2]; // e.g. opd, clinic
    const svc = services.find(s => s.slug === svcId || s.slug === svcId.toLowerCase());
    return !!svc;
  }

  // ── blogPage.posts.* → BlogPost collection ────────────────────────────────
  if (keyPath.startsWith('blogPage.posts.post')) {
    return blogs.length > 0;
  }

  // ── blogSinglePage.body.* → BlogPost content structured ──────────────────
  if (keyPath.startsWith('blogSinglePage.body.')) {
    const field = keyPath.replace('blogSinglePage.body.', '');
    return blogs.some(b => b.content && (typeof b.content === 'object' ? b.content.en || b.content[field] : b.content));
  }
  if (keyPath.startsWith('blogSinglePage.')) return blogs.length > 0;

  // ── teamPage.members.* → TeamMember collection ────────────────────────────
  if (keyPath.startsWith('teamPage.members.')) {
    const memberId = keyPath.split('.')[2];
    return team.some(m => {
      const slug = m.slug || '';
      return slug.includes(memberId) || (m.name?.en || '').toLowerCase().includes(memberId.toLowerCase());
    });
  }

  // ── teamSinglePage → TeamMember exists ───────────────────────────────────
  if (keyPath.startsWith('teamSinglePage.')) return team.length > 0;

  // ── testimonialsPage.items.* → Testimonial collection ────────────────────
  if (keyPath.startsWith('testimonialsPage.items.')) return testimonials.length > 0;

  // ── caseStudyPage.items.* → CaseStudy collection ─────────────────────────
  if (keyPath.startsWith('caseStudyPage.items.')) {
    const csId = keyPath.split('.')[2]; // cs1-cs6
    const idx = parseInt(csId.replace('cs', '')) - 1;
    return cases.length > idx;
  }
  if (keyPath.startsWith('caseStudySinglePage.')) return cases.length > 0;

  // ── faqsPage.sections.* → PageSingleton 'faqs' content ───────────────────
  if (keyPath.startsWith('faqsPage.sections.')) {
    const pg = pages.find(p => p.pageSlug === 'faqs');
    if (!pg?.content?.sections) return false;
    const cat = keyPath.split('.')[2];
    return !!pg.content.sections?.[cat];
  }
  if (keyPath.startsWith('faqsPage.')) {
    return pages.some(p => p.pageSlug === 'faqs');
  }

  // ── pricingPage.plans.* → PageSingleton 'pricing' content ────────────────
  if (keyPath.startsWith('pricingPage.plans.')) {
    const pg = pages.find(p => p.pageSlug === 'pricing');
    if (!pg?.content?.plans) return false;
    const planId = keyPath.split('.')[2];
    return !!pg.content.plans?.[planId];
  }
  if (keyPath.startsWith('pricingPage.')) {
    return pages.some(p => p.pageSlug === 'pricing');
  }

  // ── nav.* → SiteSettings navigation ─────────────────────────────────────
  if (keyPath.startsWith('nav.')) {
    return settings?.navigation?.length > 0;
  }

  // ── footer.* → SiteSettings footer ──────────────────────────────────────
  if (keyPath.startsWith('footer.')) {
    return !!settings?.singletonKey;
  }

  // ── common.* → SiteSettings sharedBlocks ────────────────────────────────
  if (keyPath.startsWith('common.')) {
    return !!settings?.sharedBlocks;
  }

  // ── Page singletons ───────────────────────────────────────────────────────
  const pageMap = {
    'homePage': 'home', 'aboutPage': 'about', 'servicesPage': 'services',
    'serviceSinglePage': 'services',
    'blogPage': 'blog', 'caseStudyPage': 'case-study', 'teamPage': 'team',
    'testimonialsPage': 'testimonials', 'imageGalleryPage': 'image-gallery',
    'videoGalleryPage': 'video-gallery', 'pricingPage': 'pricing',
    'faqsPage': 'faqs', 'contactPage': 'contact',
    'bookAppointmentPage': 'book-appointment', 'notFoundPage': '404',
  };
  const prefix = keyPath.split('.')[0];
  if (pageMap[prefix]) {
    return pages.some(p => p.pageSlug === pageMap[prefix]);
  }

  return false;
}

async function main() {
  await mongoose.connect(MONGODB_URI);

  // Load dictionaries
  const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
  const ta = JSON.parse(fs.readFileSync('messages/ta.json', 'utf8'));

  const flatEn = flatten(en);
  const flatTa = flatten(ta);
  const allKeys = new Set([...Object.keys(flatEn), ...Object.keys(flatTa)]);

  // Load DB snapshot
  const [services, blogs, team, cases, testimonials, pages, settingsArr] = await Promise.all([
    Service.find({}).lean(),
    BlogPost.find({}).lean(),
    TeamMember.find({}).lean(),
    CaseStudy.find({}).lean(),
    Testimonial.find({}).lean(),
    PageSingleton.find({}).lean(),
    SiteSettings.find({}).lean(),
  ]);
  const settings = settingsArr[0] || null;
  const dbSnapshot = { services, blogs, team, cases, testimonials, pages, settings };

  // Build report rows (leaf strings/arrays only — skip intermediate object nodes)
  const rows = [];
  for (const key of [...allKeys].sort()) {
    const enEntry = flatEn[key];
    const taEntry = flatTa[key];
    // Skip pure array container entries (children are included)
    const type = enEntry?.type || taEntry?.type || 'unknown';
    if (type === 'array') continue; // children already flattened
    const inEn = !!enEntry;
    const inTa = !!taEntry;
    const migrated = isMigrated(key, dbSnapshot);
    const isPageKey = [
      'homePage', 'aboutPage', 'servicesPage', 'serviceSinglePage',
      'blogPage', 'blogSinglePage', 'caseStudyPage', 'caseStudySinglePage',
      'teamPage', 'teamSinglePage', 'testimonialsPage',
      'imageGalleryPage', 'videoGalleryPage', 'pricingPage',
      'faqsPage', 'contactPage', 'bookAppointmentPage', 'notFoundPage'
    ].some(prefix => key.startsWith(prefix + '.'));
    const isSettingsKey = ['nav.', 'footer.', 'common.'].some(prefix => key.startsWith(prefix));
    const editableInUi = UI_EDITABLE.has(key) || isPageKey || isSettingsKey;
    let status = 'OK';
    if (!inTa) status = 'MISSING_TA';
    if (!migrated) status = status === 'OK' ? 'NOT_MIGRATED' : status + '+NOT_MIGRATED';
    if (!editableInUi) status = status === 'OK' ? 'NO_UI_CONTROL' : status === 'NOT_MIGRATED' ? 'NOT_MIGRATED+NO_UI' : status + '+NO_UI';
    rows.push({ key, type, inEn, inTa, migrated, editableInUi, status });
  }

  // JSON output
  fs.writeFileSync('content-coverage-report.json', JSON.stringify(rows, null, 2));

  // Markdown table
  const mdLines = [
    '# MST Content Coverage Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '| Key Path | Type | In EN | In TA | Migrated to DB | Editable in UI | Status |',
    '|---|---|---|---|---|---|---|',
  ];
  for (const r of rows) {
    mdLines.push(`| \`${r.key}\` | ${r.type} | ${r.inEn ? '✅' : '❌'} | ${r.inTa ? '✅' : '❌'} | ${r.migrated ? '✅' : '❌'} | ${r.editableInUi ? '✅' : '❌'} | ${r.status} |`);
  }

  // Summary
  const total = rows.length;
  const migCount = rows.filter(r => r.migrated).length;
  const uiCount = rows.filter(r => r.editableInUi).length;
  const failing = rows.filter(r => !r.migrated || !r.editableInUi);

  const summary = [
    '', '---', '## Summary',
    `- **Total key paths:** ${total}`,
    `- **Migrated to DB:** ${migCount} / ${total} (${Math.round(migCount/total*100)}%)`,
    `- **Editable in UI:** ${uiCount} / ${total} (${Math.round(uiCount/total*100)}%)`,
    '',
    '### Failing key paths (not migrated OR not editable in UI):',
    ...failing.map(r => `- \`${r.key}\` — **${r.status}**`),
  ];
  mdLines.push(...summary);
  fs.writeFileSync('content-coverage-report.md', mdLines.join('\n'));

  // Console summary
  console.log('\n=== CONTENT COVERAGE AUDIT ===');
  console.log(`Total key paths:  ${total}`);
  console.log(`Migrated to DB:   ${migCount}/${total} (${Math.round(migCount/total*100)}%)`);
  console.log(`Editable in UI:   ${uiCount}/${total} (${Math.round(uiCount/total*100)}%)`);
  console.log(`\nFailing paths (${failing.length}):`);
  failing.forEach(r => console.log(`  [${r.status}] ${r.key}`));
  console.log('\nOutputs: content-coverage-report.json, content-coverage-report.md');

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
