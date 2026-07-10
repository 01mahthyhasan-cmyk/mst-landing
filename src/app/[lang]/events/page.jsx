import { connectDB } from '../../../lib/db';
import HtmlContent from '../../../components/HtmlContent';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const title = lang === 'ta'
    ? 'நிகழ்வுகள் | MST Health Care'
    : 'Recent Events | MST Health Care';
  const description = lang === 'ta'
    ? 'MST Health Care நடத்தும் சமீபத்திய நிகழ்வுகள், மருத்துவ முகாம்கள் மற்றும் சமூக சுகாதார நடவடிக்கைகள்.'
    : 'Recent community health events, medical camps, and clinic announcements by MST Health Care.';
  return { title, description };
}

async function getEvents(page = 1) {
  try {
    await connectDB();
    const { default: Event } = await import('../../../models/Event');
    const limit = 9;
    const filter = { status: 'published' };
    const [items, total] = await Promise.all([
      Event.find(filter).sort('-postedDate').skip((page - 1) * limit).limit(limit)
        .select('title subtitle slug postedDate mainImage likes views').lean(),
      Event.countDocuments(filter),
    ]);
    return { items, total, pages: Math.ceil(total / limit), page };
  } catch {
    return { items: [], total: 0, pages: 1, page: 1 };
  }
}

export default async function EventsPage({ params, searchParams }) {
  const { lang } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page || '1'));
  const { items: events, pages } = await getEvents(page);

  const p    = lang === 'en' ? '/en' : '';
  const home = lang === 'ta' ? '/' : '/en';

  const heading   = lang === 'ta' ? 'நிகழ்வுகள்' : 'Recent Events';
  const subTitle  = lang === 'ta' ? 'சமூக நிகழ்வுகள்' : 'Community Events';
  const readMore  = lang === 'ta' ? 'மேலும் படிக்க' : 'Read More';
  const homeLabel = lang === 'ta' ? 'முகப்பு' : 'Home';
  const viewsLbl  = lang === 'ta' ? 'பார்வைகள்' : 'views';
  const likesLbl  = lang === 'ta' ? 'விரும்பல்கள்' : 'likes';
  const emptyMsg  = lang === 'ta' ? 'இப்போது நிகழ்வுகள் இல்லை.' : 'No events published yet.';

  const eventCards = events.length === 0
    ? `<div class="col-lg-12"><p style="text-align:center;padding:60px;color:#64748b;">${emptyMsg}</p></div>`
    : events.map((ev, idx) => {
        const title    = lang === 'ta' ? (ev.title?.ta    || ev.title?.en)    : ev.title?.en;
        const subtitle = lang === 'ta' ? (ev.subtitle?.ta || ev.subtitle?.en) : ev.subtitle?.en;
        const delay    = idx < 3 ? `${idx * 0.2}s` : `${((idx % 3) * 0.2)}s`;
        const date     = ev.postedDate
          ? new Date(ev.postedDate).toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
          : '';
        const imgSrc   = ev.mainImage || '/images/post-1.jpg';
        return `
        <div class="col-xl-4 col-md-6">
          <div class="post-item wow fadeInUp" data-wow-delay="${delay}">
            <div class="post-featured-image">
              <a href="${p}/events/${ev.slug}" data-cursor-text="View">
                <figure class="image-anime">
                  <img src="${imgSrc}" alt="${title}" style="aspect-ratio:16/9;object-fit:cover;width:100%;">
                </figure>
              </a>
              <div class="post-item-tags">
                <span style="display:inline-flex;gap:12px;font-size:12px;color:#64748b;">
                  <span>👁 ${ev.views ?? 0} ${viewsLbl}</span>
                  <span>❤️ ${ev.likes ?? 0} ${likesLbl}</span>
                </span>
              </div>
            </div>
            <div class="post-item-body">
              <div class="post-item-content">
                ${date ? `<p style="font-size:12px;color:#94a3b8;margin-bottom:6px;">📅 ${date}</p>` : ''}
                <h2><a href="${p}/events/${ev.slug}">${title}</a></h2>
                ${subtitle ? `<p style="font-size:14px;color:#64748b;margin-top:6px;">${subtitle}</p>` : ''}
              </div>
              <div class="post-item-btn">
                <a href="${p}/events/${ev.slug}" class="readmore-btn">${readMore}</a>
              </div>
            </div>
          </div>
        </div>`;
      }).join('');

  const paginationLinks = pages > 1
    ? Array.from({ length: pages }, (_, i) => i + 1).map(n =>
        `<li${n === page ? ' class="active"' : ''}><a href="${p}/events?page=${n}">${n}</a></li>`
      ).join('')
    : '';

  return (
    <HtmlContent html={`<!-- Page Header Section Start -->
    <div class="page-header dark-section parallaxie">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="page-header-box">
                        <h1 class="text-anime-style-3" data-cursor="-opaque">${heading}</h1>
                        <nav class="wow fadeInUp">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="${home}">${homeLabel}</a></li>
                                <li class="breadcrumb-item active" aria-current="page">${heading}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Page Header Section End -->

    <!-- Events Listing Start -->
    <div class="page-blog">
        <div class="container">
            <div class="row">
                ${eventCards}
                ${paginationLinks ? `
                <div class="col-lg-12">
                    <div class="page-pagination wow fadeInUp">
                        <ul class="pagination">
                            <li><a href="${p}/events?page=${Math.max(1, page - 1)}"><i class="fa-solid fa-angle-left"></i></a></li>
                            ${paginationLinks}
                            <li><a href="${p}/events?page=${Math.min(pages, page + 1)}"><i class="fa-solid fa-angle-right"></i></a></li>
                        </ul>
                    </div>
                </div>` : ''}
            </div>
        </div>
    </div>
    <!-- Events Listing End -->`.replace(/\r\n/g, '\n')} />
  );
}
