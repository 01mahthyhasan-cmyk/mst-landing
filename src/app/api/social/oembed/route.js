import { adminGuard, apiOk, apiError } from '@/lib/apiHelpers';
import { getEmbedForPlatform } from '@/lib/socialEmbed';

export async function GET(request) {
  // Gate this API behind admin guard to prevent abuse
  const { error } = await adminGuard(request, 'read');
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const platform = searchParams.get('platform');

  if (!url || !platform) {
    return apiError('Missing required query parameters: url and platform');
  }

  try {
    const embedData = await getEmbedForPlatform(url, platform);
    return apiOk({ data: embedData });
  } catch (err) {
    return apiError(err.message || 'Failed to fetch oEmbed details', 422);
  }
}
