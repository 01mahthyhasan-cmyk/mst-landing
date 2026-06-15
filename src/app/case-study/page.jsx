import HtmlContent from '../../components/HtmlContent';
export const metadata = {
  title: "Case Studies | MST Health Care",
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
                        <h1 class="text-anime-style-3" data-cursor="-opaque">Case study</h1>
                        <nav class="wow fadeInUp" >
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="/">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Case Study</li>
                            </ol>
                        </nav>
                    </div>
                    <!-- Page Header Box End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Page Header Section End -->

    <!-- Page Case Study Start -->
    <div class="page-case-study">
        <div class="container">
            <div class="row">
                <div class="col-xl-4 col-md-6">
                    <!-- Case Study Item Start -->
                    <div class="case-study-item wow fadeInUp">
                        <div class="case-study-item-image">
                            <a href="/case-study-single" data-cursor-text="View">
                                <figure>
                                    <img src="/images/case-study-image-1.jpg" alt="">
                                </figure>
                            </a>
                        </div>
                        <div class="case-study-item-content">
                            <h2><a href="/case-study-single">Heart Health Recovery</a></h2>
                            <p>A patient experiencing severe as diagnosed with a cardiac condition.</p>
                        </div>
                    </div>
                    <!-- Case Study Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Case Study Item Start -->
                    <div class="case-study-item wow fadeInUp" data-wow-delay="0.2s">
                        <div class="case-study-item-image">
                            <a href="/case-study-single" data-cursor-text="View">
                                <figure>
                                    <img src="/images/case-study-image-2.jpg" alt="">
                                </figure>
                            </a>
                        </div>
                        <div class="case-study-item-content">
                            <h2><a href="/case-study-single">OPD (Outpatient Department) Improvement</a></h2>
                            <p>A patient experiencing severe as diagnosed with a cardiac condition.</p>
                        </div>
                    </div>
                    <!-- Case Study Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Case Study Item Start -->
                    <div class="case-study-item wow fadeInUp" data-wow-delay="0.4s">
                        <div class="case-study-item-image">
                            <a href="/case-study-single" data-cursor-text="View">
                                <figure>
                                    <img src="/images/case-study-image-3.jpg" alt="">
                                </figure>
                            </a>
                        </div>
                        <div class="case-study-item-content">
                            <h2><a href="/case-study-single">Elders Care Skin Treatment</a></h2>
                            <p>A patient experiencing severe as diagnosed with a cardiac condition.</p>
                        </div>
                    </div>
                    <!-- Case Study Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Case Study Item Start -->
                    <div class="case-study-item wow fadeInUp" data-wow-delay="0.6s">
                        <div class="case-study-item-image">
                            <a href="/case-study-single" data-cursor-text="View">
                                <figure>
                                    <img src="/images/case-study-image-4.jpg" alt="">
                                </figure>
                            </a>
                        </div>
                        <div class="case-study-item-content">
                            <h2><a href="/case-study-single">Successful Heart Treatment</a></h2>
                            <p>Our cardiology team performed advanced diagnostic tests followed</p>
                        </div>
                    </div>
                    <!-- Case Study Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Case Study Item Start -->
                    <div class="case-study-item wow fadeInUp" data-wow-delay="0.8s">
                        <div class="case-study-item-image">
                            <a href="/case-study-single" data-cursor-text="View">
                                <figure>
                                    <img src="/images/case-study-image-5.jpg" alt="">
                                </figure>
                            </a>
                        </div>
                        <div class="case-study-item-content">
                            <h2><a href="/case-study-single">Home Visit Services Recovery</a></h2>
                            <p>A combination of surgical treatment and physiotherapy was provided.</p>
                        </div>
                    </div>
                    <!-- Case Study Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Case Study Item Start -->
                    <div class="case-study-item wow fadeInUp" data-wow-delay="1s">
                        <div class="case-study-item-image">
                            <a href="/case-study-single" data-cursor-text="View">
                                <figure>
                                    <img src="/images/case-study-image-6.jpg" alt="">
                                </figure>
                            </a>
                        </div>
                        <div class="case-study-item-content">
                            <h2><a href="/case-study-single">OPD (Outpatient Department) Success</a></h2>
                            <p>The child was frequently experiencing breathing problems.</p>
                        </div>
                    </div>
                    <!-- Case Study Item End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Page Case Study End -->`.replace(/\r\n/g, '\n')} />
  );
}
