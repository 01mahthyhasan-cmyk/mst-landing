import { connectDB } from '@/lib/db';
import MediaFile from '@/models/MediaFile';
import { adminGuard, apiOk, apiError } from '@/lib/apiHelpers';
import { uploadPublicImage } from '@/lib/cloudinary';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request) {
  const { session, error } = await adminGuard(request, 'write');
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const altEn = formData.get('altEn') || '';
    const altTa = formData.get('altTa') || '';
    const tagsString = formData.get('tags') || '';
    // Optional: caller can specify a folder (e.g. 'events', 'team', 'blog'). Default: 'media'.
    const folder = (formData.get('folder') || 'media').replace(/[^a-zA-Z0-9_/-]/g, '');

    if (!file || typeof file === 'string') {
      return apiError('No file uploaded', 400);
    }

    if (!ALLOWED_MIMES.includes(file.type)) {
      return apiError('Invalid file type. Only JPG, PNG, WebP, GIF, and SVG are allowed.', 400);
    }

    if (file.size > MAX_SIZE) {
      return apiError('File size exceeds the 10 MB limit.', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Stream directly to Cloudinary (works on Vercel — no local disk write)
    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadPublicImage(buffer, folder);
    } catch (uploadErr) {
      console.error('[Cloudinary Media Upload Error]:', uploadErr);
      return apiError(`Cloudinary upload failed: ${uploadErr.message || uploadErr}`, 500);
    }

    await connectDB();
    const media = await MediaFile.create({
      filename: cloudinaryResult.public_id,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      // Use Cloudinary's secure_url — permanent, CDN-backed, works everywhere
      url: cloudinaryResult.secure_url,
      altText: { en: altEn, ta: altTa },
      tags: tagsString.split(',').map(t => t.trim()).filter(Boolean),
      uploadedBy: session.sub,
    });

    return apiOk({ media });
  } catch (err) {
    console.error('[Media Upload Route Error]:', err);
    return apiError(err.message, 500);
  }
}
