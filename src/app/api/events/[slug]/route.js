import { connectDB } from '@/lib/db';
import Event from '@/models/Event';
import { apiOk, apiError } from '@/lib/apiHelpers';

/**
 * GET /api/events/[slug]
 * Public read-only — returns one published event by slug.
 */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { slug } = await params;
    const event = await Event.findOne({ slug, status: 'published' }).lean();
    if (!event) return apiError('Event not found', 404);
    return apiOk({ event });
  } catch (err) {
    return apiError(err.message, 500);
  }
}
