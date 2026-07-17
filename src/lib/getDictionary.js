import 'server-only';
import fs from 'fs';
import path from 'path';

const dictionaries = {
  en: () => import('../../messages/en.json').then((m) => m.default),
  ta: () => import('../../messages/ta.json').then((m) => m.default),
};

export const locales = ['ta', 'en'];
export const defaultLocale = 'ta';

export function hasLocale(locale) {
  return ['en', 'ta'].includes(locale);
}

// Helper to project localized {en, ta} structure to a flat value for the current locale
function shouldSkipWrap(path) {
  if (!path) return true;
  const p = path.toLowerCase();
  return p.includes('url') || p.includes('link') || p.includes('href') || 
         p.includes('src') || p.includes('image') || p.includes('photo') || 
         p.includes('logo') || p.includes('icon') || p.includes('avatar') || 
         p.includes('bg') || p.includes('color') || p.includes('class') || 
         p.includes('style') || p.includes('id') || p.startsWith('metatitle') || 
         p.startsWith('metadescription') || p.endsWith('.en') || p.endsWith('.ta');
}

// Helper to project localized {en, ta} structure to a flat value for the current locale
function projectLocale(obj, locale, path = '', inPreview = false, langSuffix = '') {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map((item, idx) => projectLocale(item, locale, path ? `${path}.${idx}` : `${idx}`, inPreview, langSuffix));
  }
  if (typeof obj === 'object') {
    const objKeys = Object.keys(obj);
    // Detect localized leaf: has only 'en' and/or 'ta' keys (at least one)
    const isLocalized = objKeys.length > 0 && objKeys.every(k => k === 'en' || k === 'ta') && ('en' in obj || 'ta' in obj);
    if (isLocalized) {
      const val = obj[locale] !== undefined ? obj[locale] : (obj.en ?? '');
      const langCode = obj[locale] !== undefined ? locale : 'en';
      return projectLocale(val, locale, path, inPreview, langCode);
    }
    const result = {};
    for (const k of objKeys) {
      let nextPath = path;
      if (k === 'content') {
        nextPath = '';
      } else {
        nextPath = path ? `${path}.${k}` : k;
      }
      result[k] = projectLocale(obj[k], locale, nextPath, inPreview, langSuffix);
    }
    return result;
  }
  if (inPreview && typeof obj === 'string' && obj && path && !shouldSkipWrap(path)) {
    const fieldPath = langSuffix ? `${path}.${langSuffix}` : path;
    return `<span class="cms-highlight-target" data-field-path="${fieldPath}">${obj}</span>`;
  }
  return obj;
}

// Deep merge: target is overridden by source, but nested objects are merged recursively
function deepMerge(target, source) {
  if (typeof source !== 'object' || source === null || Array.isArray(source)) return source;
  if (typeof target !== 'object' || target === null || Array.isArray(target)) return source;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] !== null && source[key] !== undefined && source[key] !== '') {
      result[key] = deepMerge(target[key], source[key]);
    }
  }
  return result;
}

export async function getDictionary(locale) {
  // 1. Get static dictionary
  const baseDict = await (dictionaries[locale] ?? dictionaries.ta)();
  
  // Clone to avoid modifying the cached static import
  const dict = JSON.parse(JSON.stringify(baseDict));

  // 2. Fetch from MongoDB dynamically
  try {
    const { connectDB } = await import('./db');
    await connectDB();
    console.log(`[getDictionary] Fetching dynamic DB content for locale: ${locale}`);

    // Import models dynamically to avoid circular references/build issues
    const { default: SiteSettings } = await import('../models/SiteSettings');
    const { default: PageSingleton } = await import('../models/PageSingleton');
    const { default: Service } = await import('../models/Service');
    const { default: BlogPost } = await import('../models/BlogPost');
    const { default: TeamMember } = await import('../models/TeamMember');
    const { default: CaseStudy } = await import('../models/CaseStudy');
    const { default: Testimonial } = await import('../models/Testimonial');
    const { default: Event } = await import('../models/Event');

    // Load data
    const [settings, pages, services, blogs, team, cases, testimonials] = await Promise.all([
      SiteSettings.findOne({ singletonKey: 'site_settings' }).lean(),
      PageSingleton.find({}).lean(),
      Service.find({}).lean(),
      BlogPost.find({ status: 'published' }).lean(),
      TeamMember.find({ status: 'published' }).lean(),
      CaseStudy.find({ status: 'published' }).lean(),
      Testimonial.find({ status: 'published' }).lean(),
    ]);

    // 3. Check for Live Preview overrides (Step 4)
    let previewData = null;
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const token = cookieStore.get('mst_preview_token')?.value;
      if (token) {
        // Decode token using our jose-based helper
        const { verifyPreviewToken } = await import('./auth.js');
        const { valid, payload } = await verifyPreviewToken(token);
        if (valid && payload && payload.slug) {
          const globalStore = global.previewStore || {};
          previewData = globalStore[payload.slug];
        }
      }
    } catch (e) {
      // Ignore preview read errors outside of requests or if token is expired
    }

    // 4. Merge Site Settings
    if (settings) {
      const ps = projectLocale(settings, locale);
      if (ps.address) dict.footer.address = ps.address;
      if (ps.copyright) dict.footer.copyright = ps.copyright;
      if (ps.clinicHours) dict.common.emergencySupport.scheduleHours = ps.clinicHours;

      // Nav
      if (Array.isArray(ps.navigation)) {
        const navMap = {
          '/': 'home',
          '/about': 'aboutUs',
          '/services': 'services.label',
          '/blog': 'blog',
          '/contact': 'contactUs',
          '/book-appointment': 'bookAppointment'
        };
        ps.navigation.forEach(item => {
          if (item.href === '/') dict.nav.home = item.label;
          else if (item.href === '/about') dict.nav.aboutUs = item.label;
          else if (item.href === '/services') dict.nav.services.label = item.label;
          else if (item.href === '/blog') dict.nav.blog = item.label;
          else if (item.href === '/contact') dict.nav.contactUs = item.label;
          else if (item.href === '/book-appointment') dict.nav.bookAppointment = item.label;
        });
      }

      // Footer quick links
      if (ps.footer?.quickLinks?.links) {
        dict.footer.quickLinks.heading = ps.footer.quickLinks.heading;
        const links = ps.footer.quickLinks.links;
        if (links[0]) dict.footer.quickLinks.home = links[0].label;
        if (links[1]) dict.footer.quickLinks.aboutUs = links[1].label;
        if (links[2]) dict.footer.quickLinks.ourServices = links[2].label;
        if (links[3]) dict.footer.quickLinks.contactUs = links[3].label;
      }

      // Footer medical services
      if (ps.footer?.medicalServices?.links) {
        dict.footer.medicalServices.heading = ps.footer.medicalServices.heading;
        const links = ps.footer.medicalServices.links;
        if (links[0]) dict.footer.medicalServices.opd = links[0].label;
        if (links[1]) dict.footer.medicalServices.physiotherapy = links[1].label;
        if (links[2]) dict.footer.medicalServices.laboratory = links[2].label;
        if (links[3]) dict.footer.medicalServices.homeVisit = links[3].label;
      }

      // Footer contact info
      if (ps.footer?.contactInfo) {
        dict.footer.contactInfo.heading = ps.footer.contactInfo.heading;
        dict.footer.contactInfo.phone1 = ps.footer.contactInfo.phone1;
        dict.footer.contactInfo.phone2 = ps.footer.contactInfo.phone2;
      }

      // Shared blocks
      if (ps.sharedBlocks) {
        const sb = ps.sharedBlocks;
        if (sb.factStatistics) {
          dict.common.factStatistics = { ...dict.common.factStatistics, ...sb.factStatistics };
        }
        if (sb.emergencySupport) {
          dict.common.emergencySupport = { ...dict.common.emergencySupport, ...sb.emergencySupport };
        }
        if (sb.coreFeatures) {
          dict.common.coreFeatures = { ...dict.common.coreFeatures, ...sb.coreFeatures };
        }
        if (sb.faqSection) {
          dict.common.faqSection.heading = sb.faqSection.heading;
          dict.common.faqSection.subTitle = sb.faqSection.subTitle;
          dict.common.faqSection.ctaHeading = sb.faqSection.ctaHeading;
          dict.common.faqSection.ctaDescription = sb.faqSection.ctaDescription;
          dict.common.faqSection.ctaButton = sb.faqSection.ctaButton;
          if (Array.isArray(sb.faqSection.items)) {
            sb.faqSection.items.forEach((item, idx) => {
              if (dict.common.faqSection.items[`q${idx + 1}`]) {
                dict.common.faqSection.items[`q${idx + 1}`].question = item.q;
                dict.common.faqSection.items[`q${idx + 1}`].answer = item.a;
              }
            });
          }
        }
      }
    }

    // 5. Merge Page Singletons
    const pageMap = {
      'home': 'homePage', 'about': 'aboutPage', 'services': 'servicesPage',
      'blog': 'blogPage', 'case-study': 'caseStudyPage', 'team': 'teamPage',
      'testimonials': 'testimonialsPage', 'image-gallery': 'imageGalleryPage',
      'video-gallery': 'videoGalleryPage', 'pricing': 'pricingPage',
      'faqs': 'faqsPage', 'contact': 'contactPage',
      'book-appointment': 'bookAppointmentPage', '404': 'notFoundPage'
    };

    pages.forEach(p => {
      const prefix = pageMap[p.pageSlug];
      if (!prefix) return;

      // Apply preview override if active for this page
      let pageData = p;
      if (previewData && previewData.pageSlug === p.pageSlug) {
        pageData = { ...p, ...previewData };
      }

      const isPreviewActive = !!(previewData && previewData.pageSlug === p.pageSlug);
      const projected = projectLocale(pageData, locale, '', isPreviewActive);
      if (projected.metaTitle) dict[prefix].metaTitle = projected.metaTitle;
      if (projected.metaDescription) {
        // Store as the canonical metaDescription field used by generateMetadata()
        dict[prefix].metaDescription = projected.metaDescription;
      }
      if (projected.breadcrumb) {
        dict[prefix].breadcrumb = {
          home: projected.breadcrumb.home,
          current: projected.breadcrumb.current
        };
      }

      if (projected.content) {
        dict[prefix] = deepMerge(dict[prefix], projected.content);
      }
    });
    console.log(`[getDictionary] Merged Pages. Home metaTitle is: "${dict.homePage?.metaTitle}"`);

    // Special override mapping for services, blog, case-study, team single page sub-blocks
    const singlePages = [
      { slug: 'services', prefix: 'serviceSinglePage' },
      { slug: 'blog', prefix: 'blogSinglePage' },
      { slug: 'case-study', prefix: 'caseStudySinglePage' },
      { slug: 'team', prefix: 'teamSinglePage' }
    ];

    singlePages.forEach(sp => {
      const pageDoc = pages.find(p => p.pageSlug === sp.slug);
      if (pageDoc) {
        let pageData = pageDoc;
        if (previewData && previewData.pageSlug === sp.slug) {
          pageData = { ...pageDoc, ...previewData };
        }
        const isPreviewActive = !!(previewData && previewData.pageSlug === sp.slug);
        const projected = projectLocale(pageData, locale, '', isPreviewActive);
        if (projected.content) {
          // If the keys are nested under the sub-block key name (like content.blogSinglePage), merge them
          if (projected.content[sp.prefix]) {
            dict[sp.prefix] = {
              ...dict[sp.prefix],
              ...projected.content[sp.prefix]
            };
          } else {
            // Fallback: merge entire content (for backwards compatibility/services old schema)
            dict[sp.prefix] = {
              ...dict[sp.prefix],
              ...projected.content
            };
          }
        }
      }
    });

    // 6. Merge Services Collection
    if (services.length > 0) {
      services.forEach(s => {
        const ps = projectLocale(s, locale);
        const slug = s.slug;

        // Map into serviceSinglePage.services[slug]
        dict.serviceSinglePage.services[slug] = {
          name: ps.name,
          tagline: ps.tagline,
          desc1: ps.desc1,
          desc2: ps.desc2,
          whyTitle: ps.whyTitle,
          whyDesc: ps.whyDesc,
          whyPoint1: ps.whyPoint1,
          whyPoint2: ps.whyPoint2,
          process: ps.process,
          benefits: ps.benefits,
          faqs: ps.faqs
        };

        // Map into servicesPage.items[slug]
        if (dict.servicesPage.items[slug]) {
          dict.servicesPage.items[slug].title = ps.name;
          dict.servicesPage.items[slug].description = ps.desc1;
        }
      });
    }

    // 7. Merge Blog Posts
    if (blogs.length > 0) {
      // Map posts
      blogs.forEach((b, idx) => {
        const postKey = `post${idx + 1}`;
        if (dict.blogPage.posts[postKey]) {
          const pb = projectLocale(b, locale);
          dict.blogPage.posts[postKey].title = pb.title;
          dict.blogPage.posts[postKey].category = pb.category;
        }
      });
    }

    // 8. Merge Team Members
    if (team.length > 0) {
      team.forEach(m => {
        const slug = m.slug;
        if (dict.teamPage.members[slug]) {
          const pm = projectLocale(m, locale);
          dict.teamPage.members[slug].name = pm.name;
          dict.teamPage.members[slug].role = pm.role;
        }
      });
    }

    // 9. Merge Case Studies
    if (cases.length > 0) {
      cases.forEach((c, idx) => {
        const csKey = `cs${idx + 1}`;
        if (dict.caseStudyPage.items[csKey]) {
          const pc = projectLocale(c, locale);
          dict.caseStudyPage.items[csKey].title = pc.title;
          dict.caseStudyPage.items[csKey].desc = pc.overview;
        }
      });
    }

    // 10. Merge Testimonials
    if (testimonials.length > 0) {
      testimonials.forEach((t, idx) => {
        const tKey = `t${idx + 1}`;
        if (dict.testimonialsPage.items[tKey]) {
          const pt = projectLocale(t, locale);
          dict.testimonialsPage.items[tKey].name = pt.authorName;
          dict.testimonialsPage.items[tKey].role = pt.authorRole;
          dict.testimonialsPage.items[tKey].quote = pt.quote;
        }
      });
    }

  } catch (e) {
    console.error('getDictionary Dynamic Merge Error:', e.message);
  }

  return dict;
}
