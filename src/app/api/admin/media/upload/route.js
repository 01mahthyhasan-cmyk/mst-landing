import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { connectDB } from '@/lib/db';
import MediaFile from '@/models/MediaFile';
import { adminGuard, apiOk, apiError } from '@/lib/apiHelpers';

export async function POST(request) {
  const { session, error } = await adminGuard(request, 'write');
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const altEn = formData.get('altEn') || '';
    const altTa = formData.get('altTa') || '';
    const tagsString = formData.get('tags') || '';

    if (!file || typeof file === 'string') {
      return apiError('No file uploaded', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Make clean filename
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${cleanName}`;

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    await connectDB();
    const media = await MediaFile.create({
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: publicUrl,
      altText: { en: altEn, ta: altTa },
      tags: tagsString.split(',').map(t => t.trim()).filter(Boolean),
      uploadedBy: session.sub,
    });

    return apiOk({ media });
  } catch (err) {
    console.error('File upload error:', err);
    return apiError(err.message, 500);
  }
}
