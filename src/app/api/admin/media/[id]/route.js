import { unlink } from 'fs/promises';
import { join } from 'path';
import { connectDB } from '@/lib/db';
import MediaFile from '@/models/MediaFile';
import Service from '@/models/Service';
import BlogPost from '@/models/BlogPost';
import TeamMember from '@/models/TeamMember';
import CaseStudy from '@/models/CaseStudy';
import Testimonial from '@/models/Testimonial';
import PageSingleton from '@/models/PageSingleton';
import SiteSettings from '@/models/SiteSettings';
import { adminGuard, apiOk, apiError, parseBody } from '@/lib/apiHelpers';
import { writeAuditLog } from '@/lib/auditLog';

function hasValue(obj, val) {
  if (obj === val) return true;
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      if (hasValue(obj[key], val)) return true;
    }
  }
  return false;
}

export async function DELETE(request, { params }) {
  const { error } = await adminGuard(request, 'delete');
  if (error) return error;

  await connectDB();
  const { id } = await params;

  const media = await MediaFile.findById(id);
  if (!media) {
    return apiError('Media file not found', 404);
  }

  // ── Reference Check ────────────────────────────────────────────────────────
  const mediaIdStr = media._id.toString();
  const mediaUrl = media.url;
  const references = [];

  // 1. Services
  const services = await Service.find({
    $or: [
      { listingIcon: mediaIdStr }, { listingIcon: mediaUrl },
      { heroImage: mediaIdStr }, { heroImage: mediaUrl },
      { benefitImage: mediaIdStr }, { benefitImage: mediaUrl },
      { whyImg1: mediaIdStr }, { whyImg1: mediaUrl },
      { whyImg2: mediaIdStr }, { whyImg2: mediaUrl }
    ]
  }).lean();
  if (services.length) {
    references.push(...services.map(s => `Service: ${s.name?.en || s.slug}`));
  }

  // 2. BlogPosts
  const blogs = await BlogPost.find({
    $or: [{ image: mediaIdStr }, { image: mediaUrl }]
  }).lean();
  if (blogs.length) {
    references.push(...blogs.map(b => `Blog: ${b.title?.en || b.slug}`));
  }

  // 3. TeamMembers
  const members = await TeamMember.find({
    $or: [{ image: mediaIdStr }, { image: mediaUrl }]
  }).lean();
  if (members.length) {
    references.push(...members.map(m => `Team Member: ${m.name?.en || m.slug}`));
  }

  // 4. Case Studies
  const cases = await CaseStudy.find({
    $or: [{ image: mediaIdStr }, { image: mediaUrl }]
  }).lean();
  if (cases.length) {
    references.push(...cases.map(c => `Case Study: ${c.title?.en || c.slug}`));
  }

  // 5. Testimonials
  const testimonials = await Testimonial.find({
    $or: [{ authorImage: mediaIdStr }, { authorImage: mediaUrl }]
  }).lean();
  if (testimonials.length) {
    references.push(...testimonials.map(t => `Testimonial: ${t.authorName?.en || t._id}`));
  }

  // 6. Page Singletons (Mixed content search)
  const pages = await PageSingleton.find({}).lean();
  for (const page of pages) {
    if (hasValue(page.content, mediaIdStr) || hasValue(page.content, mediaUrl)) {
      references.push(`Page Singleton: ${page.pageSlug}`);
    }
  }

  // 7. Site Settings (Mixed search)
  const settings = await SiteSettings.findOne({ singletonKey: 'site_settings' }).lean();
  if (settings) {
    if (hasValue(settings, mediaIdStr) || hasValue(settings, mediaUrl)) {
      references.push('Global Site Settings');
    }
  }

  if (references.length > 0) {
    return apiError(
      `Cannot delete media. It is currently referenced in: ${references.join(', ')}`,
      400,
      { references }
    );
  }

  // ── Perform Deletion ───────────────────────────────────────────────────────
  try {
    const filePath = join(process.cwd(), 'public', media.url.replace(/^\//, ''));
    await unlink(filePath);
  } catch (fsErr) {
    console.warn(`File system delete failed for ${media.url}, deleting DB record anyway. Error:`, fsErr.message);
  }

  await MediaFile.deleteOne({ _id: media._id });
  return apiOk({ message: 'Media file deleted successfully' });
}

export async function PATCH(request, { params }) {
  const { session, ip, error } = await adminGuard(request, 'write');
  if (error) return error;

  const { body, error: parseErr } = await parseBody(request);
  if (parseErr) return parseErr;

  await connectDB();
  const { id } = await params;

  const media = await MediaFile.findById(id);
  if (!media) {
    return apiError('Media file not found', 404);
  }

  if (body.altText) {
    media.altText = {
      en: body.altText.en ?? media.altText?.en ?? '',
      ta: body.altText.ta ?? media.altText?.ta ?? '',
    };
  }
  if (body.tags !== undefined) {
    media.tags = body.tags;
  }

  await media.save();

  await writeAuditLog({
    userId: session.sub, userEmail: session.email,
    action: 'content_update', targetCollection: 'media_files',
    targetId: id, ipAddress: ip,
  });

  return apiOk({ media });
}
