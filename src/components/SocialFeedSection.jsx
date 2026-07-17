'use client';

import { useState, useEffect, useRef } from 'react';

// Platform script loading tracker
const loadedScripts = {
  instagram: false,
  tiktok: false,
  facebook: false,
};

function loadPlatformScript(platform) {
  if (typeof window === 'undefined') return;
  if (loadedScripts[platform]) {
    // If already loaded/loading, trigger refresh parse
    triggerPlatformParse(platform);
    return;
  }

  loadedScripts[platform] = true;

  if (platform === 'instagram') {
    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    script.defer = true;
    script.onload = () => triggerPlatformParse('instagram');
    document.body.appendChild(script);
  } else if (platform === 'tiktok') {
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    script.defer = true;
    script.onload = () => triggerPlatformParse('tiktok');
    document.body.appendChild(script);
  } else if (platform === 'facebook') {
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
    script.async = true;
    script.defer = true;
    script.onload = () => triggerPlatformParse('facebook');
    document.body.appendChild(script);
  }
}

function triggerPlatformParse(platform) {
  if (typeof window === 'undefined') return;
  setTimeout(() => {
    if (platform === 'instagram' && window.instgrm?.Embeds) {
      window.instgrm.Embeds.process();
    } else if (platform === 'facebook' && window.FB) {
      window.FB.XFBML.parse();
    } else if (platform === 'tiktok' && window.tiktokEmbed) {
      try {
        const elements = document.querySelectorAll('blockquote.tiktok-embed');
        if (elements.length > 0) {
          window.tiktokEmbed.lib.render(Array.from(elements));
        }
      } catch (err) {
        console.error('TikTok dynamic parse failed:', err);
      }
    }
  }, 100);
}
function cleanEmbedHtml(html) {
  if (!html) return '';
  // 1. Strip script tags to comply with React 19 / Next.js strategy rules
  let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // 2. Strip tracking query parameters from cite/href attributes so TikTok/Facebook scripts can extract post IDs
  cleaned = cleaned.replace(/(cite|href)=(['"])([^'"]+?)\?([^'"]+?)\2/g, '$1=$2$3$2');
  return cleaned;
}

export default function SocialFeedSection({ initialPosts = [], lang }) {
  const [posts, setPosts] = useState(initialPosts);
  const [visibleCount, setVisibleCount] = useState(6);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Multilingual content labels
  const isTa = lang === 'ta';
  const labels = {
    subTitle: isTa ? 'பரிந்துரைகள்' : 'Social Recommendations',
    heading: isTa ? 'எம்மைப் பற்றிய சமூக ஊடகப் பதிவுகள்' : 'What Influencers Say About Us',
    viewPost: isTa ? 'பதிவை காண்க' : 'View Post',
    loadMore: isTa ? 'மேலும் காட்டுக' : 'Load More',
    fallbackText: isTa ? 'பதிவை நேரடியாக பார்க்க கீழே உள்ள பொத்தானை கிளிக் செய்யவும்' : 'To view this post directly on the platform, click the button below.',
  };

  // IntersectionObserver to lazy load embeds
  useEffect(() => {
    if (posts.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setSectionVisible(true);
          // Load script for all platforms represented in visible posts
          const uniquePlatforms = new Set(posts.slice(0, visibleCount).map((p) => p.platform));
          uniquePlatforms.forEach((platform) => {
            loadPlatformScript(platform);
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, [posts, visibleCount]);

  // If section visibility triggers or pagination increases, load any new platform scripts
  useEffect(() => {
    if (sectionVisible && posts.length > 0) {
      const activePlatforms = new Set(posts.slice(0, visibleCount).map((p) => p.platform));
      activePlatforms.forEach((platform) => {
        loadPlatformScript(platform);
      });
    }
  }, [sectionVisible, visibleCount, posts]);

  if (!mounted) return null;
  if (posts.length === 0) return null;

  const displayedPosts = posts.slice(0, visibleCount);
  const hasMore = posts.length > visibleCount;

  return (
    <section className="social-feed-section" ref={sectionRef} style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
      <div className="container">
        {/* Section Heading */}
        <div className="row" style={{ marginBottom: 40 }}>
          <div className="col-lg-12 text-center">
            <div className="section-title text-center" style={{ marginBottom: 0 }}>
              <span className="section-sub-title wow fadeInUp" style={{ color: '#00A8BC', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 13, display: 'block', marginBottom: 10 }}>
                {labels.subTitle}
              </span>
              <h2 className="text-anime-style-3" style={{ color: '#08363B', fontWeight: 800, fontSize: 36, margin: 0 }}>
                {labels.heading}
              </h2>
            </div>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="row social-grid-row">
          {displayedPosts.map((post) => (
            <div key={post._id} className="col-xl-4 col-md-6 col-sm-12" style={{ marginBottom: 30 }}>
              <div 
                className="social-post-card"
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                }}
              >
                {/* Header overlay */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#00A8BC', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15 }}>
                      {(post.influencerName || post.platform).charAt(0).toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{post.influencerName || 'Healthcare Influencer'}</span>
                      <span style={{ fontSize: 12, color: '#00A8BC', fontWeight: 500 }}>{post.influencerHandle || `@${post.platform}`}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 20 }}>
                    {post.platform === 'youtube' && '🔴'}
                    {post.platform === 'tiktok' && '🖤'}
                    {post.platform === 'instagram' && '📸'}
                    {post.platform === 'facebook' && '🔵'}
                  </span>
                </div>

                {/* Body Content containing Embed or Fallback */}
                <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 320, background: '#f8fafc' }}>
                  {post.embedHtml ? (
                    <div 
                      className="native-embed-container"
                      style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}
                      dangerouslySetInnerHTML={{ __html: cleanEmbedHtml(post.embedHtml) }}
                    />
                  ) : (
                    // Graceful Fallback Card if embed fails/is blocked
                    <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {post.thumbnailUrl && (
                        <img 
                          src={post.thumbnailUrl} 
                          alt="Post thumbnail fallback" 
                          style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }}
                        />
                      )}
                      <p style={{ fontSize: 13, color: '#64748b', margin: 0, padding: '0 10px' }}>{labels.fallbackText}</p>
                    </div>
                  )}
                </div>

                {/* Footer overlay with optional Caption & Link Button */}
                <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {post.caption && (
                    <p style={{ fontSize: 13, color: '#334155', margin: 0, fontWeight: 500, lineHeight: '1.5', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.caption}
                    </p>
                  )}
                  <a 
                    href={post.postUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: 6,
                      background: 'transparent',
                      color: '#00A8BC',
                      border: '1.5px solid #00A8BC',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#00A8BC';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#00A8BC';
                    }}
                  >
                    🔗 {labels.viewPost}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="row" style={{ marginTop: 20 }}>
            <div className="col-lg-12 text-center">
              <button 
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="btn-default"
                style={{
                  background: '#00A8BC',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: 30,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0, 168, 188, 0.2)',
                  transition: 'background-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#078696';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00A8BC';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {labels.loadMore}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
