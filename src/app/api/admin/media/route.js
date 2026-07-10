import { connectDB } from '@/lib/db';
import MediaFile from '@/models/MediaFile';
import { adminGuard, apiOk, apiError } from '@/lib/apiHelpers';

export async function GET(request) {
  const { error } = await adminGuard(request, 'read');
  if (error) return error;

  await connectDB();
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');

  const filter = {};
  if (tag) filter.tags = tag;
  if (search) {
    filter.$or = [
      { originalName: { $regex: search, $options: 'i' } },
      { filename: { $regex: search, $options: 'i' } },
      { 'altText.en': { $regex: search, $options: 'i' } },
    ];
  }

  const items = await MediaFile.find(filter).sort('-createdAt').lean();
  return apiOk({ items });
}
