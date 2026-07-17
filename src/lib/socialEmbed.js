export function getYoutubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function validateSocialUrl(url, platform) {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  
  if (platform === 'instagram') {
    return lowerUrl.includes('instagram.com/p/') || lowerUrl.includes('instagram.com/reel/');
  }
  if (platform === 'tiktok') {
    return lowerUrl.includes('tiktok.com/') && lowerUrl.includes('/video/');
  }
  if (platform === 'youtube') {
    return lowerUrl.includes('youtube.com/watch?v=') || lowerUrl.includes('youtu.be/') || lowerUrl.includes('youtube.com/shorts/') || lowerUrl.includes('youtube.com/embed/');
  }
  if (platform === 'facebook') {
    return lowerUrl.includes('facebook.com/') && (lowerUrl.includes('/posts/') || lowerUrl.includes('/videos/') || lowerUrl.includes('/watch/') || lowerUrl.includes('fb.watch/'));
  }
  return false;
}

export function autoDetectPlatform(url) {
  if (!url) return '';
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('instagram.com/p/') || lowerUrl.includes('instagram.com/reel/')) return 'instagram';
  if (lowerUrl.includes('tiktok.com/') && lowerUrl.includes('/video/')) return 'tiktok';
  if (lowerUrl.includes('youtube.com/watch?v=') || lowerUrl.includes('youtu.be/') || lowerUrl.includes('youtube.com/shorts/') || lowerUrl.includes('youtube.com/embed/')) return 'youtube';
  if (lowerUrl.includes('facebook.com/') && (lowerUrl.includes('/posts/') || lowerUrl.includes('/videos/') || lowerUrl.includes('/watch/') || lowerUrl.includes('fb.watch/'))) return 'facebook';
  return '';
}

export async function getEmbedForPlatform(url, platform) {
  if (!validateSocialUrl(url, platform)) {
    throw new Error(`Invalid URL pattern for platform: ${platform}`);
  }

  const result = {
    platform,
    postUrl: url,
    embedHtml: '',
    thumbnailUrl: '',
    influencerName: '',
    influencerHandle: '',
    caption: '',
  };

  // 1. YouTube Handler (extract video ID and construct responsive iframe)
  if (platform === 'youtube') {
    const videoId = getYoutubeId(url);
    if (!videoId) throw new Error('Could not extract YouTube video ID from URL');
    
    result.embedHtml = `<div class="youtube-embed-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;border-radius:8px;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
    result.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    result.influencerHandle = 'YouTube';
    return result;
  }

  // Get Facebook access token if available
  const fbToken = process.env.FACEBOOK_ACCESS_TOKEN || (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET ? `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}` : '');

  // 2. Instagram Handler
  if (platform === 'instagram') {
    if (fbToken) {
      try {
        const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${fbToken}`;
        const res = await fetch(oembedUrl);
        if (res.ok) {
          const data = await res.json();
          result.embedHtml = data.html || '';
          result.thumbnailUrl = data.thumbnail_url || '';
          result.influencerName = data.author_name || '';
          if (data.author_url) {
            const handleMatch = data.author_url.match(/instagram.com\/([^/?#]+)/);
            if (handleMatch) result.influencerHandle = `@${handleMatch[1]}`;
          }
          result.caption = data.title || '';
          return result;
        }
      } catch (err) {
        console.warn('Instagram Graph oEmbed failed, falling back to iframe embed:', err);
      }
    }
    
    // Fallback Instagram embed code
    const cleanUrl = url.split('?')[0].replace(/\/$/, '');
    result.embedHtml = `<div class="instagram-embed-wrapper" style="max-width:540px; width:100%; margin:auto; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;"><iframe src="${cleanUrl}/embed/" width="100%" height="480" frameborder="0" scrolling="no" allowtransparency="true" style="display:block;"></iframe></div>`;
    result.thumbnailUrl = '';
    result.influencerHandle = 'Instagram';
    return result;
  }

  // 3. Facebook Handler
  if (platform === 'facebook') {
    if (fbToken) {
      try {
        const isVideo = url.includes('/videos/') || url.includes('/watch/') || url.includes('fb.watch/');
        const oembedEndpoint = isVideo 
          ? 'https://graph.facebook.com/v18.0/oembed_video'
          : 'https://graph.facebook.com/v18.0/oembed_post';
        
        const oembedUrl = `${oembedEndpoint}?url=${encodeURIComponent(url)}&access_token=${fbToken}`;
        const res = await fetch(oembedUrl);
        if (res.ok) {
          const data = await res.json();
          result.embedHtml = data.html || '';
          result.influencerName = data.author_name || '';
          if (data.author_url) {
            const handleMatch = data.author_url.match(/facebook.com\/([^/?#]+)/);
            if (handleMatch) result.influencerHandle = handleMatch[1];
          }
          return result;
        }
      } catch (err) {
        console.warn('Facebook Graph oEmbed failed, falling back to iframe embed:', err);
      }
    }

    // Fallback Facebook embed code
    const isVideo = url.includes('/videos/') || url.includes('/watch/') || url.includes('fb.watch/');
    if (isVideo) {
      result.embedHtml = `<div class="facebook-embed-wrapper" style="max-width:500px; width:100%; margin:auto; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;"><iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=true" width="100%" height="315" style="border:none;overflow:hidden;display:block;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></div>`;
    } else {
      result.embedHtml = `<div class="facebook-embed-wrapper" style="max-width:500px; width:100%; margin:auto; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;"><iframe src="https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true" width="100%" height="500" style="border:none;overflow:hidden;display:block;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></div>`;
    }
    result.thumbnailUrl = '';
    result.influencerHandle = 'Facebook';
    return result;
  }

  // 4. TikTok Handler
  if (platform === 'tiktok') {
    try {
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        result.embedHtml = data.html || '';
        result.thumbnailUrl = data.thumbnail_url || '';
        result.influencerName = data.author_name || '';
        if (data.author_unique_id) {
          result.influencerHandle = `@${data.author_unique_id}`;
        }
        result.caption = data.title || '';
        return result;
      }
    } catch (err) {
      console.warn('TikTok oEmbed failed, falling back to blockquote:', err);
    }
    
    // Fallback TikTok template
    const userMatch = url.match(/tiktok\.com\/@([^/?#]+)/);
    const videoMatch = url.match(/\/video\/([^/?#]+)/);
    const username = userMatch ? userMatch[1] : 'user';
    const videoId = videoMatch ? videoMatch[2] : '';
    
    result.embedHtml = `<blockquote class="tiktok-embed" cite="${url}" data-video-id="${videoId}" style="max-width: 605px;min-width: 325px;"><section><a target="_blank" title="@${username}" href="https://www.tiktok.com/@${username}">@${username}</a></section></blockquote>`;
    result.thumbnailUrl = '';
    result.influencerHandle = `@${username}`;
    return result;
  }

  return result;
}
