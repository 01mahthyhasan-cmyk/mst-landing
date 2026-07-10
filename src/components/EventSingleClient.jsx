'use client';

import { useState, useEffect, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────
   DynamicImageGrid — adapts layout to gallery image count.
   1 image  → full-width single
   2 images → two equal columns
   3 images → 1 large left + 2 stacked right
   4 images → 2×2 grid
   5+       → first 4 tiles + "+N more" badge on last visible tile
              clicking any tile opens the lightbox
   ───────────────────────────────────────────────────────────── */
function DynamicImageGrid({ images, lang }) {
  const [lightbox, setLightbox] = useState(null); // index into images[]

  useEffect(() => {
    const onKey = (e) => {
      if (lightbox === null) return;
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft')  setLightbox(i => (i - 1 + images.length) % images.length);
      if (e.key === 'Escape')     setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  if (!images || images.length === 0) return null;

  const sorted = [...images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const count = sorted.length;
  const showTiles = count <= 4 ? count : 4;
  const extra = count > 4 ? count - showTiles : 0;

  const gridClass =
    count === 1 ? 'eg-grid-1' :
    count === 2 ? 'eg-grid-2' :
    count === 3 ? 'eg-grid-3' :
    'eg-grid-4';

  return (
    <>
      <div className={`eg-grid ${gridClass}`}>
        {sorted.slice(0, showTiles).map((img, idx) => (
          <div
            key={idx}
            className={`eg-tile${count === 3 && idx === 0 ? ' eg-tile--large' : ''}`}
            onClick={() => setLightbox(idx)}
          >
            <img src={img.url} alt={`Gallery image ${idx + 1}`} loading="lazy" />
            {extra > 0 && idx === showTiles - 1 && (
              <div className="eg-more-badge">+{extra} more</div>
            )}
            <div className="eg-tile-overlay"><span>🔍</span></div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="eg-lightbox" onClick={() => setLightbox(null)}>
          <button className="eg-lb-close" onClick={() => setLightbox(null)} aria-label="Close">✕</button>
          <button
            className="eg-lb-prev"
            onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + images.length) % images.length); }}
            aria-label="Previous"
          >‹</button>
          <div className="eg-lb-img-wrap" onClick={e => e.stopPropagation()}>
            <img src={sorted[lightbox].url} alt={`Image ${lightbox + 1}`} />
            <div className="eg-lb-counter">{lightbox + 1} / {images.length}</div>
          </div>
          <button
            className="eg-lb-next"
            onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % images.length); }}
            aria-label="Next"
          >›</button>
        </div>
      )}

      <style>{`
        .eg-grid { display: grid; gap: 12px; width: 100%; }
        .eg-grid-1 { grid-template-columns: 1fr; }
        .eg-grid-2 { grid-template-columns: 1fr 1fr; }
        .eg-grid-3 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
        .eg-grid-4 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
        .eg-tile { position: relative; overflow: hidden; border-radius: 8px; cursor: pointer; aspect-ratio: 4/3; background: #e2e8f0; }
        .eg-tile--large { grid-row: 1 / 3; aspect-ratio: unset; }
        .eg-tile img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .eg-tile:hover img { transform: scale(1.05); }
        .eg-tile-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; font-size: 28px; }
        .eg-tile:hover .eg-tile-overlay { opacity: 1; }
        .eg-more-badge { position: absolute; inset: 0; background: rgba(0,0,0,0.55); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; border-radius: 8px; }
        .eg-lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 99999; display: flex; align-items: center; justify-content: center; }
        .eg-lb-img-wrap { max-width: 90vw; max-height: 90vh; position: relative; }
        .eg-lb-img-wrap img { max-width: 90vw; max-height: 85vh; object-fit: contain; border-radius: 4px; display: block; }
        .eg-lb-counter { position: absolute; bottom: -28px; left: 0; right: 0; text-align: center; color: rgba(255,255,255,0.6); font-size: 14px; }
        .eg-lb-close { position: absolute; top: 20px; right: 24px; background: none; border: none; color: #fff; font-size: 32px; cursor: pointer; z-index: 2; }
        .eg-lb-prev, .eg-lb-next { background: rgba(255,255,255,0.15); border: none; color: #fff; font-size: 48px; padding: 8px 16px; cursor: pointer; border-radius: 4px; margin: 0 12px; transition: background 0.2s; }
        .eg-lb-prev:hover, .eg-lb-next:hover { background: rgba(255,255,255,0.3); }
        @media (max-width: 640px) {
          .eg-grid-2, .eg-grid-3, .eg-grid-4 { grid-template-columns: 1fr 1fr; }
          .eg-tile--large { grid-row: unset; aspect-ratio: 4/3; }
        }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   EventSingleClient
   Handles: views auto-count on mount, likes button with
   optimistic UI + localStorage dedup.
   ───────────────────────────────────────────────────────────── */
export default function EventSingleClient({ event, lang }) {
  const t = lang === 'ta';
  const title       = t ? (event.title?.ta       || event.title?.en)       : event.title?.en;
  const subtitle    = t ? (event.subtitle?.ta     || event.subtitle?.en)    : event.subtitle?.en;
  const description = t ? (event.description?.ta  || event.description?.en) : event.description?.en;

  const [likes, setLikes]   = useState(event.likes ?? 0);
  const [views, setViews]   = useState(event.views ?? 0);
  const [liked, setLiked]   = useState(false);
  const [liking, setLiking] = useState(false);

  const p = lang === 'en' ? '/en' : '';

  // Check localStorage liked state on mount
  useEffect(() => {
    const key = `mst_liked_event_${event.slug}`;
    if (localStorage.getItem(key) === '1') setLiked(true);
  }, [event.slug]);

  // Fire view count once on mount (server-side cookie dedup prevents inflation)
  useEffect(() => {
    fetch(`/api/events/${event.slug}/view`, { method: 'POST' })
      .then(r => r.json())
      .then(d => { if (d.views !== undefined) setViews(d.views); })
      .catch(() => {});
  }, [event.slug]);

  const handleLike = useCallback(async () => {
    if (liked || liking) return;
    setLiking(true);
    setLikes(n => n + 1); // optimistic
    setLiked(true);
    localStorage.setItem(`mst_liked_event_${event.slug}`, '1');
    try {
      const res = await fetch(`/api/events/${event.slug}/like`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        // Server rejected (already liked from this IP) — revert
        setLikes(n => n - 1);
        setLiked(false);
        localStorage.removeItem(`mst_liked_event_${event.slug}`);
      } else {
        setLikes(data.likes);
      }
    } catch {
      setLikes(n => n - 1);
      setLiked(false);
      localStorage.removeItem(`mst_liked_event_${event.slug}`);
    } finally {
      setLiking(false);
    }
  }, [event.slug, liked, liking]);

  const formattedDate = event.postedDate
    ? new Date(event.postedDate).toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-GB', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  const galleryImages = event.galleryImages || [];

  return (
    <>
      {/* Page Header */}
      <div className="page-header dark-section parallaxie">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-3" data-cursor="-opaque">{title}</h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href={lang === 'ta' ? '/' : '/en'}>{lang === 'ta' ? 'முகப்பு' : 'Home'}</a></li>
                    <li className="breadcrumb-item"><a href={`${p}/events`}>{lang === 'ta' ? 'நிகழ்வுகள்' : 'Events'}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{title}</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="event-single-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">

              {/* Hero image */}
              {event.mainImage && (
                <div className="event-single-image wow fadeInUp">
                  <figure>
                    <img src={event.mainImage} alt={title} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', maxHeight: '480px' }} />
                  </figure>
                </div>
              )}

              {/* Meta row */}
              <div className="event-meta-row wow fadeInUp" data-wow-delay="0.1s">
                {formattedDate && <span className="event-meta-date">📅 {formattedDate}</span>}
                <span className="event-meta-views">👁 {views} {lang === 'ta' ? 'பார்வைகள்' : 'views'}</span>
                <button
                  className={`event-like-btn${liked ? ' liked' : ''}`}
                  onClick={handleLike}
                  disabled={liked || liking}
                  aria-label={lang === 'ta' ? 'விரும்புகிறேன்' : 'Like this event'}
                >
                  {liked ? '❤️' : '🤍'} {likes} {lang === 'ta' ? 'விரும்பல்கள்' : 'likes'}
                </button>
              </div>

              {/* Subtitle */}
              {subtitle && (
                <p className="event-subtitle wow fadeInUp" data-wow-delay="0.15s">{subtitle}</p>
              )}

              {/* Description */}
              {description && (
                <div
                  className="event-description wow fadeInUp"
                  data-wow-delay="0.2s"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <div className="event-gallery wow fadeInUp" data-wow-delay="0.3s">
                  <h3 className="event-gallery-title">
                    {lang === 'ta' ? 'படங்கள்' : 'Gallery'}
                  </h3>
                  <DynamicImageGrid images={galleryImages} lang={lang} />
                </div>
              )}

              {/* Back + Like footer */}
              <div className="event-footer-actions wow fadeInUp" data-wow-delay="0.4s">
                <a href={`${p}/events`} className="btn-default">
                  ← {lang === 'ta' ? 'நிகழ்வுகளுக்கு திரும்பு' : 'Back to Events'}
                </a>
                <button
                  className={`event-like-btn event-like-btn--lg${liked ? ' liked' : ''}`}
                  onClick={handleLike}
                  disabled={liked || liking}
                >
                  {liked
                    ? (lang === 'ta' ? '❤️ விரும்பியது' : '❤️ Liked!')
                    : (lang === 'ta' ? '🤍 விரும்புக' : '🤍 Like this event')}
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="event-sidebar">
                <div className="event-sidebar-card">
                  <h4>{lang === 'ta' ? 'நிகழ்வு விவரங்கள்' : 'Event Details'}</h4>
                  <ul>
                    {formattedDate && <li><strong>📅</strong> {formattedDate}</li>}
                    <li><strong>❤️</strong> {likes} {lang === 'ta' ? 'விரும்பல்கள்' : 'likes'}</li>
                    <li><strong>👁</strong> {views} {lang === 'ta' ? 'பார்வைகள்' : 'views'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .event-single-page { padding: 60px 0; }
        .event-single-image { margin-bottom: 24px; }
        .event-meta-row {
          display: flex; flex-wrap: wrap; align-items: center; gap: 16px;
          margin-bottom: 20px; padding: 16px 0;
          border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;
        }
        .event-meta-date, .event-meta-views { color: #64748b; font-size: 14px; }
        .event-like-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          padding: 8px 16px; border-radius: 30px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: all 0.2s;
        }
        .event-like-btn:hover:not(:disabled) { background: #fff0f0; border-color: #fca5a5; }
        .event-like-btn.liked { background: #fff0f0; border-color: #fca5a5; color: #e11d48; cursor: default; }
        .event-like-btn:disabled { opacity: 0.85; }
        .event-like-btn--lg { padding: 12px 24px; font-size: 16px; }
        .event-subtitle { font-size: 18px; color: #475569; margin-bottom: 24px; font-style: italic; }
        .event-description { font-size: 16px; line-height: 1.8; color: #334155; margin-bottom: 40px; }
        .event-description p { margin-bottom: 16px; }
        .event-gallery { margin-bottom: 40px; }
        .event-gallery-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; color: #0f172a; }
        .event-footer-actions { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; }
        .event-sidebar-card { background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; }
        .event-sidebar-card h4 { font-size: 16px; font-weight: 700; margin-bottom: 16px; color: #0f172a; }
        .event-sidebar-card ul { list-style: none; padding: 0; }
        .event-sidebar-card li { padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #475569; font-size: 14px; display: flex; gap: 10px; }
        .event-sidebar-card li:last-child { border-bottom: none; }
      `}</style>
    </>
  );
}
