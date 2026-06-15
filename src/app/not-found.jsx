import HtmlContent from '../components/HtmlContent';
export const metadata = {
  title: "MST Health Care | Compassion. Care. Comfort.",
};

export default function Page() {
  return (
    <HtmlContent html={`<!-- Page Header Section Start -->
    <div class="page-header dark-section parallaxie">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <!-- Page Header Box Start -->
                    <div class="page-header-box">
                        <h1 class="text-anime-style-3" data-cursor="-opaque">Page not found</h1>
                        <nav class="wow fadeInUp" >
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="/">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">404 Error page</li>
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
                            <h2 class="text-anime-style-3" data-cursor="-opaque">Oops! page not found</h2>
                        </div>
                        <div class="error-page-content-body">
                            <p class="wow fadeInUp" data-wow-delay="0.2s">The page you are looking for does not exist.</p>
                            <a class="btn-default wow fadeInUp" data-wow-delay="0.4s" href="/">Back to Homepage</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- error Page end -->`.replace(/\r\n/g, '\n')} />
  );
}
