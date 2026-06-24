import HtmlContent from '../../../components/HtmlContent';
import { getDictionary } from '../../../lib/getDictionary';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.caseStudyPage.metaTitle };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.caseStudyPage;
  const home = lang === 'ta' ? '/' : '/en';
  const csSingle = lang === 'ta' ? '/case-study-single' : '/en/case-study-single';

  const items = [
    { key: 'cs1', img: '/images/case-study-image-1.jpg', delay: '' },
    { key: 'cs2', img: '/images/case-study-image-2.jpg', delay: '0.2s' },
    { key: 'cs3', img: '/images/case-study-image-3.jpg', delay: '0.4s' },
    { key: 'cs4', img: '/images/case-study-image-4.jpg', delay: '0.6s' },
    { key: 'cs5', img: '/images/case-study-image-5.jpg', delay: '0.8s' },
    { key: 'cs6', img: '/images/case-study-image-6.jpg', delay: '1s' },
  ];

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
                                <li class="breadcrumb-item"><a href="${home}">${t.breadcrumb.home}</a></li>
                                <li class="breadcrumb-item active" aria-current="page">${t.breadcrumb.current}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Page Header Section End -->

    <!-- Page Case Study Start -->
    <div class="page-case-study">
        <div class="container">
            <div class="row">
                ${items.map(({ key, img, delay }) => `
                <div class="col-xl-4 col-md-6">
                    <div class="case-study-item wow fadeInUp"${delay ? ` data-wow-delay="${delay}"` : ''}>
                        <div class="case-study-item-image">
                            <a href="${csSingle}" data-cursor-text="View">
                                <figure><img src="${img}" alt=""></figure>
                            </a>
                        </div>
                        <div class="case-study-item-content">
                            <h2><a href="${csSingle}">${t.items[key].title}</a></h2>
                            <p>${t.items[key].desc}</p>
                        </div>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </div>
    <!-- Page Case Study End -->`.replace(/\r\n/g, '\n')} />
  );
}
