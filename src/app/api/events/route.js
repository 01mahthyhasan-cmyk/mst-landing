import { connectDB } from '@/lib/db';
import Event from '@/models/Event';
import { apiOk, apiError } from '@/lib/apiHelpers';

/**
 * GET /api/events
 * Public read-only — published events only, paginated, sorted by postedDate desc.
 */
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '6'));

    const filter = { status: 'published' };

    const [items, total] = await Promise.all([
      Event.find(filter)
        .sort('-postedDate')
        .skip((page - 1) * limit)
        .limit(limit)
        .select('title subtitle slug postedDate mainImage likes views')
        .lean(),
      Event.countDocuments(filter),
    ]);

    return apiOk({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return apiError(err.message, 500);
  }
}
