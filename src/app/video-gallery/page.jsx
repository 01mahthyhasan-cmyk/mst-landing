import HtmlContent from '../../components/HtmlContent';
export const metadata = {
  title: "Video Gallery | MST Health Care",
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
                        <h1 class="text-anime-style-3" data-cursor="-opaque">Our video</h1>
                        <nav class="wow fadeInUp" >
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="/">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Video</li>
                            </ol>
                        </nav>
                    </div>
                    <!-- Page Header Box End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Page Header Section End -->

    <!-- Page Video Gallery Start -->
    <div class="page-video-gallery">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-md-6">
                    <!-- Video Gallery start -->
                    <div class="video-gallery-image wow fadeInUp">
                        <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">
                            <figure>
                                <img src="/images/gallery-1.jpg" alt="">
                            </figure>
                        </a>
                    </div>
                    <!-- Video Gallery end -->
                </div>

                <div class="col-lg-4 col-md-6">
                    <!-- Video Gallery start -->
                    <div class="video-gallery-image wow fadeInUp" data-wow-delay="0.2s">
                        <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">
                            <figure>
                                <img src="/images/gallery-2.jpg" alt="">
                            </figure>
                        </a>
                    </div>
                    <!-- Video Gallery end -->
                </div>

                <div class="col-lg-4 col-md-6">
                    <!-- Video Gallery start -->
                    <div class="video-gallery-image wow fadeInUp" data-wow-delay="0.4s">
                        <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">
                            <figure>
                                <img src="/images/gallery-3.jpg" alt="">
                            </figure>
                        </a>
                    </div>
                    <!-- Video Gallery end -->
                </div>

                <div class="col-lg-4 col-md-6">
                    <!-- Video Gallery start -->
                    <div class="video-gallery-image wow fadeInUp" data-wow-delay="0.6s">
                        <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">
                            <figure>
                                <img src="/images/gallery-4.jpg" alt="">
                            </figure>
                        </a>
                    </div>
                    <!-- Video Gallery end -->
                </div>

                <div class="col-lg-4 col-md-6">
                    <!-- Video Gallery start -->
                    <div class="video-gallery-image wow fadeInUp" data-wow-delay="0.8s">
                        <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">
                            <figure>
                                <img src="/images/gallery-5.jpg" alt="">
                            </figure>
                        </a>
                    </div>
                    <!-- Video Gallery end -->
                </div>

                <div class="col-lg-4 col-md-6">
                    <!-- Video Gallery start -->
                    <div class="video-gallery-image wow fadeInUp" data-wow-delay="1s">
                        <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">
                            <figure>
                                <img src="/images/gallery-6.jpg" alt="">
                            </figure>
                        </a>
                    </div>
                    <!-- Video Gallery end -->
                </div>

                <div class="col-lg-4 col-md-6">
                    <!-- Video Gallery start -->
                    <div class="video-gallery-image wow fadeInUp" data-wow-delay="1.2s">
                        <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">
                            <figure>
                                <img src="/images/gallery-7.jpg" alt="">
                            </figure>
                        </a>
                    </div>
                    <!-- Video Gallery end -->
                </div>

                <div class="col-lg-4 col-md-6">
                    <!-- Video Gallery start -->
                    <div class="video-gallery-image wow fadeInUp" data-wow-delay="1.4s">
                        <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">
                            <figure>
                                <img src="/images/gallery-8.jpg" alt="">
                            </figure>
                        </a>
                    </div>
                    <!-- Video Gallery end -->
                </div>

                <div class="col-lg-4 col-md-6">
                    <!-- Video Gallery start -->
                    <div class="video-gallery-image wow fadeInUp" data-wow-delay="1.6s">
                        <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">
                            <figure>
                                <img src="/images/gallery-9.jpg" alt="">
                            </figure>
                        </a>
                    </div>
                    <!-- Video Gallery end -->
                </div>
            </div>
        </div>
    </div>
    <!-- Page Video Gallery End -->`.replace(/\r\n/g, '\n')} />
  );
}
