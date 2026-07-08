import { adminGuard, apiOk, parseBody } from '@/lib/apiHelpers';
import { signPreviewToken } from '@/lib/auth';

export async function POST(request) {
  const { session, error } = await adminGuard(request, 'read');
  if (error) return error;

  const { body, error: parseErr } = await parseBody(request);
  if (parseErr) return parseErr;

  const { slug } = body;
  if (!slug) {
    return Response.json({ message: 'Slug is required' }, { status: 400 });
  }

  // Create JWT payload
  const payload = {
    slug,
    adminId: session.sub,
    sessionSession: session.sessionId || 'default',
    exp: Math.floor(Date.now() / 1000) + 300 // 5 minutes
  };

  const token = await signPreviewToken(payload);

  return apiOk({ token });
}
