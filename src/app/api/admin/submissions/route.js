import { connectDB } from '@/lib/db';
import FormSubmission from '@/models/FormSubmission';
import { adminGuard, apiOk, parseBody } from '@/lib/apiHelpers';

export async function GET(request) {
  const { error } = await adminGuard(request, 'view_submissions');
  if (error) return error;
  await connectDB();

  const { searchParams } = new URL(request.url);
  const formType = searchParams.get('formType');
  const status = searchParams.get('status');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));

  const filter = {};
  if (formType) filter.formType = formType;
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    FormSubmission.find(filter).sort('-submittedAt').skip((page - 1) * limit).limit(limit).lean(),
    FormSubmission.countDocuments(filter),
  ]);

  return apiOk({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function PATCH(request) {
  const { error } = await adminGuard(request, 'view_submissions');
  if (error) return error;

  const { body, error: parseErr } = await parseBody(request);
  if (parseErr) return parseErr;

  await connectDB();
  const { id, status } = body;
  await FormSubmission.findByIdAndUpdate(id, { status });
  return apiOk({ message: 'Status updated' });
}
