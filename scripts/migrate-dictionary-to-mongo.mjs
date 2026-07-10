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

  const getLocSchema = (pathStr) => {
    const getValueAtPath = (obj, pStr) => {
      const parts = pStr.split('.');
      let curr = obj;
      for (const p of parts) {
        if (curr === null || curr === undefined) return undefined;
        const match = p.match(/^(\w+)(?:\[(\d+)\])?$/);
        if (match) {
          const [, key, idx] = match;
          curr = curr[key];
          if (idx !== undefined && Array.isArray(curr)) {
            curr = curr[parseInt(idx)];
          }
        } else {
          curr = curr[p];
        }
      }
      return curr;
    };

    const enVal = getValueAtPath(en, pathStr);
    const taVal = getValueAtPath(ta, pathStr);

    if (typeof enVal !== 'object' || Array.isArray(enVal) || enVal === null) {
      if (enVal === undefined && taVal === undefined) {
        unmappedKeys.push(pathStr);
      }
      return { en: enVal || '', ta: taVal || '' };
    }

    const res = {};
    const keys = new Set([...Object.keys(enVal || {}), ...Object.keys(taVal || {})]);
    keys.forEach(k => {
      res[k] = getLocSchema(`${pathStr}.${k}`);
    });
    return res;
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
      { label: getLoc('nav.bookAppointment'), href: '/book-appointment', order: 6 }
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
          { label: getLoc('footer.medicalServices.opd'), href: '/services/opd' },
          { label: getLoc('footer.medicalServices.physiotherapy'), href: '/services/physiotherapy' },
          { label: getLoc('footer.medicalServices.laboratory'), href: '/services/laboratory' },
          { label: getLoc('footer.medicalServices.homeVisit'), href: '/services/homevisit' },
        ]
      },
      contactInfo: {
        heading: getLoc('footer.getInTouch'),
        phone1: '065 205 4997',
        phone2: '076 295 1343'
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
          advancedDiagnostic: getLoc('common.coreFeatures.items.advancedDiagnostic'),
          emergencySupport: getLoc('common.coreFeatures.items.emergencySupport'),
          experiencedProfessionals: getLoc('common.coreFeatures.items.experiencedProfessionals'),
          fastAccurate: getLoc('common.coreFeatures.items.fastAccurate'),
          modernFacilities: getLoc('common.coreFeatures.items.modernFacilities'),
          safeEnvironment: getLoc('common.coreFeatures.items.safeEnvironment'),
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
          { q: getLoc('common.faqSection.items.q4.question'), a: getLoc('common.faqSection.items.q4.answer') },
          { q: getLoc('common.faqSection.items.q5.question'), a: getLoc('common.faqSection.items.q5.answer') },
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

  // 2. Migrate Services (ALL 10 services from both servicesPage and serviceSinglePage)
  console.log('Migrating Services collection...');
  await Service.deleteMany({}); // Reset for fresh migration
  const serviceKeys = [
    'opd', 'clinic', 'ecg', 'physiotherapy', 'specialist', 
    'laboratory', 'nebulizer', 'elders', 'homevisit', 'ambulance'
  ];

  const iconClasses = {
    opd: 'fa-solid fa-stethoscope',
    clinic: 'fa-solid fa-clinic-medical',
    ecg: 'fa-solid fa-heart-pulse',
    physiotherapy: 'fa-solid fa-wheelchair',
    specialist: 'fa-solid fa-user-md',
    laboratory: 'fa-solid fa-flask',
    nebulizer: 'fa-solid fa-lungs',
    elders: 'fa-solid fa-blind',
    homevisit: 'fa-solid fa-house-medical',
    ambulance: 'fa-solid fa-ambulance'
  };

  for (const sKey of serviceKeys) {
    const titleKey = `servicesPage.items.${sKey}.title`;
    const name = getLoc(`serviceSinglePage.services.${sKey}.name`).en 
      ? getLoc(`serviceSinglePage.services.${sKey}.name`) 
      : getLoc(titleKey);

    const sDetails = en.serviceSinglePage?.services?.[sKey] || {};
    const processData = [];
    if (Array.isArray(sDetails.process)) {
      sDetails.process.forEach((p, idx) => {
        processData.push({
          step: p.step || `0${idx + 1}`,
          title: getLoc(`serviceSinglePage.services.${sKey}.process[${idx}].title`),
          desc: getLoc(`serviceSinglePage.services.${sKey}.process[${idx}].desc`)
        });
      });
    }

    const benefitsData = { en: [], ta: [] };
    if (Array.isArray(sDetails.benefits)) {
      sDetails.benefits.forEach((_, idx) => {
        const bLoc = getLoc(`serviceSinglePage.services.${sKey}.benefits[${idx}]`);
        benefitsData.en.push(bLoc.en);
        benefitsData.ta.push(bLoc.ta);
      });
    }

    const faqsData = [];
    if (Array.isArray(sDetails.faqs)) {
      sDetails.faqs.forEach((_, idx) => {
        faqsData.push({
          q: getLoc(`serviceSinglePage.services.${sKey}.faqs[${idx}].q`),
          a: getLoc(`serviceSinglePage.services.${sKey}.faqs[${idx}].a`)
        });
      });
    }

    await Service.create({
      name,
      slug: sKey,
      tagline: getLoc(`serviceSinglePage.services.${sKey}.tagline`),
      iconClass: iconClasses[sKey] || 'fa-solid fa-user-doctor',
      listingIcon: `/images/icon-${sKey}.svg`,
      heroImage: `/images/service-hero-${sKey}.jpg`,
      benefitImage: `/images/service-benefit-${sKey}.jpg`,
      desc1: getLoc(`serviceSinglePage.services.${sKey}.desc1`).en 
        ? getLoc(`serviceSinglePage.services.${sKey}.desc1`) 
        : getLoc(`servicesPage.items.${sKey}.description`),
      desc2: getLoc(`serviceSinglePage.services.${sKey}.desc2`),
      whyTitle: getLoc(`serviceSinglePage.services.${sKey}.whyTitle`).en 
        ? getLoc(`serviceSinglePage.services.${sKey}.whyTitle`) 
        : { en: 'Why Choose Our Service', ta: 'எங்கள் சேவையை ஏன் தேர்வு செய்ய வேண்டும்' },
      whyDesc: getLoc(`serviceSinglePage.services.${sKey}.whyDesc`).en 
        ? getLoc(`serviceSinglePage.services.${sKey}.whyDesc`) 
        : { en: 'Professional care and round-the-clock availability.', ta: 'தொழில்முறை சிகிச்சை மற்றும் 24 மணி நேர சேவை.' },
      whyPoint1: getLoc(`serviceSinglePage.services.${sKey}.whyPoint1`),
      whyPoint2: getLoc(`serviceSinglePage.services.${sKey}.whyPoint2`),
      process: processData,
      benefits: benefitsData,
      faqs: faqsData,
      status: 'published',
      createdBy: adminId,
      updatedBy: adminId
    });
  }
  console.log(`✓ Seeded ${serviceKeys.length} Services!`);

  // 3. Migrate Blog Posts with Structured Content
  console.log('Migrating Blog Posts...');
  await BlogPost.deleteMany({});
  
  // Custom structured bodies for all 6 blogs so they don't have empty placeholders
  const getBlogBody = (idx) => {
    if (idx === 1) {
      // Map en.json blogSinglePage.body exactly
      return {
        p1: getLoc('blogSinglePage.body.p1'),
        p2: getLoc('blogSinglePage.body.p2'),
        quote: getLoc('blogSinglePage.body.quote'),
        p3: getLoc('blogSinglePage.body.p3'),
        subHeading: getLoc('blogSinglePage.body.subHeading'),
        p4: getLoc('blogSinglePage.body.p4'),
        li1: getLoc('blogSinglePage.body.li1'),
        li2: getLoc('blogSinglePage.body.li2'),
        li3: getLoc('blogSinglePage.body.li3'),
        li4: getLoc('blogSinglePage.body.li4'),
        li5: getLoc('blogSinglePage.body.li5'),
        p5: getLoc('blogSinglePage.body.p5'),
      };
    } else {
      // Generate themed rich-text content for the other posts
      const cat = getLoc(`blogPage.posts.post${idx}.category`).en || 'General Health';
      const title = getLoc(`blogPage.posts.post${idx}.title`).en || 'Health Article';
      return {
        p1: { en: `Taking care of your health is vital in today's busy world. This article discusses key aspects of ${cat.toLowerCase()} and how small changes make a difference.`, ta: `இன்றைய பிஸியான உலகில் உங்கள் ஆரோக்கியத்தை கவனிப்பது மிக முக்கியம். இந்தக் கட்டுரை ${cat.toLowerCase()} பற்றிய முக்கிய அம்சங்களை விவாதிக்கிறது.` },
        p2: { en: `Understanding the primary factors influencing ${title.toLowerCase()} can empower you to take positive steps daily. Let's look at what researchers recommend.`, ta: `${title.toLowerCase()} ஐப் பாதிக்கும் முதன்மைக் காரணிகளைப் புரிந்துகொள்வது தினசரி சாதகமான நடவடிக்கைகளை எடுக்க உங்களுக்கு அதிகாரம் அளிக்கும்.` },
        quote: { en: `“Your health is an investment, not an expense. Treat your body with the respect and care it deserves.”`, ta: `“உங்கள் ஆரோக்கியம் ஒரு முதலீடு, செலவு அல்ல. உங்கள் உடலை அதற்குரிய மரியாதையுடனும் அக்கறையுடனும் நடத்துங்கள்.”` },
        p3: { en: 'Here are several key takeaways to keep in mind for long-term health stabilization and wellness:', ta: 'நீண்ட கால ஆரோக்கிய நிலைப்படுத்தல் மற்றும் நல்வாழ்வுக்காக நினைவில் கொள்ள வேண்டிய சில முக்கிய விஷயங்கள் இங்கே:' },
        subHeading: { en: `Key Tips for ${cat}`, ta: `${cat} க்கான முக்கிய குறிப்புகள்` },
        p4: { en: 'Integrating these practices into your lifestyle will bring positive improvements in physical energy and mental focus.', ta: 'இந்த நடைமுறைகளை உங்கள் வாழ்க்கை முறையில் ஒருங்கிணைப்பது உடல் ஆற்றல் மற்றும் மனக் கவனத்தில் நேர்மறையான மேம்பாடுகளைக் கொண்டுவரும்.' },
        li1: { en: 'Keep active and exercise regularly.', ta: 'சுறுசுறுப்பாக இருங்கள் மற்றும் தவறாமல் உடற்பயிற்சி செய்யுங்கள்.' },
        li2: { en: 'Eat a balanced and nutrient-dense diet.', ta: 'சீரான மற்றும் ஊட்டச்சத்துக்கள் நிறைந்த உணவை உண்ணுங்கள்.' },
        li3: { en: 'Stay hydrated throughout the day.', ta: 'நாள் முழுவதும் போதுமான அளவு தண்ணீர் குடிக்கவும்.' },
        li4: { en: 'Prioritize restorative sleep every night.', ta: 'ஒவ்வொரு இரவும் நல்ல தூக்கத்திற்கு முன்னுரிமை கொடுங்கள்.' },
        li5: { en: 'Schedule regular checkups with family doctors.', ta: 'குடும்ப மருத்துவர்களுடன் வழக்கமான பரிசோதனைகளை திட்டமிடுங்கள்.' },
        p5: { en: 'By focusing on these basic steps, you build a solid foundation for overall wellness and disease prevention.', ta: 'இந்த அடிப்படை படிகளில் கவனம் செலுத்துவதன் மூலம், ஒட்டுமொத்த நல்வாழ்வு மற்றும் நோய் தடுப்புக்கான உறுதியான அடித்தளத்தை உருவாக்குகிறீர்கள்.' }
      };
    }
  };

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
      content: getBlogBody(i),
      tags: {
        en: [getLoc('blogSinglePage.tags.healthTips').en || 'Health Tips', getLoc('blogSinglePage.tags.medicalCare').en || 'Medical Care'],
        ta: [getLoc('blogSinglePage.tags.healthTips').ta || 'ஆரோக்கிய குறிப்புகள்', getLoc('blogSinglePage.tags.medicalCare').ta || 'மருத்துவ பராமரிப்பு']
      },
      status: 'published',
      createdBy: adminId,
      updatedBy: adminId
    });
  }
  console.log('✓ Seeded Blog Posts!');

  // 4. Migrate Team Members with Education & Skills
  console.log('Migrating Team Members...');
  await TeamMember.deleteMany({});
  const memberKeys = ['arulanandem', 'murugamoorthy', 'sivaselvan', 'shobana', 'raj', 'sujikala'];
  for (const mKey of memberKeys) {
    const name = getLoc(`teamPage.members.${mKey}.name`);
    if (!name.en) continue;

    const bioData = {
      arulanandem: { en: 'Over 20 years of experience in primary healthcare, family medicine, and community health programs.', ta: 'முதன்மை சுகாதாரம், குடும்ப மருத்துவம் மற்றும் சமூக சுகாதார திட்டங்களில் 20 ஆண்டுகளுக்கு மேலான அனுபவம் கொண்டவர்.' },
      murugamoorthy: { en: 'Specialist consultant with expertise in chronic care management, complex diagnosis, and internal medicine.', ta: 'நாள்பட்ட நோய் மேலாண்மை, சிக்கலான நோயறிதல் மற்றும் உள் மருத்துவத்தில் நிபுணத்துவம் பெற்ற ஆலோசகர்.' },
      sivaselvan: { en: 'Dedicated family doctor providing primary care, pediatric consultations, and elderly health support.', ta: 'முதன்மை சிகிச்சை, குழந்தை நல ஆலோசனைகள் மற்றும் முதியோர் சுகாதார ஆதரவை வழங்கும் அர்ப்பணிப்புள்ள குடும்ப மருத்துவர்.' },
      shobana: { en: 'Compassionate family physician focusing on maternal health, wellness screening, and pediatric care.', ta: 'தாய் சேய் நலம், ஆரோக்கிய பரிசோதனை மற்றும் குழந்தை பராமரிப்பு ஆகியவற்றில் கவனம் செலுத்தும் அன்பான குடும்ப மருத்துவர்.' },
      raj: { en: 'Expert physiotherapist specializing in sports injury rehabilitation, pain management, and physical therapy.', ta: 'விளையாட்டு காயம் மறுவாழ்வு, வலி மேலாண்மை மற்றும் உடல் சிகிச்சையில் நிபுணத்துவம் பெற்ற உடற்பயிற்சி நிபுணர்.' },
      sujikala: { en: 'Consultant psychiatrist offering compassionate mental health consultations, counseling, and psychiatric care.', ta: 'மனநல ஆலோசனைகள், ஆலோசனை மற்றும் மனநல சிகிச்சைகளை வழங்கும் ஆலோசகர் மனநல மருத்துவர்.' }
    };

    const eduData = {
      arulanandem: [{ degree: { en: 'MBBS, DFM', ta: 'MBBS, DFM' }, details: { en: 'University of Peradeniya', ta: 'பேராதனை பல்கலைக்கழகம்' } }],
      murugamoorthy: [{ degree: { en: 'MD, MRCP', ta: 'MD, MRCP' }, details: { en: 'Postgraduate Institute of Medicine', ta: 'மருத்துவ முதுகலை நிறுவனம்' } }],
      sivaselvan: [{ degree: { en: 'MBBS', ta: 'MBBS' }, details: { en: 'University of Jaffna', ta: 'யாழ்ப்பாண பல்கலைக்கழகம்' } }],
      shobana: [{ degree: { en: 'MBBS', ta: 'MBBS' }, details: { en: 'Eastern University, Sri Lanka', ta: 'கிழக்கு பல்கலைக்கழகம், இலங்கை' } }],
      raj: [{ degree: { en: 'B.Sc. in Physiotherapy', ta: 'B.Sc. in Physiotherapy' }, details: { en: 'University of Colombo', ta: 'கொழும்பு பல்கலைக்கழகம்' } }],
      sujikala: [{ degree: { en: 'MD in Psychiatry', ta: 'MD in Psychiatry' }, details: { en: 'University of Colombo', ta: 'கொழும்பு பல்கலைக்கழகம்' } }]
    };

    const skillsData = {
      arulanandem: [{ name: { en: 'Family Medicine', ta: 'குடும்ப மருத்துவம்' }, percentage: 95 }, { name: { en: 'Primary Care', ta: 'முதன்மை சிகிச்சை' }, percentage: 90 }],
      murugamoorthy: [{ name: { en: 'Diagnostics', ta: 'நோயறிதல்' }, percentage: 95 }, { name: { en: 'Internal Medicine', ta: 'உள் மருத்துவம்' }, percentage: 90 }],
      sivaselvan: [{ name: { en: 'General Checkup', ta: 'பொது பரிசோதனை' }, percentage: 90 }, { name: { en: 'Geriatric Care', ta: 'முதியோர் பராமரிப்பு' }, percentage: 85 }],
      shobana: [{ name: { en: 'Maternal Care', ta: 'தாய் சேய் நலம்' }, percentage: 92 }, { name: { en: 'Pediatrics', ta: 'குழந்தை மருத்துவம்' }, percentage: 88 }],
      raj: [{ name: { en: 'Physical Therapy', ta: 'உடற்பயிற்சி சிகிச்சை' }, percentage: 96 }, { name: { en: 'Rehabilitation', ta: 'மறுவாழ்வு' }, percentage: 90 }],
      sujikala: [{ name: { en: 'Counseling', ta: 'ஆலோசனை வழிகாட்டல்' }, percentage: 93 }, { name: { en: 'Psychotherapy', ta: 'உளவியல் சிகிச்சை' }, percentage: 89 }]
    };

    await TeamMember.create({
      name,
      slug: mKey,
      role: getLoc(`teamPage.members.${mKey}.role`),
      image: `/images/team-${mKey}.jpg`,
      phone: '065 205 4997',
      email: `${mKey}@msthealthcare.com`,
      position: getLoc(`teamPage.members.${mKey}.role`),
      location: { en: 'Batticaloa, Sri Lanka', ta: 'மட்டக்களப்பு, இலங்கை' },
      bio: bioData[mKey] || { en: 'Dedicated medical professional at MST Health Care.', ta: 'MST ஹெல்த் கேர் நிறுவனத்தின் அர்ப்பணிப்புள்ள மருத்துவ நிபுணர்.' },
      education: eduData[mKey] || [{ degree: { en: 'MBBS', ta: 'MBBS' }, details: { en: 'Medical College', ta: 'மருத்துவக் கல்லூரி' } }],
      skills: skillsData[mKey] || [{ name: { en: 'Diagnostics', ta: 'பரிசோதனை திறன்' }, percentage: 90 }],
      status: 'published',
      createdBy: adminId,
      updatedBy: adminId
    });
  }
  console.log('✓ Seeded Team Members!');

  // 5. Migrate Case Studies with Solutions, Results, FAQs (Authored Fresh)
  console.log('Migrating Case Studies...');
  await CaseStudy.deleteMany({});
  for (let i = 1; i <= 6; i++) {
    const title = getLoc(`caseStudyPage.items.cs${i}.title`);
    if (!title.en) continue;

    const solutionsData = [
      { title: { en: 'Personalized Treatment Plan', ta: 'தனிப்பயனாக்கப்பட்ட சிகிச்சை திட்டம்' }, desc: { en: 'A custom treatment and lifestyle management plan was formulated for the patient.', ta: 'நோயாளிக்காக தனிப்பயனாக்கப்பட்ட சிகிச்சை மற்றும் வாழ்க்கை முறை மேலாண்மை திட்டம் உருவாக்கப்பட்டது.' } },
      { title: { en: 'Regular Care Monitoring', ta: 'வழக்கமான பராமரிப்பு கண்காணிப்பு' }, desc: { en: 'Structured health checkups and blood level controls were performed weekly.', ta: 'வாராந்திர அடிப்படையில் ஒழுங்கமைக்கப்பட்ட உடல்நலப் பரிசோதனைகள் மற்றும் இரத்தக் கட்டுப்பாடுகள் செய்யப்பட்டன.' } }
    ];

    const resultsData = [
      { title: { en: 'Stabilized Vital Signs', ta: 'நிலையான முக்கிய அறிகுறிகள்' }, desc: { en: 'Patient blood pressure and heart rate returned to normal levels within a month.', ta: 'நோயாளிக்கு இரத்த அழுத்தம் மற்றும் இதயத் துடிப்பு ஒரு மாதத்திற்குள் இயல்பு நிலைக்குத் திரும்பியது.' } },
      { title: { en: 'Improved Quality of Life', ta: 'மேம்பட்ட வாழ்க்கை தரம்' }, desc: { en: 'Active movement and physical strength improved by over 80% through recovery.', ta: 'மீட்பு மூலம் சுறுசுறுப்பான இயக்கம் மற்றும் உடல் வலிமை 80% க்கும் மேல் மேம்பட்டது.' } }
    ];

    const faqsData = [
      { q: { en: 'What was the duration of the treatment?', ta: 'சிகிச்சையின் காலம் என்ன?' }, a: { en: 'The initial intensive care phase lasted 6 weeks, followed by monthly follow-ups.', ta: 'ஆரம்பகட்ட தீவிர சிகிச்சை கட்டம் 6 வாரங்கள் நீடித்தது, அதைத் தொடர்ந்து மாதாந்திர பின்தொடர்தல்கள் இருந்தன.' } },
      { q: { en: 'Did the patient require surgery?', ta: 'நோயாளிக்கு அறுவை சிகிச்சை தேவையா?' }, a: { en: 'No, rehabilitation and clinical care resolved the symptoms successfully.', ta: 'இல்லை, மறுவாழ்வு மற்றும் மருத்துவப் பராமரிப்பு வெற்றிகரமாக அறிகுறிகளைக் குணப்படுத்தின.' } }
    ];

    await CaseStudy.create({
      title,
      slug: `cs${i}`,
      category: getLoc(`homePage.caseStudy.items.elderscare.title`), // generic localized category
      image: `/images/case-${i}.jpg`,
      client: { en: 'Batticaloa Resident', ta: 'மட்டக்களப்பு குடியிருப்பாளர்' },
      date: { en: 'March 2025', ta: 'மார்ச் 2025' },
      result: { en: 'Successful health stabilization', ta: 'வெற்றிகரமான ஆரோக்கிய மீட்பு' },
      overview: {
        en: 'Primary healthcare intervention details and patient evaluation results showing progressive recovery.',
        ta: 'முதன்மை சுகாதார தலையீடு மற்றும் நோயாளி மதிப்பீடு முடிவுகள் படிப்படியான மீட்சியைக் காட்டுகின்றன.'
      },
      challenge: {
        en: 'Critical local access challenges and delayed general consultations impacted early diagnosis.',
        ta: 'முக்கிய உள்ளூர் மருத்துவ அணுகல் சவால்கள் மற்றும் தாமதமான ஆலோசனைகள் ஆரம்பகால நோயறிதலைப் பாதித்தன.'
      },
      solution: solutionsData,
      results: resultsData,
      faqs: faqsData,
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

  // 7. Migrate Page Singletons (14 pages)
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

    // Explicit overrides/nested additions for known-risky pages
    if (p.slug === 'faqs') {
      content.sidebar = {
        scheduleHeading: getLoc('faqsPage.sidebar.scheduleHeading'),
        scheduleHours: getLoc('faqsPage.sidebar.scheduleHours'),
        scheduleLabel: getLoc('faqsPage.sidebar.scheduleLabel'),
        bookButton: getLoc('faqsPage.sidebar.bookButton'),
        categories: getLoc('faqsPage.sidebar.categories')
      };
      content.sections = {
        general: {
          heading: getLoc('faqsPage.sections.general.heading'),
          items: [
            { question: getLoc('faqsPage.sections.general.items.q1.question'), answer: getLoc('faqsPage.sections.general.items.q1.answer') },
            { question: getLoc('faqsPage.sections.general.items.q2.question'), answer: getLoc('faqsPage.sections.general.items.q2.answer') },
            { question: getLoc('faqsPage.sections.general.items.q3.question'), answer: getLoc('faqsPage.sections.general.items.q3.answer') },
            { question: getLoc('faqsPage.sections.general.items.q4.question'), answer: getLoc('faqsPage.sections.general.items.q4.answer') },
            { question: getLoc('faqsPage.sections.general.items.q5.question'), answer: getLoc('faqsPage.sections.general.items.q5.answer') }
          ]
        },
        appointment: {
          heading: getLoc('faqsPage.sections.appointment.heading'),
          items: [
            { question: getLoc('faqsPage.sections.appointment.items.q1.question'), answer: getLoc('faqsPage.sections.appointment.items.q1.answer') },
            { question: getLoc('faqsPage.sections.appointment.items.q2.question'), answer: getLoc('faqsPage.sections.appointment.items.q2.answer') },
            { question: getLoc('faqsPage.sections.appointment.items.q3.question'), answer: getLoc('faqsPage.sections.appointment.items.q3.answer') },
            { question: getLoc('faqsPage.sections.appointment.items.q4.question'), answer: getLoc('faqsPage.sections.appointment.items.q4.answer') },
            { question: getLoc('faqsPage.sections.appointment.items.q5.question'), answer: getLoc('faqsPage.sections.appointment.items.q5.answer') }
          ]
        },
        services: {
          heading: getLoc('faqsPage.sections.services.heading'),
          items: [
            { question: getLoc('faqsPage.sections.services.items.q1.question'), answer: getLoc('faqsPage.sections.services.items.q1.answer') },
            { question: getLoc('faqsPage.sections.services.items.q2.question'), answer: getLoc('faqsPage.sections.services.items.q2.answer') },
            { question: getLoc('faqsPage.sections.services.items.q3.question'), answer: getLoc('faqsPage.sections.services.items.q3.answer') },
            { question: getLoc('faqsPage.sections.services.items.q4.question'), answer: getLoc('faqsPage.sections.services.items.q4.answer') },
            { question: getLoc('faqsPage.sections.services.items.q5.question'), answer: getLoc('faqsPage.sections.services.items.q5.answer') }
          ]
        },
        payments: {
          heading: getLoc('faqsPage.sections.payments.heading'),
          items: [
            { question: getLoc('faqsPage.sections.payments.items.q1.question'), answer: getLoc('faqsPage.sections.payments.items.q1.answer') },
            { question: getLoc('faqsPage.sections.payments.items.q2.question'), answer: getLoc('faqsPage.sections.payments.items.q2.answer') },
            { question: getLoc('faqsPage.sections.payments.items.q3.question'), answer: getLoc('faqsPage.sections.payments.items.q3.answer') },
            { question: getLoc('faqsPage.sections.payments.items.q4.question'), answer: getLoc('faqsPage.sections.payments.items.q4.answer') },
            { question: getLoc('faqsPage.sections.payments.items.q5.question'), answer: getLoc('faqsPage.sections.payments.items.q5.answer') }
          ]
        },
        emergency: {
          heading: getLoc('faqsPage.sections.emergency.heading'),
          items: [
            { question: getLoc('faqsPage.sections.emergency.items.q1.question'), answer: getLoc('faqsPage.sections.emergency.items.q1.answer') },
            { question: getLoc('faqsPage.sections.emergency.items.q2.question'), answer: getLoc('faqsPage.sections.emergency.items.q2.answer') },
            { question: getLoc('faqsPage.sections.emergency.items.q3.question'), answer: getLoc('faqsPage.sections.emergency.items.q3.answer') },
            { question: getLoc('faqsPage.sections.emergency.items.q4.question'), answer: getLoc('faqsPage.sections.emergency.items.q4.answer') },
            { question: getLoc('faqsPage.sections.emergency.items.q5.question'), answer: getLoc('faqsPage.sections.emergency.items.q5.answer') }
          ]
        }
      };
    }

    if (p.slug === 'pricing') {
      content.plans = {
        basic: {
          name: getLoc('pricingPage.plans.basic.name'),
          desc: getLoc('pricingPage.plans.basic.desc'),
          price: getLoc('pricingPage.plans.basic.price'),
          features: [
            getLoc('pricingPage.plans.basic.features[0]'),
            getLoc('pricingPage.plans.basic.features[1]'),
            getLoc('pricingPage.plans.basic.features[2]'),
            getLoc('pricingPage.plans.basic.features[3]')
          ]
        },
        advanced: {
          name: getLoc('pricingPage.plans.advanced.name'),
          desc: getLoc('pricingPage.plans.advanced.desc'),
          price: getLoc('pricingPage.plans.advanced.price'),
          features: [
            getLoc('pricingPage.plans.advanced.features[0]'),
            getLoc('pricingPage.plans.advanced.features[1]'),
            getLoc('pricingPage.plans.advanced.features[2]'),
            getLoc('pricingPage.plans.advanced.features[3]')
          ]
        },
        premium: {
          name: getLoc('pricingPage.plans.premium.name'),
          desc: getLoc('pricingPage.plans.premium.desc'),
          price: getLoc('pricingPage.plans.premium.price'),
          features: [
            getLoc('pricingPage.plans.premium.features[0]'),
            getLoc('pricingPage.plans.premium.features[1]'),
            getLoc('pricingPage.plans.premium.features[2]'),
            getLoc('pricingPage.plans.premium.features[3]')
          ]
        }
      };
    }

    // Add real Media Library reference images for gallery
    if (p.slug === 'image-gallery') {
      content.images = [];
      for (let i = 1; i <= 12; i++) {
        content.images.push({
          src: `/images/gallery-${i}.jpg`,
          alt: { en: `MST Health Care Gallery Image ${i}`, ta: `MST ஹெல்த் கேர் கேலரி படம் ${i}` }
        });
      }
    }

    // Add real video items for video gallery
    if (p.slug === 'video-gallery') {
      content.videos = [];
      for (let i = 1; i <= 9; i++) {
        content.videos.push({
          title: { en: `MST Health Care Video ${i}`, ta: `MST ஹெல்த் கேர் வீடியோ ${i}` },
          thumbnail: `/images/video-thumb-${i}.jpg`,
          videoUrl: `https://www.youtube.com/watch?v=example${i}`
        });
      }
    }

    const getLocGroup = (groupPrefix) => {
      const gp = {};
      if (en[groupPrefix]) {
        Object.keys(en[groupPrefix]).forEach(k => {
          const path = `${groupPrefix}.${k}`;
          if (typeof en[groupPrefix][k] === 'object' && !Array.isArray(en[groupPrefix][k])) {
            gp[k] = {};
            Object.keys(en[groupPrefix][k]).forEach(subK => {
              const subPath = `${path}.${subK}`;
              if (typeof en[groupPrefix][k][subK] === 'object' && !Array.isArray(en[groupPrefix][k][subK])) {
                gp[k][subK] = {};
                Object.keys(en[groupPrefix][k][subK]).forEach(subSubK => {
                  gp[k][subK][subSubK] = getLoc(`${subPath}.${subSubK}`);
                });
              } else {
                gp[k][subK] = getLoc(subPath);
              }
            });
          } else {
            gp[k] = getLoc(path);
          }
        });
      }
      return gp;
    };

    if (p.slug === 'blog') {
      content.blogSinglePage = getLocGroup('blogSinglePage');
    }
    if (p.slug === 'case-study') {
      content.caseStudySinglePage = getLocGroup('caseStudySinglePage');
    }
    if (p.slug === 'team') {
      content.teamSinglePage = getLocGroup('teamSinglePage');
    }

    await PageSingleton.findOneAndUpdate(
      { pageSlug: p.slug },
      {
        pageSlug: p.slug,
        metaTitle,
        metaDescription: getLoc(`${p.prefix}.hero.description`).en 
          ? getLoc(`${p.prefix}.hero.description`) 
          : getLoc(`${p.prefix}.description`).en 
          ? getLoc(`${p.prefix}.description`) 
          : { en: 'MST Health Care medical services description', ta: 'MST ஹெல்த் கேர் மருத்துவ சேவைகள் விளக்கம்' },
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

  // 8. Add service details page singleton helper to ensure serviceSinglePage properties exist
  const sMetaTitle = getLoc('serviceSinglePage.metaTitle');
  await PageSingleton.findOneAndUpdate(
    { pageSlug: 'services' }, 
    {
      $set: {
        'content.discoverServices': getLoc('serviceSinglePage.discoverServices'),
        'content.scheduleVisit': getLoc('serviceSinglePage.scheduleVisit'),
        'content.bookAppointment': getLoc('serviceSinglePage.bookAppointment'),
        'content.benefitsTitle': getLoc('serviceSinglePage.benefitsTitle'),
        'content.benefitsDesc': getLoc('serviceSinglePage.benefitsDesc'),
        'content.faqTitle': getLoc('serviceSinglePage.faqTitle'),
        'content.processDesc': getLoc('serviceSinglePage.processDesc'),
        'content.processSuffix': getLoc('serviceSinglePage.processSuffix'),
        'content.whyChoosePoint1Desc': getLoc('serviceSinglePage.whyChoosePoint1Desc'),
        'content.whyChoosePoint2Desc': getLoc('serviceSinglePage.whyChoosePoint2Desc'),
        'content.trustedBy': getLoc('serviceSinglePage.trustedBy'),
        'content.patients': getLoc('serviceSinglePage.patients')
      }
    }
  );

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
