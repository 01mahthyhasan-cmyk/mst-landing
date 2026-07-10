import { adminGuard, apiOk, parseBody } from '@/lib/apiHelpers';

global.previewStore = global.previewStore || {};

export async function POST(request) {
  const { error } = await adminGuard(request, 'write');
  if (error) return error;

  const { body, error: parseErr } = await parseBody(request);
  if (parseErr) return parseErr;

  const { slug, pageData } = body;
  if (!slug || !pageData) {
    return Response.json({ message: 'Slug and pageData are required' }, { status: 400 });
  }

  // Save to global in-memory store
  global.previewStore[slug] = pageData;

  console.log(`[PreviewStore] Updated draft for slug: ${slug}`);

  return apiOk({ success: true });
}
