import HtmlContent from '../../../components/HtmlContent';
import { getDictionary } from '../../../lib/getDictionary';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.teamPage.metaTitle, description: dict.teamPage.metaDescription };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.teamPage;

  const members = [
    { key: 'arulanandem', img: 'team-1.jpg' },
    { key: 'murugamoorthy', img: 'team-2.jpg' },
    { key: 'sivaselvan', img: 'team-3.jpg' },
    { key: 'shobana', img: 'team-4.jpg' },
    { key: 'raj', img: 'team-5.jpg' },
    { key: 'sujikala', img: 'team-6.jpg' },
  ];

  const prefix = lang === 'en' ? '/en' : '';

  return (
    <HtmlContent html={`<!-- Page Header Section Start -->
    <div class="page-header dark-section parallaxie">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="page-header-box">
                        <h1 class="text-anime-style-3" data-cursor="-opaque">${t.heading}</h1>
                        <nav class="wow fadeInUp">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="${prefix}/">${t.breadcrumb.home}</a></li>
                                <li class="breadcrumb-item active" aria-current="page">${t.breadcrumb.current}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Page Header Section End -->

    <!-- Page Team Start -->
    <div class="page-team">
        <div class="container">
            <div class="row">
                ${members.map((m, i) => `
                <div class="col-xl-4 col-md-6">
                    <div class="team-item wow fadeInUp"${i > 0 ? ` data-wow-delay="${(i * 0.2).toFixed(1)}s"` : ''}>
                        <div class="team-item-image">
                            <a href="${prefix}/team-single" data-cursor-text="View">
                                <figure><img src="/images/${m.img}" alt="${t.members[m.key].name}"></figure>
                            </a>
                        </div>
                        <div class="team-item-body">
                            <div class="team-social-list-box">
                                <div class="team-social-btn">
                                    <a href="${prefix}/team-single"><img src="/images/icon-share.svg" alt=""></a>
                                </div>
                                <div class="team-social-list">
                                    <ul>
                                        <li><a href="#"><i class="fa-brands fa-facebook-f"></i></a></li>
                                        <li><a href="#"><i class="fa-brands fa-x-twitter"></i></a></li>
                                        <li><a href="#"><i class="fa-brands fa-pinterest-p"></i></a></li>
                                        <li><a href="#"><i class="fa-brands fa-instagram"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="team-item-content">
                                <h2><a href="${prefix}/team-single">${t.members[m.key].name}</a></h2>
                                <p>${t.members[m.key].role}</p>
                            </div>
                        </div>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </div>
    <!-- Page Team End -->`} />
  );
}
