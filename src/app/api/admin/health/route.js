import { connectDB } from '@/lib/db';
import Service from '@/models/Service';
import BlogPost from '@/models/BlogPost';
import TeamMember from '@/models/TeamMember';
import CaseStudy from '@/models/CaseStudy';
import Testimonial from '@/models/Testimonial';
import PageSingleton from '@/models/PageSingleton';
import { adminGuard, apiOk } from '@/lib/apiHelpers';

const REQUIRED_PAGE_SLUGS = [
  'home','about','services','blog','case-study','team',
  'testimonials','image-gallery','video-gallery','pricing',
  'faqs','contact','book-appointment','404',
];

const LOCALES = ['en', 'ta'];

function checkMissingLocales(doc, fields) {
  const missing = [];
  for (const field of fields) {
    for (const locale of LOCALES) {
      const val = doc?.[field]?.[locale];
      if (!val || val.trim() === '') missing.push(`${field}.${locale}`);
    }
  }
  return missing;
}

export async function GET(request) {
  const { error } = await adminGuard(request, 'read');
  if (error) return error;
  await connectDB();

  const [services, blogPosts, teamMembers, caseStudies, testimonials, pages] = await Promise.all([
    Service.find({}).lean(),
    BlogPost.find({}).lean(),
    TeamMember.find({}).lean(),
    CaseStudy.find({}).lean(),
    Testimonial.find({}).lean(),
    PageSingleton.find({}).lean(),
  ]);

  const issues = [];

  // ── Check collections for missing Tamil translations ───────────────────────
  for (const svc of services) {
    const missing = checkMissingLocales(svc, ['name', 'desc1', 'desc2']);
    if (missing.length) issues.push({ type: 'missing_translation', collection: 'services', id: svc._id, slug: svc.slug, missing });
  }
  for (const post of blogPosts) {
    const missing = checkMissingLocales(post, ['title', 'content']);
    if (missing.length) issues.push({ type: 'missing_translation', collection: 'blog_posts', id: post._id, slug: post.slug, missing });
  }
  for (const member of teamMembers) {
    const missing = checkMissingLocales(member, ['name', 'role', 'bio']);
    if (missing.length) issues.push({ type: 'missing_translation', collection: 'team_members', id: member._id, slug: member.slug, missing });
  }
  for (const cs of caseStudies) {
    const missing = checkMissingLocales(cs, ['title', 'overview']);
    if (missing.length) issues.push({ type: 'missing_translation', collection: 'case_studies', id: cs._id, slug: cs.slug, missing });
  }

  // ── Check all required page singletons exist ───────────────────────────────
  const existingPageSlugs = new Set(pages.map((p) => p.pageSlug));
  for (const slug of REQUIRED_PAGE_SLUGS) {
    if (!existingPageSlugs.has(slug)) {
      issues.push({ type: 'missing_page_singleton', collection: 'pages', slug });
    }
  }

  // ── Anomaly resolution status (report Section 5) ──────────────────────────
  const anomalies = [
    {
      key: 'case_study_single',
      label: 'Case Study Single — was hardcoded English-only',
      resolved: caseStudies.length > 0,
      count: caseStudies.length,
    },
    {
      key: 'team_single',
      label: 'Team Single — was hardcoded mock "Dr. David Wilson"',
      resolved: teamMembers.length > 0,
      count: teamMembers.length,
    },
    {
      key: 'pricing_subsections',
      label: 'Pricing Page subsections — were hardcoded English',
      resolved: existingPageSlugs.has('pricing'),
      count: existingPageSlugs.has('pricing') ? 1 : 0,
    },
  ];

  // ── Orphaned media (not implemented yet — placeholder) ─────────────────────
  const summary = {
    collections: {
      services: services.length,
      blogPosts: blogPosts.length,
      teamMembers: teamMembers.length,
      caseStudies: caseStudies.length,
      testimonials: testimonials.length,
    },
    issueCount: issues.length,
  };

  return apiOk({ summary, issues, anomalies });
}
