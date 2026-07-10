import { connectDB } from '@/lib/db';
import Event from '@/models/Event';
import { apiOk, apiError } from '@/lib/apiHelpers';
import { getClientIP } from '@/lib/auditLog';

// Simple in-memory rate-limit: { "ip:slug": timestamp }
// Resets on server restart — enough to stop trivial spam.
const likeCache = new Map();
const LIKE_WINDOW_MS = 60 * 60 * 1000; // 1 hour per IP per slug

/**
 * POST /api/events/[slug]/like
 * Increments likes by 1.
 * - Client must not already have the liked cookie for this slug (checked by client).
 * - Server-side: same IP can only like once per hour per slug.
 */
export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const ip = getClientIP(request);
    const cacheKey = `${ip}:${slug}`;
    const lastLike = likeCache.get(cacheKey);

    if (lastLike && Date.now() - lastLike < LIKE_WINDOW_MS) {
      return apiError('Already liked recently', 429);
    }

    await connectDB();
    const event = await Event.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { likes: 1 } },
      { new: true, select: 'likes' }
    );
    if (!event) return apiError('Event not found', 404);

    likeCache.set(cacheKey, Date.now());
    // Prune old entries to avoid unbounded growth
    if (likeCache.size > 10000) {
      const cutoff = Date.now() - LIKE_WINDOW_MS;
      for (const [k, v] of likeCache) {
        if (v < cutoff) likeCache.delete(k);
      }
    }

    return apiOk({ likes: event.likes });
  } catch (err) {
    return apiError(err.message, 500);
  }
}
