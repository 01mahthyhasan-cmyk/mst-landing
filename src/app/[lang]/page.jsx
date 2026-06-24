import HtmlContent from '../../components/HtmlContent';
import { getDictionary } from '../../lib/getDictionary';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.homePage.metaTitle,
  };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.homePage;
  const tc = dict.common;
  const af = tc.appointmentForm;
  const fs = tc.factStatistics;
  const es = tc.emergencySupport;
  const cf = tc.coreFeatures;
  const fa = tc.faqSection;
  const team = t.team;
  const test = t.testimonials;
  const caseStudy = t.caseStudy;
  const wcu = t.whyChooseUs;
  
  const p = lang === 'en' ? '/en' : '';
  const trustedUsersText = fs.trustedUsers.replace('{{count}}', '58,900+');
  const servicesTrustedText = t.services.trustedUsers.replace('{{count}}', '58,900+');

  return (
    <HtmlContent html={`<!-- Hero Section Start -->
    <div class="hero dark-section parallaxie">
        <div class="container">
            <div class="row">
                <div class="col-xl-7">
                    <!-- Hero Content Start -->
                    <div class="hero-content">
                        <!-- Section Title Start -->
                            <span class="section-sub-title wow fadeInUp" style="text-shadow: 0 2px 5px rgba(0,0,0,0.5); font-weight: 600; color: #fff;">${t.hero.subTitle}</span>
                            <h1 class="text-anime-style-3" data-cursor="-opaque" style="color: #ffffff; text-shadow: 0 4px 15px rgba(0,0,0,0.9); font-weight: 700;">${t.hero.heading}</h1>
                            <p class="wow fadeInUp" data-wow-delay="0.2s" style="text-shadow: 0 1px 6px rgba(0,0,0,0.7); font-size: 18px; font-weight: 500; color: #f5f5f5;">${t.hero.description}</p>
                        </div>
                        <!-- Section Title End -->

                        <!-- Hero Content Body Start -->
                        <div class="hero-content-body wow fadeInUp" data-wow-delay="0.4s">
                            <!-- Hero Button Start -->
                            <div class="hero-btn">
                                <a href="${p}/book-appointment" class="btn-default btn-highlighted">${t.hero.bookAppointmentButton}</a>
                                <a href="${p}/contact" class="btn-default" style="margin-left: 15px; background: transparent; border: 1px solid rgba(255,255,255,0.3); color: #fff;">${t.hero.contactButton}</a>
                            </div>
                            <!-- Hero Button End -->

                            <!-- Hero Client Box Start -->
                            <div class="hero-client-box">
                                <!-- Satisfy Client Image Start -->
                                <div class="satisfy-client-images">
                                    <div class="satisfy-client-image">
                                        <figure class="image-anime">
                                            <img src="/images/author-1.jpg" alt="">
                                        </figure>
                                    </div>
                                    <div class="satisfy-client-image">
                                        <figure class="image-anime">
                                            <img src="/images/author-2.jpg" alt="">
                                        </figure>
                                    </div>
                                    <div class="satisfy-client-image">
                                        <figure class="image-anime">
                                            <img src="/images/author-3.jpg" alt="">
                                        </figure>
                                    </div>
                                </div>
                                <!-- Satisfy Client Image End -->

                                <!-- Hero Client Content Start -->
                                <div class="hero-client-content">
                                    <h2><span class="counter">4.9</span>/5<i class="fa fa-solid fa-star"></i></h2>
                                    <p>${t.hero.reviewCount}</p>
                                </div>
                                <!-- Hero Client Content End -->
                            </div>
                            <!-- Hero Client Box End -->
                        </div>
                        <!-- Hero Content Body End -->
                    </div>
                    <!-- Hero Content End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Hero Section End -->

    <!-- About Us Section Start -->
    <div class="about-us">
        <div class="container">
            <div class="row">
                <div class="col-xl-6">
                    <!-- About Us Image Box Start -->
                    <div class="about-us-image-box wow fadeInUp">
                        <!-- About Image Title Start -->
                        <div class="about-image-title">
                            <h2>${t.about.imageTitle}</h2>
                        </div>
                        <!-- About Image Title End -->

                        <!-- About Image Box 1 Start -->
                        <div class="about-image-box-1">
                            <!-- About Us Image Start -->
                            <div class="about-us-image">
                                <figure>
                                    <img src="/images/about-us-image.jpg" alt="">
                                </figure>
                            </div>
                            <!-- About Us Image End -->
                            
                            <!-- About Review Box Start -->
                            <div class="about-review-box hero-client-box">
                                <!-- Satisfy Client Image Start -->
                                <div class="satisfy-client-images">
                                    <div class="satisfy-client-image">
                                        <figure class="image-anime">
                                            <img src="/images/author-1.jpg" alt="">
                                        </figure>
                                    </div>
                                    <div class="satisfy-client-image">
                                        <figure class="image-anime">
                                            <img src="/images/author-2.jpg" alt="">
                                        </figure>
                                    </div>
                                    <div class="satisfy-client-image">
                                        <figure class="image-anime">
                                            <img src="/images/author-3.jpg" alt="">
                                        </figure>
                                    </div>
                                </div>
                                <!-- Satisfy Client Image End -->

                                <!-- Hero Client Content Start -->
                                <div class="hero-client-content">
                                    <h2><span class="counter">4.9</span>/5<i class="fa fa-solid fa-star"></i></h2>
                                    <p>${t.about.reviewCount}</p>
                                </div>
                                <!-- Hero Client Content End -->
                            </div>
                            <!-- About Review Box End -->
                        </div>
                        <!-- About Image Box 1 End -->
                    </div>
                    <!-- About Us Image Box End -->
                </div>

                <div class="col-xl-6">
                    <!-- About Us Content Start -->
                    <div class="about-us-content">
                        <!-- Section Title Start -->
                        <div class="section-title">
                            <span class="section-sub-title wow fadeInUp">${t.about.subTitle}</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">${t.about.heading}</h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">${t.about.description}</p>
                        </div>
                        <!-- Section Title End -->

                        <!-- About Us Item List Start -->
                        <div class="about-us-item-list wow fadeInUp" data-wow-delay="0.4s">
                            <!-- About Us Item Start -->
                            <div class="about-us-item">
                                <h3>${t.about.items.patientFocused.title}</h3>
                                <p>${t.about.items.patientFocused.description}</p>
                            </div>
                            <!-- About Us Item End -->

                            <!-- About Us Item Start -->
                            <div class="about-us-item">
                                <h3>${t.about.items.qualityTreatment.title}</h3>
                                <p>${t.about.items.qualityTreatment.description}</p>
                            </div>
                            <!-- About Us Item End -->
                        </div>
                        <!-- About Us Item List End -->

                        <!-- About Content Footer Start -->
                        <div class="about-content-footer wow fadeInUp" data-wow-delay="0.6s">
                            <!-- About Us Button Start -->
                            <div class="about-us-btn">
                                <a href="${p}/about" class="btn-default">${t.about.learnMoreButton}</a>
                            </div>
                            <!-- About Us Button End -->

                            <!-- About Us Author Box Start -->
                            <div class="about-us-author-box">
                                <!-- About Author Image Start -->
                                <div class="about-us-author-image">
                                    <figure class="image-anime">
                                        <img src="/images/author-1.jpg" alt="">
                                    </figure>
                                </div>
                                <!-- About Author Image End -->

                                <!-- About Author Content Start -->
                                <div class="about-us-author-content">
                                    <h3>${t.about.author.name}</h3>
                                    <p>${t.about.author.title}</p>
                                </div>
                                <!-- About Author Content End -->
                            </div>
                            <!-- About Us Author Box End -->
                        </div>
                        <!-- About Content Footer End -->
                    </div>
                    <!-- About Us Content End -->
                </div>
            </div>
        </div>
    </div>
    <!-- About Us Section End -->

    <!-- Our Service Section Start -->
    <div class="our-service bg-section">
        <div class="container">
            <div class="row section-row">
                <div class="col-lg-12">
                    <!-- Section Title Start -->
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">${t.services.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${t.services.heading}</h2>
                    </div>
                    <!-- Section Title End -->
                </div>
            </div>

            <div class="row">
                <div class="col-xl-3 col-md-6">
                    <!-- Service Item Start -->
                    <div class="service-item wow fadeInUp">
                        <div class="icon-box">
                            <img src="/images/icon-service-item-1.svg" alt="">
                        </div>
                        <div class="service-item-body">
                            <div class="service-item-content">
                                <h2><a href="${p}/service-single?service=opd">${t.services.items.opd.title}</a></h2>
                                <p>${t.services.items.opd.description}</p>
                            </div>
                            <div class="service-item-btn">
                                <a href="${p}/service-single?service=opd" class="readmore-btn">${t.services.items.opd.viewDetails}</a>
                            </div>
                        </div>
                    </div>
                    <!-- Service Item End -->
                </div>

                <div class="col-xl-3 col-md-6">
                    <!-- Service Item Start -->
                    <div class="service-item wow fadeInUp" data-wow-delay="0.2s">
                        <div class="icon-box">
                            <img src="/images/icon-service-item-2.svg" alt="">
                        </div>
                        <div class="service-item-body">
                            <div class="service-item-content">
                                <h2><a href="${p}/service-single?service=clinic">${t.services.items.clinicServices.title}</a></h2>
                                <p>${t.services.items.clinicServices.description}</p>
                            </div>
                            <div class="service-item-btn">
                                <a href="${p}/service-single?service=clinic" class="readmore-btn">${t.services.items.clinicServices.viewDetails}</a>
                            </div>
                        </div>
                    </div>
                    <!-- Service Item End -->
                </div>

                <div class="col-xl-3 col-md-6">
                    <!-- Service Item Start -->
                    <div class="service-item wow fadeInUp" data-wow-delay="0.4s">
                        <div class="icon-box">
                            <img src="/images/icon-service-item-3.svg" alt="">
                        </div>
                        <div class="service-item-body">
                            <div class="service-item-content">
                                <h2><a href="${p}/service-single?service=ecg">${t.services.items.ecg.title}</a></h2>
                                <p>${t.services.items.ecg.description}</p>
                            </div>
                            <div class="service-item-btn">
                                <a href="${p}/service-single?service=ecg" class="readmore-btn">${t.services.items.ecg.viewDetails}</a>
                            </div>
                        </div>
                    </div>
                    <!-- Service Item End -->
                </div>

                <div class="col-xl-3 col-md-6">
                    <!-- Service Cta Box Start -->
                    <div class="service-item service-cta-box wow fadeInUp" data-wow-delay="0.6s">
                        <!-- Service Cta Box Title Start -->
                        <div class="service-cta-box-title">
                            <h3>${t.services.ctaTitle}</h3>
                        </div>
                        <!-- Service Cta Box Title End -->

                        <!-- Service Cta Box Image Start -->
                        <div class="service-cta-box-image">
                            <figure>
                                <img src="/images/our-service-box-image.png" alt="">
                            </figure>
                        </div>
                        <!-- Service Cta Box  Image End -->
                    </div>
                    <!-- Service Cta Box End -->
                </div>

                <div class="col-lg-12">
                    <!-- Section Footer Text Start -->
                    <div class="section-footer-text wow fadeInUp" data-wow-delay="0.4s">
                        <p>${t.services.footerText}</p>
                        <ul>
                            <li class="section-footer-content">${servicesTrustedText}</li>
                            <li>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                            </li>
                            <li><span class="counter">4.9</span>/5</li>
                        </ul>
                    </div>
                    <!-- Section Footer Text End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Our Service Section End -->

    <!-- Why Choose Us Section Start -->
    <div class="why-choose-us">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-xl-6">
                    <!-- Why Choose Us Content Start -->
                    <div class="why-choose-us-content">
                        <!-- Section Title Start -->
                        <div class="section-title">
                            <span class="section-sub-title wow fadeInUp">${wcu.subTitle}</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">${wcu.heading}</h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">${wcu.description}</p>
                        </div>
                        <!-- Section Title End -->

                        <!-- Why Choose Us Body Start -->
                        <div class="why-choose-us-body">
                            <!-- Why Choose Counter Box Start -->
                            <div class="why-choose-counter-box wow fadeInUp" data-wow-delay="0.4s">
                                <!-- Why choose Counter Item List Start -->
                                <div class="why-choose-counter-item-list">
                                    <!-- Why choose Counter Item Start -->
                                    <div class="why-choose-counter-item">
                                        <h2><span class="counter">25</span>+</h2>
                                        <p>${wcu.yearsExperience}</p>
                                    </div>
                                    <!-- Why choose Counter Item End -->

                                    <!-- Why choose Counter Item Start -->
                                    <div class="why-choose-counter-item">
                                        <h2><span class="counter">24</span>/7</h2>
                                        <p>${wcu.emergencySupport}</p>
                                    </div>
                                    <!-- Why choose Counter Item End -->
                                </div>
                                <!-- Why Choose Counter Item List End -->

                                <!-- Why Choose Counter Image Start -->
                                <div class="why-choose-counter-image">
                                    <figure class="image-anime">
                                        <img src="/images/why-choose-counter-image.jpg" alt="">
                                    </figure>
                                </div>
                                <!-- Why Choose Counter Image End -->
                            </div>
                            <!-- Why Choose Counter Box End -->

                            <!-- Why Choose Body Image Start -->
                            <div class="why-choose-body-image">
                                <figure class="image-anime reveal">
                                    <img src="/images/why-choose-body-image.jpg" alt="">
                                </figure>
                            </div>
                            <!-- Why Choose Body Image End -->
                        </div>
                        <!-- Why Choose Us Body End -->
                    </div>
                    <!-- Why Choose Us Content End -->
                </div>

                <div class="col-xl-6">
                    <!-- Why choose Us Image Box Start -->
                    <div class="why-choose-us-image-box wow fadeInUp">
                        <!-- Why Choose Experience Circle Start -->
                        <div class="years-experience-circle">
                            <figure>
                                <img src="/images/years-experience-circle-white.svg" alt="">
                            </figure>
                        </div>
                        <!-- Why Choose Experience Circle End -->

                        <!-- Why Choose Us Image Start -->
                        <div class="why-choose-us-image">
                            <figure>
                                <img src="/images/why-choose-us-image.png" alt="">
                            </figure>
                        </div>
                        <!-- Why Choose Us Image End -->

                        <!-- Why Choose Cta Box Start -->
                        <div class="why-choose-cta-box">
                            <div class="icon-box">
                                <img src="/images/icon-why-choose-cta-box.svg" alt="">
                            </div>
                            <div class="why-choose-cta-content">
                                <h2><span class="counter">12</span>+</h2>
                                <p>${wcu.medicalDepartments}</p>
                            </div>
                        </div>
                        <!-- Why Choose Counter Box End -->
                    </div>
                    <!-- Why choose Us Image Box End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Why Choose Us Section End -->

    <!-- Core Features Section Start -->
    <div class="core-features bg-section dark-section">
        <div class="container">
            <div class="row">
                <div class="col-xl-5">
                    <!-- Core Features Content Start -->
                    <div class="core-features-content">
                        <!-- Section Title Start -->
                        <div class="section-title">
                            <span class="section-sub-title wow fadeInUp">${cf.subTitle}</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">${cf.heading}</h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">${cf.description}</p>
                        </div>
                        <!-- Section Title End -->

                        <!-- Core Features Content Button Start -->
                        <div class="core-features-content-btn wow fadeInUp" data-wow-delay="0.4s">
                            <a href="${p}/contact" class="btn-default btn-highlighted">${cf.contactButton}</a>
                        </div>
                        <!-- Core Features Content Button End -->
                    </div>
                    <!-- Core Features Content End -->
                </div>

                <div class="col-xl-7">
                    <!-- Core Features Item List Start -->
                    <div class="core-features-item-list">
                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-1.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>${cf.items.qualityTreatment}</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="0.2s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-2.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>${cf.items.personalizedCare}</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="0.4s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-3.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>${cf.items.modernFacilities}</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="0.6s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-4.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>${cf.items.emergencySupport}</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="0.8s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-5.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>${cf.items.fastAccurate}</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="1s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-6.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>${cf.items.safeEnvironment}</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="1.2s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-7.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>${cf.items.experiencedProfessionals}</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="1.4s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-8.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>${cf.items.advancedDiagnostic}</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->
                    </div>
                    <!-- Core Features Item List End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Core Features Section End -->

    <!-- Case Study Section Start -->
    <div class="our-case-study">
        <div class="container">
            <div class="row section-row">
                <div class="col-lg-12">
                    <!-- Section Title Start -->
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">${caseStudy.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${caseStudy.heading}</h2>
                        <p class="wow fadeInUp" data-wow-delay="0.2s">${caseStudy.description}</p>
                    </div>
                    <!-- Section Title End -->
                </div>
            </div>

            <div class="row">
                <div class="col-xl-4 col-md-6">
                    <!-- Case Study Item Start -->
                    <div class="case-study-item wow fadeInUp">
                        <div class="case-study-item-image">
                            <a href="${p}/case-study-single" data-cursor-text="View">
                                <figure>
                                    <img src="/images/case-study-image-1.jpg" alt="">
                                </figure>
                            </a>
                        </div>
                        <div class="case-study-item-content">
                            <h2><a href="${p}/case-study-single">${caseStudy.items.heartHealth.title}</a></h2>
                            <p>${caseStudy.items.heartHealth.description}</p>
                        </div>
                    </div>
                    <!-- Case Study Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Case Study Item Start -->
                    <div class="case-study-item wow fadeInUp" data-wow-delay="0.2s">
                        <div class="case-study-item-image">
                            <a href="${p}/case-study-single" data-cursor-text="View">
                                <figure>
                                    <img src="/images/case-study-image-2.jpg" alt="">
                                </figure>
                            </a>
                        </div>
                        <div class="case-study-item-content">
                            <h2><a href="${p}/case-study-single">${caseStudy.items.opd.title}</a></h2>
                            <p>${caseStudy.items.opd.description}</p>
                        </div>
                    </div>
                    <!-- Case Study Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Case Study Item Start -->
                    <div class="case-study-item wow fadeInUp" data-wow-delay="0.4s">
                        <div class="case-study-item-image">
                            <a href="${p}/case-study-single" data-cursor-text="View">
                                <figure>
                                    <img src="/images/case-study-image-3.jpg" alt="">
                                </figure>
                            </a>
                        </div>
                        <div class="case-study-item-content">
                            <h2><a href="${p}/case-study-single">${caseStudy.items.elderscare.title}</a></h2>
                            <p>${caseStudy.items.elderscare.description}</p>
                        </div>
                    </div>
                    <!-- Case Study Item End -->
                </div>

                <div class="col-lg-12">
                    <!-- Section Footer Text Start -->
                    <div class="section-footer-text section-satisfy-img wow fadeInUp" data-wow-delay="0.6s">
                        <!-- Satisfy Client Images Start -->
                        <div class="satisfy-client-images">
                            <div class="satisfy-client-image">
                                <figure class="image-anime">
                                    <img src="/images/author-1.jpg" alt="">
                                </figure>
                            </div>
                            <div class="satisfy-client-image add-more">
                                <img src="/images/icon-phone-white.svg" alt="">
                            </div>
                        </div>
                        <!-- Satisfy Client Images End -->    
                        <p>${caseStudy.footerText} - <a href="${p}/case-study">${caseStudy.viewAllLink}</a></p>
                    </div>
                    <!-- Section Footer Text End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Case Study Section End -->

    <!-- Our Fact Section Start -->
    <div class="our-facts bg-section dark-section">
        <div class="container">
            <div class="row section-row">
                <div class="col-lg-12">
                    <!-- Section Title Start -->
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">${fs.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${fs.heading}</h2>
                    </div>
                    <!-- Section Title End -->
                </div>
            </div>

            <div class="row">
                <div class="col-xl-4 col-md-6">
                    <!-- Fact Item Start -->
                    <div class="fact-item wow fadeInUp">
                        <div class="fact-item-header">
                            <div class="fact-item-counter-content">
                                <h2><span class="counter">35</span>+</h2>
                                <ul>
                                    <li>${fs.professionalTeam.label}</li>
                                </ul>
                            </div>
                            <div class="icon-box">
                                <img src="/images/icon-fact-item-1.svg" alt="">
                            </div>
                        </div>
                        <div class="fact-item-content">
                            <p>${fs.professionalTeam.description}</p>
                        </div>
                    </div>
                    <!-- Fact Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Fact Item Start -->
                    <div class="fact-item wow fadeInUp" data-wow-delay="0.2s">
                        <div class="fact-item-header">
                            <div class="fact-item-counter-content">
                                <h2><span class="counter">12</span>+</h2>
                                <ul>
                                    <li>${fs.medicalDepartments.label}</li>
                                </ul>
                            </div>
                            <div class="icon-box">
                                <img src="/images/icon-fact-item-2.svg" alt="">
                            </div>
                        </div>
                        <div class="fact-item-content">
                            <p>${fs.medicalDepartments.description}</p>
                        </div>
                    </div>
                    <!-- Fact Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Fact Item Start -->
                    <div class="fact-item wow fadeInUp" data-wow-delay="0.4s">
                        <div class="fact-item-header">
                            <div class="fact-item-counter-content">
                                <h2><span class="counter">24</span>/7</h2>
                                <ul>
                                    <li>${fs.emergencySupport.label}</li>
                                </ul>
                            </div>
                            <div class="icon-box">
                                <img src="/images/icon-fact-item-3.svg" alt="">
                            </div>
                        </div>
                        <div class="fact-item-content">
                            <p>${fs.emergencySupport.description}</p>
                        </div>
                    </div>
                    <!-- Fact Item End -->
                </div>

                <div class="col-lg-12">
                    <!-- Section Footer Text Start -->
                    <div class="section-footer-text wow fadeInUp" data-wow-delay="0.4s">
                        <p>${fs.servicesFooter}</p>
                        <ul>
                            <li class="section-footer-content">${trustedUsersText}</li>
                            <li>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                            </li>
                            <li><span class="counter">4.9</span>/5</li>
                        </ul>
                    </div>
                    <!-- Section Footer Text End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Our Fact Section End -->

    <!-- Our Team Section Start -->
    <div class="our-team">
        <div class="container">
            <div class="row section-row">
                <div class="col-lg-12">
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">${team.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${team.heading}</h2>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-xl-4 col-md-6">
                    <!-- Team Item Start -->
                    <div class="team-item wow fadeInUp">
                        <!-- Team Item Image Start -->
                        <div class="team-item-image">
                            <a href="#" data-cursor-text="View">
                                <figure style="background:#f0f4f8; display:flex; align-items:center; justify-content:center; aspect-ratio:1/1; width:100%;">
                                    <div style="width:160px; height:160px; border-radius:50%; background:linear-gradient(135deg, #0a6c74, #1a9aa0); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                                        <span style="font-size:70px; color:rgba(255,255,255,0.9);"><i class="fa-solid fa-user-doctor"></i></span>
                                    </div>
                                </figure>
                            </a>
                        </div>
                        <!-- Team Item Image End -->

                        <!-- Team Item Body Start -->
                        <div class="team-item-body">
                            <!-- Team Social List Box Start -->
                            <div class="team-social-list-box">
                                <div class="team-social-btn">
                                    <a href="#"><img src="/images/icon-share.svg" alt=""></a>
                                </div>
                                <div class="team-social-list">
                                    <ul>
                                        <li><a href="#"><i class="fa-brands fa-facebook-f"></i></a></li>
                                        <li><a href="#"><i class="fa-brands fa-x-twitter"></i></a></li>
                                        <li><a href="#"><i class="fa-brands fa-instagram"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Team Social List Box End -->

                            <!-- Team Item Content Start -->
                            <div class="team-item-content">
                                <h2><a href="#">${team.members.sivaselvan.name}</a></h2>
                                <p>${team.members.sivaselvan.role}</p>
                            </div>
                            <!-- Team Item Content End -->
                        </div>
                        <!-- Team Item Body End -->
                    </div>
                    <!-- Team Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Team Item Start -->
                    <div class="team-item wow fadeInUp" data-wow-delay="0.2s">
                        <!-- Team Item Image Start -->
                        <div class="team-item-image">
                            <a href="#" data-cursor-text="View">
                                <figure style="background:#f0f4f8; display:flex; align-items:center; justify-content:center; aspect-ratio:1/1; width:100%;">
                                    <div style="width:160px; height:160px; border-radius:50%; background:linear-gradient(135deg, #155e9b, #1e7dc0); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                                        <span style="font-size:70px; color:rgba(255,255,255,0.9);"><i class="fa-solid fa-user-doctor"></i></span>
                                    </div>
                                </figure>
                            </a>
                        </div>
                        <!-- Team Item Image End -->

                        <!-- Team Item Body Start -->
                        <div class="team-item-body">
                            <!-- Team Social List Box Start -->
                            <div class="team-social-list-box">
                                <div class="team-social-btn">
                                    <a href="#"><img src="/images/icon-share.svg" alt=""></a>
                                </div>
                                <div class="team-social-list">
                                    <ul>
                                        <li><a href="#"><i class="fa-brands fa-facebook-f"></i></a></li>
                                        <li><a href="#"><i class="fa-brands fa-x-twitter"></i></a></li>
                                        <li><a href="#"><i class="fa-brands fa-instagram"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Team Social List Box End -->

                            <!-- Team Item Content Start -->
                            <div class="team-item-content">
                                <h2><a href="#">${team.members.arulanandem.name}</a></h2>
                                <p>${team.members.arulanandem.role}</p>
                            </div>
                            <!-- Team Item Content End -->
                        </div>
                        <!-- Team Item Body End -->
                    </div>
                    <!-- Team Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Team Item Start -->
                    <div class="team-item wow fadeInUp" data-wow-delay="0.4s">
                        <!-- Team Item Image Start -->
                        <div class="team-item-image">
                            <a href="#" data-cursor-text="View">
                                <figure style="background:#f0f4f8; display:flex; align-items:center; justify-content:center; aspect-ratio:1/1; width:100%;">
                                    <div style="width:160px; height:160px; border-radius:50%; background:linear-gradient(135deg, #7b2d8b, #a040b8); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                                        <span style="font-size:70px; color:rgba(255,255,255,0.9);"><i class="fa-solid fa-user-nurse"></i></span>
                                    </div>
                                </figure>
                            </a>
                        </div>
                        <!-- Team Item Image End -->

                        <!-- Team Item Body Start -->
                        <div class="team-item-body">
                            <!-- Team Social List Box Start -->
                            <div class="team-social-list-box">
                                <div class="team-social-btn">
                                    <a href="#"><img src="/images/icon-share.svg" alt=""></a>
                                </div>
                                <div class="team-social-list">
                                    <ul>
                                        <li><a href="#"><i class="fa-brands fa-facebook-f"></i></a></li>
                                        <li><a href="#"><i class="fa-brands fa-x-twitter"></i></a></li>
                                        <li><a href="#"><i class="fa-brands fa-instagram"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Team Social List Box End -->

                            <!-- Team Item Content Start -->
                            <div class="team-item-content">
                                <h2><a href="#">${team.members.shobana.name}</a></h2>
                                <p>${team.members.shobana.role}</p>
                            </div>
                            <!-- Team Item Content End -->
                        </div>
                        <!-- Team Item Body End -->
                    </div>
                    <!-- Team Item End -->
                </div>

                <!-- Team Member 4: Dr. Sujikala -->
                <div class="col-xl-4 col-md-6">
                    <div class="team-item wow fadeInUp">
                        <div class="team-item-image">
                            <a href="#" data-cursor-text="View">
                                <figure style="background:#f0f4f8; display:flex; align-items:center; justify-content:center; aspect-ratio:1/1; width:100%;">
                                    <div style="width:160px; height:160px; border-radius:50%; background:linear-gradient(135deg, #1b6b3a, #27a259); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                                        <span style="font-size:70px; color:rgba(255,255,255,0.9);"><i class="fa-solid fa-user-nurse"></i></span>
                                    </div>
                                </figure>
                            </a>
                        </div>
                        <div class="team-item-body">
                            <div class="team-social-list-box">
                                <div class="team-social-btn"><a href="#"><img src="/images/icon-share.svg" alt=""></a></div>
                                <div class="team-social-list"><ul>
                                    <li><a href="#"><i class="fa-brands fa-facebook-f"></i></a></li>
                                    <li><a href="#"><i class="fa-brands fa-x-twitter"></i></a></li>
                                    <li><a href="#"><i class="fa-brands fa-instagram"></i></a></li>
                                </ul></div>
                            </div>
                            <div class="team-item-content">
                                <h2><a href="#">${team.members.sujikala.name}</a></h2>
                                <p>${team.members.sujikala.role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Team Member 5: Dr. Raj -->
                <div class="col-xl-4 col-md-6">
                    <div class="team-item wow fadeInUp" data-wow-delay="0.2s">
                        <div class="team-item-image">
                            <a href="#" data-cursor-text="View">
                                <figure style="background:#f0f4f8; display:flex; align-items:center; justify-content:center; aspect-ratio:1/1; width:100%;">
                                    <div style="width:160px; height:160px; border-radius:50%; background:linear-gradient(135deg, #8b4513, #c0622c); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                                        <span style="font-size:70px; color:rgba(255,255,255,0.9);"><i class="fa-solid fa-user-doctor"></i></span>
                                    </div>
                                </figure>
                            </a>
                        </div>
                        <div class="team-item-body">
                            <div class="team-social-list-box">
                                <div class="team-social-btn"><a href="#"><img src="/images/icon-share.svg" alt=""></a></div>
                                <div class="team-social-list"><ul>
                                    <li><a href="#"><i class="fa-brands fa-facebook-f"></i></a></li>
                                    <li><a href="#"><i class="fa-brands fa-x-twitter"></i></a></li>
                                    <li><a href="#"><i class="fa-brands fa-instagram"></i></a></li>
                                </ul></div>
                            </div>
                            <div class="team-item-content">
                                <h2><a href="#">${team.members.raj.name}</a></h2>
                                <p>${team.members.raj.role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Team Member 6: Dr. M. Murugamoorthy -->
                <div class="col-xl-4 col-md-6">
                    <div class="team-item wow fadeInUp" data-wow-delay="0.4s">
                        <div class="team-item-image">
                            <a href="#" data-cursor-text="View">
                                <figure style="background:#f0f4f8; display:flex; align-items:center; justify-content:center; aspect-ratio:1/1; width:100%;">
                                    <div style="width:160px; height:160px; border-radius:50%; background:linear-gradient(135deg, #1a237e, #283593); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                                        <span style="font-size:70px; color:rgba(255,255,255,0.9);"><i class="fa-solid fa-user-tie"></i></span>
                                    </div>
                                </figure>
                            </a>
                        </div>
                        <div class="team-item-body">
                            <div class="team-social-list-box">
                                <div class="team-social-btn"><a href="#"><img src="/images/icon-share.svg" alt=""></a></div>
                                <div class="team-social-list"><ul>
                                    <li><a href="#"><i class="fa-brands fa-facebook-f"></i></a></li>
                                    <li><a href="#"><i class="fa-brands fa-x-twitter"></i></a></li>
                                    <li><a href="#"><i class="fa-brands fa-instagram"></i></a></li>
                                </ul></div>
                            </div>
                            <div class="team-item-content">
                                <h2><a href="#">${team.members.murugamoorthy.name}</a></h2>
                                <p>${team.members.murugamoorthy.role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-12">
                    <!-- Section Footer Text Start -->
                    <div class="section-footer-text section-satisfy-img wow fadeInUp" data-wow-delay="0.6s">
                        <p>${team.footerText} - <a href="${p}/contact"> ${team.contactFooterLink}</a></p>
                    </div>
                    <!-- Section Footer Text End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Our Team Section End -->

    <!-- Our Support Section Start -->
    <div class="our-support">
        <div class="container">
            <div class="row section-row">
                <div class="col-lg-12">
                    <!-- Section Title Start -->
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">${es.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${es.heading}</h2>
                        <p class="wow fadeInUp" data-wow-delay="0.2s">${es.description}</p>
                    </div>
                    <!-- Section Title End -->
                </div>
            </div>

            <div class="row">
                <div class="col-lg-12">
                    <!-- Support Video Image Box Start -->
                    <div class="support-video-image-box wow fadeInUp" data-wow-delay="0.4s">
                        <!-- Support CTA Box Start -->
                        <div class="support-cta-box">
                            <!-- Support CTA Header Start -->
                            <div class="support-cta-header">
                                <div class="icon-box">
                                    <i class="fa-regular fa-clock"></i>
                                </div>
                                <div class="support-cta-title">
                                    <h3>${es.scheduleHeading}</h3>
                                </div>
                            </div>
                            <!-- Support CTA Header End -->

                            <!-- Support CTA Body Start -->
                            <div class="support-cta-body">
                                <!-- Support CTA List Start -->
                                <div class="support-cta-list">
                                    <ul>
                                        <li><span>${es.scheduleLabel}</span>${es.scheduleHours}</li>
                                    </ul>
                                </div>
                                <!-- Support CTA List End -->

                                <!-- Support CTA Button Start -->
                                <div class="support-cta-btn">
                                    <a href="${p}/contact" class="btn-default">${es.ctaButton}</a>
                                </div>
                                <!-- Support CTA Button End -->
                            </div>
                            <!-- Support CTA Body End -->
                        </div>
                        <!-- Support CTA Box End -->

                        <!-- Support Video Box Start -->
                        <div class="support-video-box">
                            <!-- Support Video Image Start -->
                            <div class="support-video-image">
                                <figure>
                                    <img src="/images/support-video-image.jpg" alt="">
                                </figure>
                            </div>
                            <!-- Support Video Image End -->

                            <!-- Video Play Button Start -->
                            <div class="video-play-button">
                                <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">
                                    <span class="bg-effect"><i class="fa-solid fa-play"></i></span>
                                </a>
                            </div>
                            <!-- Video Play Button End -->
                        </div>
                        <!-- Support Video Box End -->
                    </div>
                    <!-- Support Video Image Box End -->
                </div>

                <div class="col-lg-12">
                    <!-- Section Footer Text Start -->
                    <div class="section-footer-text wow fadeInUp" data-wow-delay="0.6s">
                        <p>${fs.servicesFooter}</p>
                        <ul>
                            <li class="section-footer-content">${trustedUsersText}</li>
                            <li>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                            </li>
                            <li><span class="counter">4.9</span>/5</li>
                        </ul>
                    </div>
                    <!-- Section Footer Text End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Our Support Section End -->

    <!-- Our Testimonial Section Start -->
    <div class="our-testimonial bg-section">
        <div class="container">
            <div class="row section-row">
                <div class="col-lg-12">
                    <!-- Section Title Start -->
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">${test.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${test.heading}</h2>
                        <p class="wow fadeInUp" data-wow-delay="0.2s">${test.description}</p>
                    </div>
                    <!-- Section Title End -->
                </div>
            </div>

            <div class="row">
                <div class="col-lg-12">
                    <!-- Testimonial Slider Start -->
                    <div class="testimonial-slider wow fadeInUp">
                        <div class="swiper">
                            <div class="swiper-wrapper" data-cursor-text="Drag">
                                <!-- Swiper Slide Start -->
                                <div class="swiper-slide">
                                    <!-- Testimonial Item Start -->
                                    <div class="testimonial-item">
                                        <div class="testimonial-item-header">
                                            <div class="testimonial-item-quote">
                                                <img src="/images/testimonial-quote.svg" alt="">
                                            </div>
                                            <div class="testimonial-item-content">
                                                <p>${test.items.testimonial1.quote}</p>
                                            </div>
                                        </div>
                                        <div class="testimonial-item-author">
                                            <div class="testimonial-author-image">
                                                <figure class="image-anime">
                                                    <img src="/images/author-1.jpg" alt="">
                                                </figure>
                                            </div>
                                            <div class="testimonial-author-content">
                                                <h2>${test.items.testimonial1.authorName}</h2>
                                                <p>${test.items.testimonial1.authorRole}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Testimonial Item End -->
                                </div>
                                <!-- Swiper Slide End -->

                                <!-- Swiper Slide Start -->
                                <div class="swiper-slide">
                                    <!-- Testimonial Item Start -->
                                    <div class="testimonial-item">
                                        <div class="testimonial-item-header">
                                            <div class="testimonial-item-quote">
                                                <img src="/images/testimonial-quote.svg" alt="">
                                            </div>
                                            <div class="testimonial-item-content">
                                                <p>${test.items.testimonial2.quote}</p>
                                            </div>
                                        </div>
                                        <div class="testimonial-item-author">
                                            <div class="testimonial-author-image">
                                                <figure class="image-anime">
                                                    <img src="/images/author-5.jpg" alt="">
                                                </figure>
                                            </div>
                                            <div class="testimonial-author-content">
                                                <h2>${test.items.testimonial2.authorName}</h2>
                                                <p>${test.items.testimonial2.authorRole}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Testimonial Item End -->
                                </div>
                                <!-- Swiper Slide End -->

                                <!-- Swiper Slide Start -->
                                <div class="swiper-slide">
                                    <!-- Testimonial Item Start -->
                                    <div class="testimonial-item">
                                        <div class="testimonial-item-header">
                                            <div class="testimonial-item-quote">
                                                <img src="/images/testimonial-quote.svg" alt="">
                                            </div>
                                            <div class="testimonial-item-content">
                                                <p>${test.items.testimonial3.quote}</p>
                                            </div>
                                        </div>
                                        <div class="testimonial-item-author">
                                            <div class="testimonial-author-image">
                                                <figure class="image-anime">
                                                    <img src="/images/author-3.jpg" alt="">
                                                </figure>
                                            </div>
                                            <div class="testimonial-author-content">
                                                <h2>${test.items.testimonial3.authorName}</h2>
                                                <p>${test.items.testimonial3.authorRole}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Testimonial Item End -->
                                </div>
                                <!-- Swiper Slide End -->

                                <!-- Swiper Slide Start -->
                                <div class="swiper-slide">
                                    <!-- Testimonial Item Start -->
                                    <div class="testimonial-item">
                                        <div class="testimonial-item-header">
                                            <div class="testimonial-item-quote">
                                                <img src="/images/testimonial-quote.svg" alt="">
                                            </div>
                                            <div class="testimonial-item-content">
                                                <p>${test.items.testimonial4.quote}</p>
                                            </div>
                                        </div>
                                        <div class="testimonial-item-author">
                                            <div class="testimonial-author-image">
                                                <figure class="image-anime">
                                                    <img src="/images/author-4.jpg" alt="">
                                                </figure>
                                            </div>
                                            <div class="testimonial-author-content">
                                                <h2>${test.items.testimonial4.authorName}</h2>
                                                <p>${test.items.testimonial4.authorRole}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Testimonial Item End -->
                                </div>
                                <!-- Swiper Slide End -->
                            </div>
                        </div>
                    </div>
                    <!-- Testimonial Slider End -->
                </div>

                <div class="col-lg-12">
                    <!-- Section Footer Text Start -->
                    <div class="section-footer-text section-satisfy-img wow fadeInUp" data-wow-delay="0.2s">
                        <!-- Satisfy Client Images Start -->
                        <div class="satisfy-client-images">
                            <div class="satisfy-client-image">
                                <figure class="image-anime">
                                    <img src="/images/author-1.jpg" alt="">
                                </figure>
                            </div>
                            <div class="satisfy-client-image add-more">
                                <img src="/images/icon-phone-white.svg" alt="">
                            </div>
                        </div>
                        <!-- Satisfy Client Images End -->    
                        <p>${test.footerText} - <a href="${p}/testimonials">${test.viewAllLink}</a></p>
                    </div>
                    <!-- Section Footer Text End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Our Testimonial Section End -->

    <!-- Our FAQs Section Start -->
    <div class="our-faqs">
        <div class="container">
            <div class="row">
                <div class="col-xl-5">
                    <!-- FAQ CTA Box Start -->
                    <div class="faq-cta-box">
                        <!-- FAQ CTA Image Start -->
                        <div class="faq-cta-image">
                            <figure class="image-anime reveal">
                                <img src="/images/faq-cta-image.jpg" alt="">
                            </figure>
                        </div>
                        <!-- FAQ CTA Image End -->

                        <!-- FAQ CTA Body Start -->
                        <div class="faq-cta-body">
                            <!-- FAQ CTA Content Start -->
                            <div class="faq-cta-content wow fadeInUp">
                                <h3>${fa.ctaHeading}</h3>
                                <p>${fa.ctaDescription}</p>
                            </div>
                            <!-- FAQ CTA Content End -->

                            <!-- FAQ CTA Button Start -->
                            <div class="faq-cta-btn wow fadeInUp" data-wow-delay="0.2s">
                                <a href="${p}/faqs" class="btn-default">${fa.ctaButton}</a>
                            </div>
                            <!-- FAQ CTA Button End -->
                        </div>
                        <!-- FAQ CTA Body End -->
                    </div>
                    <!-- FAQ CTA Box End -->
                </div>

                <div class="col-xl-7">
                    <!-- Section Title Start -->
                    <div class="section-title">
                        <span class="section-sub-title wow fadeInUp">${fa.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${fa.heading}</h2>
                    </div>
                    <!-- Section Title End -->

                    <!-- FAQ Accordion Start -->
                    <div class="faq-accordion" id="accordion">
                        <!-- FAQ Item Start -->
                        <div class="accordion-item wow fadeInUp">
                            <h2 class="accordion-header" id="heading1">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="false" aria-controls="collapse1">
                                    ${fa.items.q1.question}
                                </button>
                            </h2>
                            <div id="collapse1" class="accordion-collapse collapse" role="region" aria-labelledby="heading1" data-bs-parent="#accordion">
                                <div class="accordion-body">
                                    <p>${fa.items.q1.answer}</p>
                                </div>
                            </div>
                        </div>
                        <!-- FAQ Item End -->

                        <!-- FAQ Item Start -->
                        <div class="accordion-item wow fadeInUp" data-wow-delay="0.2s">
                            <h2 class="accordion-header" id="heading2">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                                    ${fa.items.q2.question}
                                </button>
                            </h2>
                            <div id="collapse2" class="accordion-collapse collapse" role="region" aria-labelledby="heading2" data-bs-parent="#accordion">
                                <div class="accordion-body">
                                    <p>${fa.items.q2.answer}</p>
                                </div>
                            </div>
                        </div>
                        <!-- FAQ Item End -->

                        <!-- FAQ Item Start -->
                        <div class="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                            <h2 class="accordion-header" id="heading3">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="true" aria-controls="collapse3">
                                    ${fa.items.q3.question}
                                </button>
                            </h2>
                            <div id="collapse3" class="accordion-collapse collapse show" role="region" aria-labelledby="heading3" data-bs-parent="#accordion">
                                <div class="accordion-body">
                                    <p>${fa.items.q3.answer}</p>
                                </div>
                            </div>
                        </div>
                        <!-- FAQ Item End -->

                        <!-- FAQ Item Start -->
                        <div class="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                            <h2 class="accordion-header" id="heading4">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
                                    ${fa.items.q4.question}
                                </button>
                            </h2>
                            <div id="collapse4" class="accordion-collapse collapse" role="region" aria-labelledby="heading4" data-bs-parent="#accordion">
                                <div class="accordion-body">
                                    <p>${fa.items.q4.answer}</p>
                                </div>
                            </div>
                        </div>
                        <!-- FAQ Item End -->

                        <!-- FAQ Item Start -->
                        <div class="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                            <h2 class="accordion-header" id="heading5">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
                                    ${fa.items.q5.question}
                                </button>
                            </h2>
                            <div id="collapse5" class="accordion-collapse collapse" role="region" aria-labelledby="heading5" data-bs-parent="#accordion">
                                <div class="accordion-body">
                                    <p>${fa.items.q5.answer}</p>
                                </div>
                            </div>
                        </div>
                        <!-- FAQ Item End -->
                    </div>
                    <!-- FAQ Accordion End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Our FAQs Section End -->`.replace(/\r\n/g, '\n')} />
  );
}
