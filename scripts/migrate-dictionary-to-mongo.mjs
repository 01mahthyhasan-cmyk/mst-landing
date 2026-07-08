import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// Load env variables
try {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value.trim();
      }
    });
  }
} catch (err) {
  console.warn('Warning: Could not load .env.local:', err.message);
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in env!');
  process.exit(1);
}

// Import models
import User from '../src/models/User.js';
import Service from '../src/models/Service.js';
import BlogPost from '../src/models/BlogPost.js';
import TeamMember from '../src/models/TeamMember.js';
import CaseStudy from '../src/models/CaseStudy.js';
import Testimonial from '../src/models/Testimonial.js';
import PageSingleton from '../src/models/PageSingleton.js';
import SiteSettings from '../src/models/SiteSettings.js';

async function run() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  // Read dictionary files
  console.log('Reading dictionaries...');
  const en = JSON.parse(fs.readFileSync(path.resolve('messages/en.json'), 'utf8'));
  const ta = JSON.parse(fs.readFileSync(path.resolve('messages/ta.json'), 'utf8'));

  const superAdmin = await User.findOne({ role: 'super_admin' });
  const adminId = superAdmin?._id || new mongoose.Types.ObjectId();

  const unmappedKeys = [];

  // Helper to extract localized text
  const getLoc = (pathStr) => {
    const parts = pathStr.split('.');
    let valEn = en;
    let valTa = ta;
    for (const part of parts) {
      valEn = valEn ? valEn[part] : undefined;
      valTa = valTa ? valTa[part] : undefined;
    }
    if (valEn === undefined && valTa === undefined) {
      unmappedKeys.push(pathStr);
    }
    return { en: valEn || '', ta: valTa || '' };
  };

  // 1. Migrate Global Site Settings
  console.log('Migrating Site Settings...');
  const settingsData = {
    singletonKey: 'site_settings',
    siteTitle: 'MST Health Care',
    siteDescription: getLoc('homePage.metaTitle'),
    logo: '/images/mst_logo.png',
    favicon: '/images/favicon.png',
    phone1: '065 205 4997',
    phone2: '076 295 1343',
    phone3: '076 225 1343',
    email: 'contact@msthealthcare.com',
    address: getLoc('footer.address'),
    clinicHours: getLoc('common.emergencySupport.scheduleHours'),
    copyright: getLoc('footer.copyright'),
    facebookLink: 'https://www.facebook.com/people/MST-Health-Care/61590818814946/',
    instagramLink: '#',
    whatsappLink: '#',
    twitterLink: '#',
    navigation: [
      { label: getLoc('nav.home'), href: '/', order: 1 },
      { label: getLoc('nav.aboutUs'), href: '/about', order: 2 },
      { label: getLoc('nav.services.label'), href: '/services', order: 3 },
      { label: getLoc('nav.blog'), href: '/blog', order: 4 },
      { label: getLoc('nav.contactUs'), href: '/contact', order: 5 },
    ],
    footer: {
      quickLinks: {
        heading: getLoc('footer.quickLinks.heading'),
        links: [
          { label: getLoc('footer.quickLinks.home'), href: '/' },
          { label: getLoc('footer.quickLinks.aboutUs'), href: '/about' },
          { label: getLoc('footer.quickLinks.ourServices'), href: '/services' },
          { label: getLoc('footer.quickLinks.contactUs'), href: '/contact' },
        ]
      },
      medicalServices: {
        heading: getLoc('footer.medicalServices.heading'),
        links: [
          { label: getLoc('footer.medicalServices.opd'), href: '/service-single?service=opd' },
          { label: getLoc('footer.medicalServices.physiotherapy'), href: '/service-single?service=physiotherapy' },
          { label: getLoc('footer.medicalServices.laboratory'), href: '/service-single?service=laboratory' },
          { label: getLoc('footer.medicalServices.homeVisit'), href: '/service-single?service=homeVisit' },
        ]
      }
    },
    sharedBlocks: {
      factStatistics: {
        subTitle: getLoc('common.factStatistics.subTitle'),
        heading: getLoc('common.factStatistics.heading'),
        professionalTeam: {
          label: getLoc('common.factStatistics.professionalTeam.label'),
          description: getLoc('common.factStatistics.professionalTeam.description'),
        },
        medicalDepartments: {
          label: getLoc('common.factStatistics.medicalDepartments.label'),
          description: getLoc('common.factStatistics.medicalDepartments.description'),
        },
        emergencySupport: {
          label: getLoc('common.factStatistics.emergencySupport.label'),
          description: getLoc('common.factStatistics.emergencySupport.description'),
        },
        servicesFooter: getLoc('common.factStatistics.servicesFooter'),
        trustedUsers: getLoc('common.factStatistics.trustedUsers'),
      },
      emergencySupport: {
        subTitle: getLoc('common.emergencySupport.subTitle'),
        heading: getLoc('common.emergencySupport.heading'),
        description: getLoc('common.emergencySupport.description'),
        scheduleHeading: getLoc('common.emergencySupport.scheduleHeading'),
        scheduleLabel: getLoc('common.emergencySupport.scheduleLabel'),
        scheduleHours: getLoc('common.emergencySupport.scheduleHours'),
        ctaButton: getLoc('common.emergencySupport.ctaButton'),
      },
      coreFeatures: {
        subTitle: getLoc('common.coreFeatures.subTitle'),
        heading: getLoc('common.coreFeatures.heading'),
        description: getLoc('common.coreFeatures.description'),
        contactButton: getLoc('common.coreFeatures.contactButton'),
        items: {
          qualityTreatment: getLoc('common.coreFeatures.items.qualityTreatment'),
          personalizedCare: getLoc('common.coreFeatures.items.personalizedCare'),
        }
      },
      faqSection: {
        subTitle: getLoc('common.faqSection.subTitle'),
        heading: getLoc('common.faqSection.heading'),
        ctaHeading: getLoc('common.faqSection.ctaHeading'),
        ctaDescription: getLoc('common.faqSection.ctaDescription'),
        ctaButton: getLoc('common.faqSection.ctaButton'),
        items: [
          { q: getLoc('common.faqSection.items.q1.question'), a: getLoc('common.faqSection.items.q1.answer') },
          { q: getLoc('common.faqSection.items.q2.question'), a: getLoc('common.faqSection.items.q2.answer') },
          { q: getLoc('common.faqSection.items.q3.question'), a: getLoc('common.faqSection.items.q3.answer') },
        ]
      }
    },
    updatedBy: adminId
  };

  await SiteSettings.findOneAndUpdate(
    { singletonKey: 'site_settings' },
    settingsData,
    { upsert: true, new: true }
  );
  console.log('✓ Site settings migrated!');

  // 2. Migrate Services
  console.log('Migrating Services collection...');
  await Service.deleteMany({}); // Reset for fresh migration
  const serviceKeys = ['opd', 'physiotherapy', 'laboratory', 'homeVisit', 'ambulance', 'medicalCamps'];
  for (const sKey of serviceKeys) {
    const name = getLoc(`servicesPage.items.${sKey}.title`);
    if (!name.en) continue;

    await Service.create({
      name,
      slug: sKey === 'medicalCamps' ? 'medical-camps' : sKey.toLowerCase(),
      iconClass: sKey === 'opd' ? 'fa-solid fa-stethoscope' : 'fa-solid fa-user-doctor',
      listingIcon: `/images/icon-${sKey}.svg`,
      heroImage: `/images/service-hero-${sKey}.jpg`,
      benefitImage: `/images/service-benefit-${sKey}.jpg`,
      desc1: getLoc(`servicesPage.items.${sKey}.description`),
      desc2: getLoc(`servicesPage.items.${sKey}.description`),
      whyTitle: { en: 'Why Choose Our Service', ta: 'எங்கள் சேவையை ஏன் தேர்வு செய்ய வேண்டும்' },
      whyDesc: { en: 'Professional care and round-the-clock availability.', ta: 'தொழில்முறை சிகிச்சை மற்றும் 24 மணி நேர சேவை.' },
      whyPoint1: { en: '24/7 Support', ta: '24/7 உதவி' },
      whyPoint2: { en: 'Expert Staff', ta: 'நிபுணர் குழு' },
      benefits: {
        en: ['High Quality Treatments', 'Personalized Clinical Experience'],
        ta: ['உயர்தர சிகிச்சைகள்', 'தனிப்பயனாக்கப்பட்ட மருத்துவ அனுபவம்']
      },
      process: [
        { step: '01', title: { en: 'Book Session', ta: 'பதிவு செய்தல்' }, desc: { en: 'Select and schedule your session.', ta: 'உங்கள் அமர்வைத் தேர்ந்தெடுத்து திட்டமிடுங்கள்.' } },
        { step: '02', title: { en: 'Consultation', ta: 'ஆலோசனை' }, desc: { en: 'Meet our doctors.', ta: 'எங்கள் மருத்துவர்களை சந்திக்கவும்.' } }
      ],
      status: 'published',
      createdBy: adminId,
      updatedBy: adminId
    });
  }
  console.log(`✓ Seeded ${serviceKeys.length} Services!`);

  // 3. Migrate Blog Posts
  console.log('Migrating Blog Posts...');
  await BlogPost.deleteMany({});
  for (let i = 1; i <= 6; i++) {
    const title = getLoc(`blogPage.posts.post${i}.title`);
    if (!title.en) continue;

    await BlogPost.create({
      title,
      slug: `health-tips-post-${i}`,
      category: getLoc(`blogPage.posts.post${i}.category`),
      image: `/images/post-${i}.jpg`,
      author: { en: 'MST Admin', ta: 'MST நிர்வாகி' },
      publishDate: new Date(),
      content: {
        en: 'Detailed health and wellness guide content from the MST medical library. Stay safe and healthy.',
        ta: 'MST மருத்துவ நூலகத்திலிருந்து விரிவான ஆரோக்கிய வழிகாட்டி உள்ளடக்கம். பாதுகாப்பாகவும் ஆரோக்கியமாகவும் இருங்கள்.'
      },
      tags: {
        en: ['Health Tips', 'Medical Care'],
        ta: ['ஆரோக்கிய குறிப்புகள்', 'மருத்துவ பராமரிப்பு']
      },
      status: 'published',
      createdBy: adminId,
      updatedBy: adminId
    });
  }
  console.log('✓ Seeded Blog Posts!');

  // 4. Migrate Team Members
  console.log('Migrating Team Members...');
  await TeamMember.deleteMany({});
  for (let i = 1; i <= 6; i++) {
    const name = getLoc(`teamPage.members.member${i}.name`);
    if (!name.en) continue;

    await TeamMember.create({
      name,
      slug: `doctor-profile-member-${i}`,
      role: getLoc(`teamPage.members.member${i}.role`),
      image: `/images/team-${i}.jpg`,
      phone: '065 205 4997',
      email: `doctor${i}@msthealthcare.com`,
      position: getLoc(`teamPage.members.member${i}.role`),
      location: { en: 'Batticaloa, Sri Lanka', ta: 'மட்டக்களப்பு, இலங்கை' },
      bio: {
        en: 'Highly qualified and dedicated consulting medical professional at MST Health Care.',
        ta: 'மட்டக்களப்பு MST ஹெல்த் கேர் நிறுவனத்தின் தகுதிவாய்ந்த மற்றும் அர்ப்பணிப்புள்ள மருத்துவ ஆலோசகர்.'
      },
      education: [
        { degree: { en: 'MBBS', ta: 'MBBS' }, details: { en: 'Faculty of Medicine', ta: 'மருத்துவ பீடம்' } }
      ],
      skills: [
        { name: { en: 'Diagnostics', ta: 'பரிசோதனை திறன்' }, percentage: 90 }
      ],
      status: 'published',
      createdBy: adminId,
      updatedBy: adminId
    });
  }
  console.log('✓ Seeded Team Members!');

  // 5. Migrate Case Studies
  console.log('Migrating Case Studies...');
  await CaseStudy.deleteMany({});
  for (let i = 1; i <= 6; i++) {
    const title = getLoc(`caseStudyPage.items.case${i}.title`);
    if (!title.en) continue;

    await CaseStudy.create({
      title,
      slug: `case-study-item-${i}`,
      category: getLoc(`caseStudyPage.items.case${i}.category`),
      image: `/images/case-${i}.jpg`,
      client: { en: 'Community Clinic Patient', ta: 'சமூக மருத்துவ நோயாளி' },
      date: { en: 'March 2025', ta: 'மார்ச் 2025' },
      result: { en: 'Successful health stabilization', ta: 'வெற்றிகரமான ஆரோக்கிய மீட்பு' },
      overview: {
        en: 'Primary healthcare intervention details and patient evaluation results.',
        ta: 'முதன்மை சுகாதார தலையீடு மற்றும் நோயாளி மதிப்பீடு முடிவுகள்.'
      },
      challenge: {
        en: 'Critical local access challenges and delayed general consultations.',
        ta: 'முக்கிய உள்ளூர் மருத்துவ அணுகல் சவால்கள் மற்றும் தாமதமான ஆலோசனைகள்.'
      },
      status: 'published',
      createdBy: adminId,
      updatedBy: adminId
    });
  }
  console.log('✓ Seeded Case Studies!');

  // 6. Migrate Testimonials
  console.log('Migrating Testimonials...');
  await Testimonial.deleteMany({});
  for (let i = 1; i <= 6; i++) {
    const name = getLoc(`testimonialsPage.items.t${i}.name`);
    if (!name.en) continue;

    await Testimonial.create({
      authorName: name,
      authorRole: getLoc(`testimonialsPage.items.t${i}.role`),
      authorImage: `/images/testimonial-${i}.jpg`,
      quote: getLoc(`testimonialsPage.items.t${i}.quote`),
      status: 'published',
      createdBy: adminId,
      updatedBy: adminId
    });
  }
  console.log('✓ Seeded Testimonials!');

  // 7. Migrate Page Singletons
  console.log('Migrating Page Singletons (14 pages)...');
  const pagesList = [
    { slug: 'home', prefix: 'homePage' },
    { slug: 'about', prefix: 'aboutPage' },
    { slug: 'services', prefix: 'servicesPage' },
    { slug: 'blog', prefix: 'blogPage' },
    { slug: 'case-study', prefix: 'caseStudyPage' },
    { slug: 'team', prefix: 'teamPage' },
    { slug: 'testimonials', prefix: 'testimonialsPage' },
    { slug: 'image-gallery', prefix: 'imageGalleryPage' },
    { slug: 'video-gallery', prefix: 'videoGalleryPage' },
    { slug: 'pricing', prefix: 'pricingPage' },
    { slug: 'faqs', prefix: 'faqsPage' },
    { slug: 'contact', prefix: 'contactPage' },
    { slug: 'book-appointment', prefix: 'bookAppointmentPage' },
    { slug: '404', prefix: 'notFoundPage' }
  ];

  for (const p of pagesList) {
    const metaTitle = getLoc(`${p.prefix}.metaTitle`);
    const heading = getLoc(`${p.prefix}.heading`);
    const breadcrumbHome = getLoc(`${p.prefix}.breadcrumb.home`);
    const breadcrumbCurrent = getLoc(`${p.prefix}.breadcrumb.current`);

    // Dynamic extraction of page contents
    const content = {};
    if (en[p.prefix]) {
      Object.keys(en[p.prefix]).forEach(k => {
        if (!['metaTitle', 'heading', 'breadcrumb'].includes(k)) {
          content[k] = getLoc(`${p.prefix}.${k}`);
        }
      });
    }

    await PageSingleton.findOneAndUpdate(
      { pageSlug: p.slug },
      {
        pageSlug: p.slug,
        metaTitle,
        metaDescription: getLoc(`${p.prefix}.hero.description`) || getLoc(`${p.prefix}.description`) || { en: 'MST Health Care medical services description', ta: 'MST ஹெல்த் கேர் மருத்துவ சேவைகள் விளக்கம்' },
        breadcrumb: {
          home: breadcrumbHome.en ? breadcrumbHome : { en: 'Home', ta: 'முகப்பு' },
          current: breadcrumbCurrent.en ? breadcrumbCurrent : heading
        },
        content,
        updatedBy: adminId
      },
      { upsert: true, new: true }
    );
    console.log(`✓ Page singleton migrated: ${p.slug}`);
  }

  console.log('\n--- Migration Results ---');
  console.log('Unmapped or Missing Keys:', unmappedKeys.length);
  if (unmappedKeys.length > 0) {
    console.log('Unmapped keys log written to migration_unmapped_keys.log');
    fs.writeFileSync('migration_unmapped_keys.log', unmappedKeys.join('\n'));
  }
  console.log('Migration completed successfully!');
  process.exit(0);
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
