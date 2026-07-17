import { connectDB } from '@/lib/db';
import PageSingleton from '@/models/PageSingleton';
import { adminGuard, apiOk, apiError, parseBody } from '@/lib/apiHelpers';
import { writeAuditLog } from '@/lib/auditLog';
import { revalidatePath } from 'next/cache';

// GET /api/admin/pages/[slug]
export async function GET(request, { params }) {
  const { error } = await adminGuard(request, 'read');
  if (error) return error;
  await connectDB();
  const { slug } = await params;
  const page = await PageSingleton.findOne({ pageSlug: slug }).lean();
  if (!page) {
    // Return empty scaffold instead of 404 — page may not be seeded yet
    return apiOk({ page: { pageSlug: slug, metaTitle: { en: '', ta: '' }, breadcrumb: { home: { en: '', ta: '' }, current: { en: '', ta: '' } }, content: {} } });
  }
  return apiOk({ page });
}

// PUT /api/admin/pages/[slug] — upsert (creates or updates)
export async function PUT(request, { params }) {
  const { session, ip, error } = await adminGuard(request, 'write');
  if (error) return error;

  const { body, error: parseErr } = await parseBody(request);
  if (parseErr) return parseErr;

  await connectDB();
  const { slug } = await params;

  const page = await PageSingleton.findOneAndUpdate(
    { pageSlug: slug },
    { ...body, pageSlug: slug, updatedBy: session.sub },
    { upsert: true, new: true, runValidators: true }
  );

  await writeAuditLog({
    userId: session.sub, userEmail: session.email,
    action: 'content_update', targetCollection: 'pages',
    targetId: slug, ipAddress: ip,
  });

  revalidatePath('/', 'layout');

  return apiOk({ page });
}
