import HtmlContent from '../../../components/HtmlContent';
import { getDictionary } from '../../../lib/getDictionary';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.videoGalleryPage.metaTitle, description: dict.videoGalleryPage.metaDescription };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.videoGalleryPage;
  const home = lang === 'ta' ? '/' : '/en';

  const images = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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

    <!-- Page Video Gallery Start -->
    <div class="page-video-gallery">
        <div class="container">
            <div class="row">
                ${images.map((n, i) => `
                <div class="col-lg-4 col-md-6">
                    <div class="video-gallery-image wow fadeInUp"${i > 0 ? ` data-wow-delay="${(i * 0.2).toFixed(1)}s"` : ''}>
                        <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">
                            <figure>
                                <img src="/images/gallery-${n}.jpg" alt="">
                            </figure>
                        </a>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </div>
    <!-- Page Video Gallery End -->`.replace(/\r\n/g, '\n')} />
  );
}
