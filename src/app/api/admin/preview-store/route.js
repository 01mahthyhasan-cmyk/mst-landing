import { adminGuard, apiOk, parseBody } from '@/lib/apiHelpers';
import { connectDB } from '@/lib/db';
import PreviewStore from '@/models/PreviewStore';

export async function POST(request) {
  const { error } = await adminGuard(request, 'write');
  if (error) return error;

  const { body, error: parseErr } = await parseBody(request);
  if (parseErr) return parseErr;

  const { slug, pageData } = body;
  if (!slug || !pageData) {
    return Response.json({ message: 'Slug and pageData are required' }, { status: 400 });
  }

  await connectDB();

  // Save to persistent DB store with updatedAt touch (for TTL index)
  await PreviewStore.findOneAndUpdate(
    { slug },
    { pageData, updatedAt: new Date() },
    { upsert: true, new: true }
  );

  console.log(`[PreviewStore] Updated persistent draft for slug: ${slug}`);

  return apiOk({ success: true });
}
