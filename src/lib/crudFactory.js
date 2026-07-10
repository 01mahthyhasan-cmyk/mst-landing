import { connectDB } from '@/lib/db';
import { adminGuard, apiOk, apiError, parseBody } from '@/lib/apiHelpers';
import { writeAuditLog } from '@/lib/auditLog';

/**
 * Creates standard GET (list) + POST (create) handlers for a collection.
 * @param {mongoose.Model} Model
 * @param {string} collectionName - for audit logs
 * @param {object} [opts]
 * @param {string} [opts.sortField] - default '-createdAt'
 * @param {string[]} [opts.searchFields] - fields to text-search on ?q=
 */
export function makeListCreateHandlers(Model, collectionName, opts = {}) {
  const sort = opts.sortField || '-createdAt';

  async function GET(request) {
    const { error } = await adminGuard(request, 'read');
    if (error) return error;
    await connectDB();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));

    const filter = {};
    if (status) filter.status = status;
    if (q && opts.searchFields?.length) {
      filter.$or = opts.searchFields.map((f) => ({ [f]: { $regex: q, $options: 'i' } }));
    }

    const [items, total] = await Promise.all([
      Model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
      Model.countDocuments(filter),
    ]);

    return apiOk({ items, total, page, pages: Math.ceil(total / limit) });
  }

  async function POST(request) {
    const { session, ip, error } = await adminGuard(request, 'write');
    if (error) return error;

    const { body, error: parseErr } = await parseBody(request);
    if (parseErr) return parseErr;

    const requestedStatus = body.status || 'draft';
    if (requestedStatus === 'published') {
      const pubCheck = await adminGuard(request, 'publish');
      if (pubCheck.error) return pubCheck.error;
    }

    await connectDB();
    try {
      const item = await Model.create({ ...body, createdBy: session.sub, updatedBy: session.sub, status: requestedStatus });
      await writeAuditLog({
        userId: session.sub, userEmail: session.email,
        action: 'content_create', targetCollection: collectionName,
        targetId: item._id.toString(), ipAddress: ip,
      });
      return apiOk({ item }, 201);
    } catch (err) {
      if (err.code === 11000) return apiError('A document with this slug already exists', 409);
      return apiError(err.message, 422, err.errors);
    }
  }

  return { GET, POST };
}

/**
 * Creates GET (single) + PATCH (update) + DELETE handlers for a collection item.
 */
export function makeItemHandlers(Model, collectionName) {
  async function GET(request, { params }) {
    const { error } = await adminGuard(request, 'read');
    if (error) return error;
    await connectDB();
    const { id } = await params;
    const item = await Model.findById(id).lean();
    if (!item) return apiError('Not found', 404);
    return apiOk({ item });
  }

  async function PATCH(request, { params }) {
    const { session, ip, error } = await adminGuard(request, 'write');
    if (error) return error;

    const { body, error: parseErr } = await parseBody(request);
    if (parseErr) return parseErr;

    await connectDB();
    const { id } = await params;

    // Publish/Unpublish requires publish permission
    if (body.status === 'published') {
      const pubCheck = await adminGuard(request, 'publish');
      if (pubCheck.error) return pubCheck.error;
    }

    try {
      const item = await Model.findByIdAndUpdate(
        id,
        { ...body, updatedBy: session.sub },
        { new: true, runValidators: true }
      );
      if (!item) return apiError('Not found', 404);

      const action = body.status === 'published' ? 'content_publish'
        : body.status === 'draft' ? 'content_unpublish' : 'content_update';

      await writeAuditLog({
        userId: session.sub, userEmail: session.email,
        action, targetCollection: collectionName,
        targetId: id, ipAddress: ip,
      });

      return apiOk({ item });
    } catch (err) {
      if (err.code === 11000) return apiError('Slug conflict', 409);
      return apiError(err.message, 422, err.errors);
    }
  }

  async function DELETE(request, { params }) {
    const { session, ip, error } = await adminGuard(request, 'delete');
    if (error) return error;

    await connectDB();
    const { id } = await params;
    const item = await Model.findByIdAndDelete(id);
    if (!item) return apiError('Not found', 404);

    await writeAuditLog({
      userId: session.sub, userEmail: session.email,
      action: 'content_delete', targetCollection: collectionName,
      targetId: id, ipAddress: ip,
    });

    return apiOk({ message: 'Deleted' });
  }

  return { GET, PATCH, DELETE };
}
