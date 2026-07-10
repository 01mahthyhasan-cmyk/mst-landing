import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './db.js';
import User from '../models/User.js';
import SiteSettings from '../models/SiteSettings.js';
import PageSingleton from '../models/PageSingleton.js';
import Service from '../models/Service.js';
import TeamMember from '../models/TeamMember.js';
import CaseStudy from '../models/CaseStudy.js';
import Testimonial from '../models/Testimonial.js';

import fs from 'fs';
import path from 'path';

// Manual env loading from .env.local
try {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove surrounding quotes if present
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value.trim();
      }
    });
  }
} catch (err) {
  console.warn('Warning: Could not manually load .env.local:', err.message);
}

const REQUIRED_PAGE_SLUGS = [
  'home', 'about', 'services', 'blog', 'case-study', 'team',
  'testimonials', 'image-gallery', 'video-gallery', 'pricing',
  'faqs', 'contact', 'book-appointment', '404'
];

async function seed() {
  console.log('Connecting to database...');
  await connectDB();

  console.log('Seeding administrative users...');
  // 1. Create Default Super Admin
  const adminEmail = 'admin@msthealthcare.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  let adminUser;

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@1234', 12);
    adminUser = await User.create({
      name: 'MST System Administrator',
      email: adminEmail,
      passwordHash,
      role: 'super_admin',
      status: 'active',
      mustChangePassword: false
    });
    console.log(`✓ Super Admin created: ${adminEmail} / Admin@1234`);
  } else {
    adminUser = existingAdmin;
    console.log(`- Super Admin already exists: ${adminEmail}`);
  }

  // 2. Create Page Singletons
  console.log('Seeding page singletons...');
  for (const slug of REQUIRED_PAGE_SLUGS) {
    const exists = await PageSingleton.findOne({ pageSlug: slug });
    if (!exists) {
      await PageSingleton.create({
        pageSlug: slug,
        metaTitle: {
          en: `MST Health Care | ${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
          ta: `MST ஹெல்த்கேர் | ${slug.charAt(0).toUpperCase() + slug.slice(1)}`
        },
        metaDescription: {
          en: `Welcome to the ${slug} page of MST Health Care. Compassion, Care, Comfort.`,
          ta: `MST ஹெல்த்கேரின் ${slug} பக்கத்திற்கு உங்களை வரவேற்கிறோம்.`
        },
        breadcrumb: {
          home: { en: 'Home', ta: 'முகப்பு' },
          current: {
            en: slug.charAt(0).toUpperCase() + slug.slice(1),
            ta: slug.charAt(0).toUpperCase() + slug.slice(1)
          }
        },
        content: {},
        updatedBy: adminUser._id
      });
      console.log(`✓ Seeded page singleton: ${slug}`);
    }
  }

  // 3. Create Default Site Settings
  console.log('Seeding site settings...');
  const settingsExists = await SiteSettings.findOne({ singletonKey: 'site_settings' });
  if (!settingsExists) {
    await SiteSettings.create({
      singletonKey: 'site_settings',
      siteTitle: 'MST Health Care',
      siteDescription: {
        en: 'Compassion. Care. Comfort. Leading medical care center in Batticaloa, Sri Lanka.',
        ta: 'அன்பு. அரவணைப்பு. சுகம். மட்டக்களப்பில் முன்னனி மருத்துவ சேவை மையம்.'
      },
      phone1: '065 205 4997',
      phone2: '076 295 1343',
      phone3: '076 225 1343',
      email: 'contact@msthealthcare.com',
      address: {
        en: 'Trinco Road, Periya Urani, Batticaloa, Sri Lanka',
        ta: 'திருகோணமலை வீதி, பெரிய ஊரணி, மட்டக்களப்பு, இலங்கை'
      },
      clinicHours: {
        en: 'Everyday 6:30 AM – 8:00 PM',
        ta: 'தினமும் மு.ப 6:30 - பி.ப 8:00 மணி வரை'
      },
      copyright: {
        en: '© MST Health Care. All rights reserved. Your Health, Our Priority.',
        ta: '© MST ஹெல்த்கேர். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'
      },
      navigation: [
        { label: { en: 'Home', ta: 'முகப்பு' }, href: '/', order: 1 },
        { label: { en: 'About Us', ta: 'எங்களை பற்றி' }, href: '/about', order: 2 },
        { label: { en: 'Services', ta: 'எங்கள் சேவைகள்' }, href: '/services', order: 3 },
        { label: { en: 'Medical Team', ta: 'எங்கள் குழு' }, href: '/team', order: 4 },
        { label: { en: 'Case Studies', ta: 'ஆய்வுகள்' }, href: '/case-study', order: 5 },
        { label: { en: 'Pricing', ta: 'கட்டணங்கள்' }, href: '/pricing', order: 6 },
        { label: { en: 'Contact Us', ta: 'தொடர்புகளுக்கு' }, href: '/contact', order: 7 }
      ],
      updatedBy: adminUser._id
    });
    console.log('✓ Seeded global site settings');
  }

  // 4. Seed Anomaly Mocks (Case Study, Team, Testimonial)
  console.log('Seeding default collections to resolve anomalies...');
  const svcCount = await Service.countDocuments();
  if (svcCount === 0) {
    await Service.create({
      slug: 'opd-services',
      name: { en: 'OPD (Outpatient Department)', ta: 'OPD (வெளிநோயாளர் பிரிவு)' },
      desc1: {
        en: 'Compassionate and professional medical care for outpatient consultation, diagnosis, and recovery.',
        ta: 'வெளிநோயாளர் ஆலோசனை, நோய் கண்டறிதல் மற்றும் குணப்படுத்துவதற்கான கனிவான மற்றும் தொழில்முறை மருத்துவ சிகிச்சை.'
      },
      status: 'published',
      createdBy: adminUser._id
    });
    console.log('✓ Seeded OPD service');
  }

  const teamCount = await TeamMember.countDocuments();
  if (teamCount === 0) {
    await TeamMember.create({
      slug: 'dr-david-wilson',
      name: { en: 'Dr. David Wilson', ta: 'டாக்டர் டேவிட் வில்சன்' },
      role: { en: 'Senior Consultant Physician', ta: 'முதுநிலை ஆலோசகர் மருத்துவர்' },
      bio: {
        en: 'Experienced medical officer specializing in family medicine and clinical consultancy with over 15 years of excellence.',
        ta: 'குடும்ப மருத்துவம் மற்றும் மருத்துவ ஆலோசனையில் 15 ஆண்டுகளுக்கும் மேலான அனுபவம் கொண்ட மூத்த மருத்துவர்.'
      },
      status: 'published',
      createdBy: adminUser._id
    });
    console.log('✓ Seeded team member Dr. David Wilson (resolves Team-Single anomaly)');
  }

  const csCount = await CaseStudy.countDocuments();
  if (csCount === 0) {
    await CaseStudy.create({
      slug: 'cardiac-rehabilitation-success',
      title: { en: 'Cardiac Rehabilitation Success Story', ta: 'இருதய மறுவாழ்வு வெற்றிக் கதை' },
      category: { en: 'Physiotherapy & Rehabilitation', ta: 'உடற்பயிற்சி சிகிச்சை மற்றும் மறுவாழ்வு' },
      overview: {
        en: 'Detailed case study showcasing the progress of patients undergoing comprehensive cardiac rehab programs.',
        ta: 'விரிவான இருதய மறுவாழ்வு திட்டங்களுக்கு உட்படுத்தப்படும் நோயாளிகளின் முன்னேற்றத்தைக் காட்டும் விரிவான வழக்காய்வு.'
      },
      status: 'published',
      createdBy: adminUser._id
    });
    console.log('✓ Seeded case study (resolves Case-Study-Single English anomaly)');
  }

  console.log('Database seeding process completed successfully!');
  mongoose.connection.close();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  mongoose.connection.close();
});
