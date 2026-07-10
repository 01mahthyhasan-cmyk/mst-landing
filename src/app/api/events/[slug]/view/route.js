import { connectDB } from '@/lib/db';
import Event from '@/models/Event';
import { apiOk, apiError } from '@/lib/apiHelpers';
import { cookies } from 'next/headers';

const VIEW_COOKIE_MAX_AGE = 60 * 60; // 1 hour

/**
 * POST /api/events/[slug]/view
 * Increments views by 1.
 * De-duplicated via a short-lived cookie (mst_ev_{slug}) so refreshing
 * the page within an hour doesn't re-count the same visitor.
 */
export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const cookieStore = await cookies();
    const cookieName = `mst_ev_${slug.replace(/[^a-z0-9]/g, '_')}`;

    if (cookieStore.has(cookieName)) {
      // Already counted this session — return current views without incrementing
      await connectDB();
      const event = await Event.findOne({ slug, status: 'published' }, 'views').lean();
      return apiOk({ views: event?.views ?? 0, counted: false });
    }

    await connectDB();
    const event = await Event.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true, select: 'views' }
    );
    if (!event) return apiError('Event not found', 404);

    const response = apiOk({ views: event.views, counted: true });
    // Set the dedup cookie on the response
    response.headers.set(
      'Set-Cookie',
      `${cookieName}=1; Path=/; Max-Age=${VIEW_COOKIE_MAX_AGE}; SameSite=Lax; HttpOnly`
    );
    return response;
  } catch (err) {
    return apiError(err.message, 500);
  }
}
