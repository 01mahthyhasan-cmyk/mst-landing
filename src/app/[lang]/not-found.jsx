import HtmlContent from '../../components/HtmlContent';
import { getDictionary } from '../../lib/getDictionary';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Page Not Found | MST Health Care',
};

export default async function NotFound() {
  // not-found files don't receive params — read locale from proxy header
  const headersList = await headers();
  const lang = headersList.get('x-locale') || 'ta';
  const dict = await getDictionary(lang);
  const t = dict.notFoundPage;

  return (
    <HtmlContent html={`<!-- Page Header Section Start -->
    <div class="page-header dark-section parallaxie">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <!-- Page Header Box Start -->
                    <div class="page-header-box">
                        <h1 class="text-anime-style-3" data-cursor="-opaque">${t.heading}</h1>
                        <nav class="wow fadeInUp" >
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="${lang === 'ta' ? '/' : '/en'}">${t.breadcrumb.home}</a></li>
                                <li class="breadcrumb-item active" aria-current="page">${t.breadcrumb.current}</li>
                            </ol>
                        </nav>
                    </div>
                    <!-- Page Header Box End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Page Header Section End -->

    <!-- error Page start -->
    <div class="error-page">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="error-page-image wow fadeInUp">
                        <img src="/images/404-error-image.png" alt="">
                    </div>
                    <div class="error-page-content">
                        <div class="section-title">
                            <h2 class="text-anime-style-3" data-cursor="-opaque">${t.subHeading}</h2>
                        </div>
                        <div class="error-page-content-body">
                            <p class="wow fadeInUp" data-wow-delay="0.2s">${t.description}</p>
                            <a class="btn-default wow fadeInUp" data-wow-delay="0.4s" href="${lang === 'ta' ? '/' : '/en'}">${t.backButton}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- error Page end -->`.replace(/\r\n/g, '\n')} />
  );
}
