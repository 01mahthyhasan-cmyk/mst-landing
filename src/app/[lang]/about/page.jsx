import HtmlContent from '../../../components/HtmlContent';
import { getDictionary } from '../../../lib/getDictionary';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.aboutPage.metaTitle,
    description: dict.aboutPage.metaDescription,
  };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.aboutPage;
  const tc = dict.common;
  const af = tc.appointmentForm;
  const fs = tc.factStatistics;
  const es = tc.emergencySupport;
  const cf = tc.coreFeatures;
  const fa = tc.faqSection;
  const exp = t.expertise;
  const team = dict.homePage.team;
  const test = dict.homePage.testimonials;
  const p = lang === 'en' ? '/en' : '';
  const trustedUsersText = fs.trustedUsers.replace('{{count}}', '58,900+');

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
                                <li class="breadcrumb-item"><a href="${p === '' ? '/' : p}">${t.breadcrumb.home}</a></li>
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

    <!-- About Us Section Start -->
    <div class="about-us">
        <div class="container">
            <div class="row">
                <div class="col-xl-6">
                    <!-- About Us Image Box Start -->
                    <div class="about-us-image-box wow fadeInUp">
                        <!-- About Image Title Start -->
                        <div class="about-image-title">
                            <h2>${t.hero.imageTitle}</h2>
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
                                    <p>${t.hero.reviewCount}</p>
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
                            <span class="section-sub-title wow fadeInUp">${t.hero.subTitle}</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">${t.hero.heading}</h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">${t.hero.description}</p>
                        </div>
                        <!-- Section Title End -->

                        <!-- About Us Item List Start -->
                        <div class="about-us-item-list wow fadeInUp" data-wow-delay="0.4s">
                            <!-- About Us Item Start -->
                            <div class="about-us-item">
                                <h3>${t.hero.mission.title}</h3>
                                <p>${t.hero.mission.description}</p>
                            </div>
                            <!-- About Us Item End -->

                            <!-- About Us Item Start -->
                            <div class="about-us-item">
                                <h3>${t.hero.vision.title}</h3>
                                <p>${t.hero.vision.description}</p>
                            </div>
                            <!-- About Us Item End -->
                        </div>
                        <!-- About Us Item List End -->

                        <!-- About Content Footer Start -->
                        <div class="about-content-footer wow fadeInUp" data-wow-delay="0.6s">
                            <!-- About Us Button Start -->
                            <div class="about-us-btn">
                                <a href="${p}/contact" class="btn-default">${t.hero.contactButton}</a>
                            </div>
                            <!-- About Us Button End -->

                            <!-- About Us Author Box Start -->
                            <div class="about-us-author-box">
                                <!-- About Author Image Start -->
                                <div class="about-us-author-image">
                                    <figure class="image-anime">
                                        <img src="/images/author-1.jpg" alt="MST Health Care">
                                    </figure>
                                </div>
                                <!-- About Author Image End -->

                                <!-- About Author Content Start -->
                                <div class="about-us-author-content">
                                    <h3>${t.hero.authorName}</h3>
                                    <p>${t.hero.authorTagline}</p>
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

    <!-- Our Approach Section Start -->
    <div class="our-approach bg-section">
        <div class="container">
            <div class="row section-row">
                <div class="col-lg-12">
                    <!-- Section Title Start -->
                    <div class="section-title section-title-center">
                        <span class="section-sub-title">${t.approach.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${t.approach.heading}</h2>
                    </div>
                    <!-- Section Title End -->
                </div>
            </div>

            <div class="row">
                <div class="col-xl-4 col-md-6">
                    <!-- Approach CTA Box Start -->
                    <div class="approach-cta-box wow fadeInUp">
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
                        
                        <div class="approach-cta-body">
                            <div class="approach-cta-content">
                                <p>${t.approach.ctaText}</p>
                            </div>
                            <div class="approach-cta-btn">
                                <a href="${p}/contact" class="btn-default">${t.approach.ctaButton}</a>
                            </div>
                        </div>
                    </div>
                    <!-- Approach CTA Box End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Approach Item Start -->
                    <div class="approach-item wow fadeInUp" data-wow-delay="0.2s">
                        <div class="icon-box">
                            <img src="/images/icon-approach-item-1.svg" alt="">
                        </div>
                        <div class="approach-item-content">
                            <h3>${t.approach.items.compassion.title}</h3>
                            <p>${t.approach.items.compassion.description}</p>
                        </div>
                    </div>
                    <!-- Approach Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Approach Item Start -->
                    <div class="approach-item wow fadeInUp" data-wow-delay="0.4s">
                        <div class="icon-box">
                            <img src="/images/icon-approach-item-2.svg" alt="">
                        </div>
                        <div class="approach-item-content">
                            <h3>${t.approach.items.integrity.title}</h3>
                            <p>${t.approach.items.integrity.description}</p>
                        </div>
                    </div>
                    <!-- Approach Item End -->
                </div>

                <div class="col-lg-12">
                    <!-- Section Footer Text Start -->
                    <div class="section-footer-text wow fadeInUp" data-wow-delay="0.4s">
                        <p>${fs.servicesFooter}</p>
                        <ul>
                            <li class="section-footer-content">${trustedUsersText}</li>
                            <li class="section-footer-rating">
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
    <!-- Our Approach Section End -->

    <!-- What We Do Start -->
    <div class="what-we-do">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-xl-6">
                    <!-- What We Content Start -->
                    <div class="what-we-content">
                        <!-- Section Title Start -->
                        <div class="section-title">
                            <span class="section-sub-title wow fadeInUp">${t.whatWeDo.subTitle}</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">${t.whatWeDo.heading}</h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">${t.whatWeDo.description}</p>
                        </div>
                        <!-- Section Title End -->

                        <!-- What We Content List Start -->
                        <div class="what-we-content-list wow fadeInUp" data-wow-delay="0.4s">
                            <ul>
                                <li>${t.whatWeDo.listItems.opdClinic}</li>
                                <li>${t.whatWeDo.listItems.ecgLab}</li>
                                <li>${t.whatWeDo.listItems.physiotherapy}</li>
                                <li>${t.whatWeDo.listItems.homeElder}</li>
                                <li>${t.whatWeDo.listItems.ambulance}</li>
                                <li>${t.whatWeDo.listItems.communityCamps}</li>
                            </ul>
                        </div>
                        <!-- What We Content List End -->

                        <!-- What We Footer Start -->
                        <div class="what-we-footer wow fadeInUp" data-wow-delay="0.6s">
                            <!-- What We Do Button Start -->
                            <div class="what-we-do-btn">
                                <a href="${p}/book-appointment" class="btn-default">${t.whatWeDo.bookButton}</a>
                            </div>
                            <!-- What We Do Button End -->

                            <!-- What We Contact Item Start -->
                            <div class="what-we-contact-item">
                                <div class="icon-box">
                                    <img src="/images/icon-headphone.svg" alt="">
                                </div>
                                <div class="what-we-contact-item-content">
                                    <p>${t.whatWeDo.emergencyCall}</p>
                                    <h3><a href="tel:${t.whatWeDo.emergencyPhone.replace(/\s+/g, '')}">${t.whatWeDo.emergencyPhone}</a></h3>
                                </div>
                            </div>
                            <!-- What We Contact Item End -->
                        </div>
                        <!-- What We Footer End -->
                    </div>
                    <!-- What We Content End -->
                </div>

                <div class="col-xl-6">
                    <!-- What We Image Box Start -->
                    <div class="what-we-image-box wow fadeInUp">
                        <!-- What We Image Box 1 Start -->
                        <div class="what-we-image-box-1">
                            <!-- What We Image End -->
                            <div class="what-we-image">
                                <figure class="image-anime">
                                    <img src="/images/what-we-do-image-1.jpg" alt="">
                                </figure>
                            </div>
                            <!-- What We Image End -->

                            <!-- What We Image Start -->
                            <div class="what-we-image">
                                <figure class="image-anime">
                                    <img src="/images/what-we-do-image-2.jpg" alt="">
                                </figure>
                            </div>
                            <!-- What We Image End -->
                        </div>
                        <!-- What We Image Box 1 End -->

                        <!-- What We Image Box 2 Start -->
                        <div class="what-we-image-box-2">
                            <!-- What We Image Start -->
                            <div class="what-we-image">
                                <figure>
                                    <img src="/images/what-we-do-image-3.jpg" alt="">
                                </figure>
                            </div>
                            <!-- What We Image End -->
                            
                            <!-- What We Image Counter Start -->
                            <div class="what-we-image-counter">
                                <h2><span class="counter">25</span>+</h2>
                                <p>${t.whatWeDo.yearsExperience}</p>
                            </div>
                            <!-- What We Image Counter End -->
                        </div>
                        <!-- What We Image Box 2 End -->
                    </div>
                    <!-- What We Image Box End -->
                </div>
            </div>
        </div> 
    </div>
    <!-- What We Do End -->

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

    <!-- Our Expertise Start -->
    <div class="our-expertise">
        <div class="container">
            <div class="row">
                <div class="col-xl-6">
                    <!-- Expertise Image Box Start -->
                    <div class="expertise-image-box wow fadeInUp">
                        <!-- Expertise Image Box 1 Start -->
                        <div class="expertise-image-box-1">
                            <div class="expertise-image">
                                <figure class="image-anime">
                                    <img src="/images/our-expertise-image-1.jpg" alt="">
                                </figure>
                            </div>
                        </div>
                        <!-- Expertise Image Box 1 End -->

                        <!-- Expertise Image Box 2 Start -->
                        <div class="expertise-image-box-2">
                            <div class="expertise-experience-circle">
                                <figure>
                                    <img src="/images/experience-circle-accent.svg" alt="">
                                </figure>
                            </div>
                            <div class="expertise-image">
                                <figure class="image-anime">
                                    <img src="/images/our-expertise-image-2.jpg" alt="">
                                </figure>
                            </div>
                        </div>
                        <!-- Expertise Image Box 2 End -->
                    </div>
                    <!-- Expertise Image Box End -->
                </div>

                <div class="col-xl-6">
                    <!-- Our Expertise Content start -->
                    <div class="our-expertise-content">
                        <!-- Section Title Start -->
                        <div class="section-title">
                            <span class="section-sub-title wow fadeInUp">${exp.subTitle}</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">${exp.heading}</h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">${exp.description}</p>
                        </div>
                        <!-- Section Title End -->

                        <!-- Expertise Item List Start -->
                        <div class="expertise-item-list">
                            <!-- Expertise Item Start -->
                            <div class="expertise-item">
                                <div class="circle" data-size="60" data-value="0.85">
                                    <div class="progress_value"><span class="pro_data"></span><span>%</span></div>
                                </div>
                                <div class="expertise-item-content">
                                    <h3>${exp.items.generalMedicine.title}</h3>
                                    <p>${exp.items.generalMedicine.description}</p>
                                </div>
                            </div>
                            <!-- Expertise Item End -->

                            <!-- Expertise Item Start -->
                            <div class="expertise-item">
                                <div class="circle" data-size="60" data-value="0.67">
                                    <div class="progress_value"><span class="pro_data"></span><span>%</span></div>
                                </div>
                                <div class="expertise-item-content">
                                    <h3>${exp.items.homeVisit.title}</h3>
                                    <p>${exp.items.homeVisit.description}</p>
                                </div>
                            </div>
                            <!-- Expertise Item End -->
                        </div>

                        <!-- Expertise Content Footer Start -->
                        <div class="expertise-content-footer wow fadeInUp" data-wow-delay="0.4s">
                            <!-- Expertise Content Button Start -->
                            <div class="expertise-content-btn">
                                <a href="${p}/book-appointment" class="btn-default">${t.whatWeDo.bookButton}</a>
                            </div>
                            <!-- Expertise Content Button End -->

                            <!-- What We Contact Item Start -->
                            <div class="what-we-contact-item">
                                <div class="icon-box">
                                    <img src="/images/icon-headphone.svg" alt="">
                                </div>
                                <div class="what-we-contact-item-content">
                                    <p>${exp.emergencyCall}</p>
                                    <h3><a href="tel:${exp.emergencyPhone.replace(/\s+/g, '')}">${exp.emergencyPhone}</a></h3>
                                </div>
                            </div>
                            <!-- What We Contact Item End -->
                        </div>
                        <!-- Expertise Content Footer End -->
                    </div>
                    <!-- Our Expertise Content End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Our Expertise Section End -->

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
    <!-- Our FAQs Section End -->

    <!-- Book Appointment Section Start -->
    <div class="book-appointment bg-section dark-section">
        <div class="container">
            <div class="row">
                <div class="col-xl-6">
                    <!-- Appointment Content Start -->
                    <div class="our-appointment-content">
                        <!-- Section Title Start -->
                        <div class="section-title">
                            <span class="section-sub-title wow fadeInUp">${af.sectionSubTitle}</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">${af.sectionHeading}</h2>
                        </div>
                        <!-- Section Title End -->

                        <!-- Google Map Start -->
                        <div class="google-map-iframe wow fadeInUp" data-wow-delay="0.2s">
                            <iframe src="https://maps.google.com/maps?q=MST+Healthcare,+Trinco+Road,+Batticaloa&amp;z=17&amp;hl=${lang}&amp;output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                        <!-- Google Map End -->
                    </div>
                    <!-- Appointment Content End -->
                </div>

                <div class="col-xl-6">
                    <!-- Appointment Form Start -->
                    <div class="appointment-form">
                        <!-- Section Title Start -->
                        <div class="section-title">
                            <h2 class="text-anime-style-3" data-cursor="-opaque">${af.heading}</h2>
                        </div>
                        <!-- Section Title End -->

                        <!-- Appointment Form Start -->
                        <form id="appointmentForm" action="#" method="POST" data-toggle="validator" class="wow fadeInUp" data-wow-delay="0.2s">
                            <div class="row">
                                <div class="form-group col-md-6 mb-4">
                                    <input type="text" name="name" class="form-control" id="name" placeholder="${af.fullNamePlaceholder}" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-6 mb-4">
                                    <input type="email" name ="email" class="form-control" id="email" placeholder="${af.emailPlaceholder}" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-6 mb-4">
                                    <input type="text" name="phone" class="form-control" id="phone" placeholder="${af.phoneNumberPlaceholder}" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-6 mb-4">
                                    <select name="service" class="form-control form-select" id="service" required>
                                        <option value="" disabled selected>${af.selectServicePlaceholder}</option>
                                        <option value="opd">${af.services.opd}</option>
                                        <option value="clinic_services">${af.services.clinicServices}</option>
                                        <option value="ecg">${af.services.ecg}</option>
                                        <option value="physiotherapy">${af.services.physiotherapy}</option>
                                        <option value="specialist_channelling">${af.services.specialistChannelling}</option>
                                        <option value="laboratory_services">${af.services.laboratoryServices}</option>
                                        <option value="nebulizer_services">${af.services.nebulizerServices}</option>
                                        <option value="elders_care">${af.services.elderscare}</option>
                                        <option value="home_visit">${af.services.homeVisit}</option>
                                        <option value="ambulance">${af.services.ambulance}</option>
                                    </select>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-12 mb-5">
                                    <textarea name="message" class="form-control" id="message" rows="5" placeholder="${af.messagePlaceholder}"></textarea>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="col-md-12">
                                    <button type="submit" class="btn-default">${af.submitButton}</button>
                                    <div id="msgSubmit" class="h3 hidden"></div>
                                </div>
                            </div>
                        </form>
                        <!-- Appointment Form End -->
                    </div>
                    <!-- Appointment Form End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Book Appointment Section End -->`.replace(/\r\n/g, '\n')} />
  );
}
