import HtmlContent from '../../../components/HtmlContent';
import { getDictionary } from '../../../lib/getDictionary';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.pricingPage.metaTitle };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.pricingPage;
  const cf = dict.common.factStatistics;
  const home = lang === 'ta' ? '/' : '/en';
  const contactLink = lang === 'ta' ? '/contact' : '/en/contact';

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
                                <li class="breadcrumb-item"><a href="${home}">${t.breadcrumb.home}</a></li>
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

    <!-- Page Service Section Start -->
    <div class="page-pricing">
        <div class="container">
            <div class="row">
                <div class="col-xl-4 col-md-6">
                    <!-- Pricing Item Start -->
                    <div class="pricing-item wow fadeInUp">
                        <!-- Pricing Item Header Start -->
                        <div class="pricing-item-header">
                            <div class="icon-box">
                                <img src="/images/icon-pricing-item-1.svg" alt="">
                            </div>
                            <div class="pricing-item-content">
                                <h2>${t.plans.basic.name}</h2>
                                <p>${t.plans.basic.desc}</p>
                            </div>
                            <div class="pricing-item-price">
                                <h2>${t.plans.basic.price}<sub>${t.perMonth}</sub></h2>
                            </div>   
                        </div>
                        <!-- Pricing Item Header End -->
                            
                        <!-- Pricing Item Body Start -->
                        <div class="pricing-item-body">
                            <div class="pricing-item-list">
                                <ul>
                                    ${t.plans.basic.features.map(f => `<li>${f}</li>`).join('\n                                    ')}
                                </ul>
                            </div>
                            <div class="pricing-item-btn">
                                <a href="${contactLink}" class="btn-default">${t.choosePlan}</a>
                            </div>
                        </div>
                        <!-- Pricing Item Body End -->
                    </div>
                    <!-- Pricing Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Pricing Item Start -->
                    <div class="pricing-item wow fadeInUp">
                        <!-- Pricing Item Header Start -->
                        <div class="pricing-item-header">
                            <div class="icon-box">
                                <img src="/images/icon-pricing-item-2.svg" alt="">
                            </div>
                            <div class="pricing-item-content">
                                <h2>${t.plans.advanced.name}</h2>
                                <p>${t.plans.advanced.desc}</p>
                            </div>
                            <div class="pricing-item-price">
                                <h2>${t.plans.advanced.price}<sub>${t.perMonth}</sub></h2>
                            </div>   
                        </div>
                        <!-- Pricing Item Header End -->
                            
                        <!-- Pricing Item Body Start -->
                        <div class="pricing-item-body">
                            <div class="pricing-item-list">
                                <ul>
                                    ${t.plans.advanced.features.map(f => `<li>${f}</li>`).join('\n                                    ')}
                                </ul>
                            </div>
                            <div class="pricing-item-btn">
                                <a href="${contactLink}" class="btn-default">${t.choosePlan}</a>
                            </div>
                        </div>
                        <!-- Pricing Item Body End -->
                    </div>
                    <!-- Pricing Item End -->
                </div>

                <div class="col-xl-4 col-md-6">
                    <!-- Pricing Item Start -->
                    <div class="pricing-item wow fadeInUp">
                        <!-- Pricing Item Header Start -->
                        <div class="pricing-item-header">
                            <div class="icon-box">
                                <img src="/images/icon-pricing-item-3.svg" alt="">
                            </div>
                            <div class="pricing-item-content">
                                <h2>${t.plans.premium.name}</h2>
                                <p>${t.plans.premium.desc}</p>
                            </div>
                            <div class="pricing-item-price">
                                <h2>${t.plans.premium.price}<sub>${t.perMonth}</sub></h2>
                            </div>   
                        </div>
                        <!-- Pricing Item Header End -->
                            
                        <!-- Pricing Item Body Start -->
                        <div class="pricing-item-body">
                            <div class="pricing-item-list">
                                <ul>
                                    ${t.plans.premium.features.map(f => `<li>${f}</li>`).join('\n                                    ')}
                                </ul>
                            </div>
                            <div class="pricing-item-btn">
                                <a href="${contactLink}" class="btn-default">${t.choosePlan}</a>
                            </div>
                        </div>
                        <!-- Pricing Item Body End -->
                    </div>
                    <!-- Pricing Item End -->
                </div>

                <div class="col-lg-12">
                    <!-- Pricing Benifit List Start -->
                    <div class="pricing-benefit-list wow fadeInUp" data-wow-delay="0.6s">
                        <ul>
                            <li><img src="/images/icon-pricing-benefit-1.svg" alt="">${t.benefitItems.trial}</li>
                            <li><img src="/images/icon-pricing-benefit-2.svg" alt="">${t.benefitItems.noHiddenFee}</li>
                            <li><img src="/images/icon-pricing-benefit-3.svg" alt="">${t.benefitItems.cancel}</li>
                        </ul>
                    </div>
                    <!-- Pricing Benifit List End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Page Service Section End -->

    <!-- Our Fact Section Start -->
    <div class="our-facts bg-section dark-section">
        <div class="container">
            <div class="row section-row">
                <div class="col-lg-12">
                    <!-- Section Title Start -->
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">Fact / Statistics</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">Key statistics that reflect our medical excellence</h2>
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
                                    <li>Professional Healthcare Team</li>
                                </ul>
                            </div>
                            <div class="icon-box">
                                <img src="/images/icon-fact-item-1.svg" alt="">
                            </div>
                        </div>
                        <div class="fact-item-content">
                            <p>Our team of experienced doctor dedicated to providing expert medical care with.</p>
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
                                    <li>Medical Departments</li>
                                </ul>
                            </div>
                            <div class="icon-box">
                                <img src="/images/icon-fact-item-2.svg" alt="">
                            </div>
                        </div>
                        <div class="fact-item-content">
                            <p>Our team of experienced doctor dedicated to providing expert medical care with.</p>
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
                                    <li>Emergency Support</li>
                                </ul>
                            </div>
                            <div class="icon-box">
                                <img src="/images/icon-fact-item-3.svg" alt="">
                            </div>
                        </div>
                        <div class="fact-item-content">
                            <p>Our team of experienced doctor dedicated to providing expert medical care with.</p>
                        </div>
                    </div>
                    <!-- Fact Item End -->
                </div>

                <div class="col-lg-12">
                    <!-- Section Footer Text Start -->
                    <div class="section-footer-text wow fadeInUp" data-wow-delay="0.4s">
                        <p>Browse all professional healthcare services available for you and family</p>
                        <ul>
                            <li class="section-footer-content">Trusted By <b>58,900+</b> Users</li>
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

    <!-- Why Choose Us Section Start -->
    <div class="why-choose-us">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-xl-6">
                    <!-- Why Choose Us Content Start -->
                    <div class="why-choose-us-content">
                        <!-- Section Title Start -->
                        <div class="section-title">
                            <span class="section-sub-title wow fadeInUp">Why Choose Us</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">Why choose us for quality healthcare services</h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">Our experienced medical team focuses on accurate diagnosis, effective treatment, and personalized care to ensure the best outcomes for every patient.</p>
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
                                        <p>Years Experience</p>
                                    </div>
                                    <!-- Why choose Counter Item End -->

                                    <!-- Why choose Counter Item Start -->
                                    <div class="why-choose-counter-item">
                                        <h2><span class="counter">24</span>/7</h2>
                                        <p>Emergency Support</p>
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
                                <p>Medical Departments</p>
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

    <!-- Our Approach Section Start -->
    <div class="our-approach bg-section">
        <div class="container">
            <div class="row section-row">
                <div class="col-lg-12">
                    <!-- Section Title Start -->
                    <div class="section-title section-title-center">
                        <span class="section-sub-title">Our Approach</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">Our patient first approach to quality healthcare</h2>
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
                                <p>More Than 2500 Reviews</p>
                            </div>
                            <!-- Hero Client Content End -->
                        </div>
                        <!-- Hero Client Box End -->
                        
                        <div class="approach-cta-body">
                            <div class="approach-cta-content">
                                <p>We prioritize comfort, trust, and treatment to ensure the best possible health outcomes for every patient.</p>
                            </div>
                            <div class="approach-cta-btn">
                                <a href="/contact" class="btn-default">24/7 Services for Emergancy</a>
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
                            <h3>Your Health Our Priority</h3>
                            <p>Your health is at the heart of everything we do. We are committed to high-quality care tailored to your journey.</p>
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
                            <h3>Vision For Better Healthcare</h3>
                            <p>Your health is at the heart of everything we do. We are committed to high-quality care tailored to your journey.</p>
                        </div>
                    </div>
                    <!-- Approach Item End -->
                </div>

                <div class="col-lg-12">
                    <!-- Section Footer Text Start -->
                    <div class="section-footer-text wow fadeInUp" data-wow-delay="0.4s">
                        <p>Browse all professional healthcare services available for you and family</p>
                        <ul>
                            <li class="section-footer-content">Trusted By <b>58,900+</b> Users</li>
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
                            <span class="section-sub-title wow fadeInUp">Medical Expertise</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">Experience and expertise you can trust always</h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">With years of hands-on experience and deep medical expertise, we provide care you can trust at every step our skilled professionals are committed.</p>
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
                                    <h3>General Medicine And Primary Care</h3>
                                    <p>Our General Medicine and Primary Care services focus on patients.</p>
                                </div>
                            </div>
                            <!-- Expertise Item End -->

                            <!-- Expertise Item Start -->
                            <div class="expertise-item">
                                <div class="circle" data-size="60" data-value="0.67">
                                    <div class="progress_value"><span class="pro_data"></span><span>%</span></div>
                                </div>
                                <div class="expertise-item-content">
                                    <h3>Home Visit Services And Bone Treatments</h3>
                                    <p>Our General Medicine and Primary Care services focus on patients.</p>
                                </div>
                            </div>
                            <!-- Expertise Item End -->
                        </div>

                        <!-- Expertise Content Footer Start -->
                        <div class="expertise-content-footer wow fadeInUp" data-wow-delay="0.4s">
                            <!-- Expertise Content Button Start -->
                            <div class="expertise-content-btn">
                                <a href="/book-appointment" class="btn-default">Book Appointment</a>
                            </div>
                            <!-- Expertise Content Button End -->

                            <!-- What We Contact Item Start -->
                            <div class="what-we-contact-item">
                                <div class="icon-box">
                                    <img src="/images/icon-headphone.svg" alt="">
                                </div>
                                <div class="what-we-contact-item-content">
                                    <p>Emergency Call</p>
                                    <h3><a href="tel:065 205 4997">065 205 4997</a></h3>
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

    <!-- Our Testimonial Section Start -->
    <div class="our-testimonial bg-section">
        <div class="container">
            <div class="row section-row">
                <div class="col-lg-12">
                    <!-- Section Title Start -->
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">Patients Testimonials</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">What our patients are saying</h2>
                        <p class="wow fadeInUp" data-wow-delay="0.2s">Hear from our patients about their experiences with our dedicated medical team and quality healthcare services their feedback reflects our commitment.</p>
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
                                                <p>“The doctors and staff were incredibly supportive throughout my treatment. Their expertise and care helped me recover expected.”</p>
                                            </div>
                                        </div>
                                        <div class="testimonial-item-author">
                                            <div class="testimonial-author-image">
                                                <figure class="image-anime">
                                                    <img src="/images/author-1.jpg" alt="">
                                                </figure>
                                            </div>
                                            <div class="testimonial-author-content">
                                                <h2>John Peterson</h2>
                                                <p>Internal Medicine Specialist</p>
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
                                                <p>“The doctors and staff were incredibly supportive throughout my treatment. Their expertise and care helped me recover expected.”</p>
                                            </div>
                                        </div>
                                        <div class="testimonial-item-author">
                                            <div class="testimonial-author-image">
                                                <figure class="image-anime">
                                                    <img src="/images/author-5.jpg" alt="">
                                                </figure>
                                            </div>
                                            <div class="testimonial-author-content">
                                                <h2>Maria Gonzalez</h2>
                                                <p>Internal Medicine Specialist</p>
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
                                                <p>“The doctors and staff were incredibly supportive throughout my treatment. Their expertise and care helped me recover expected.”</p>
                                            </div>
                                        </div>
                                        <div class="testimonial-item-author">
                                            <div class="testimonial-author-image">
                                                <figure class="image-anime">
                                                    <img src="/images/author-3.jpg" alt="">
                                                </figure>
                                            </div>
                                            <div class="testimonial-author-content">
                                                <h2>David Robinson</h2>
                                                <p>Internal Medicine Specialist</p>
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
                                                <p>“The doctors and staff were incredibly supportive throughout my treatment. Their expertise and care helped me recover expected.”</p>
                                            </div>
                                        </div>
                                        <div class="testimonial-item-author">
                                            <div class="testimonial-author-image">
                                                <figure class="image-anime">
                                                    <img src="/images/author-4.jpg" alt="">
                                                </figure>
                                            </div>
                                            <div class="testimonial-author-content">
                                                <h2>Savannah Nguyen</h2>
                                                <p>Internal Medicine Specialist</p>
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
                        <p>Helping You Move from Concern to Confidence with Expert Medical Care. -<a href="/testimonials">View our All reviews</a></p>
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
                                <h3>Have a any Questions !</h3>
                                <p>If you have any questions about our medical services, appointments, or treatments, our team is here to help. We are committed to providing clear information and friendly support to ensure you receive the care and guidance you need.</p>
                            </div>
                            <!-- FAQ CTA Content End -->

                            <!-- FAQ CTA Button Start -->
                            <div class="faq-cta-btn wow fadeInUp" data-wow-delay="0.2s">
                                <a href="/faqs" class="btn-default">View all Questions</a>
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
                        <span class="section-sub-title wow fadeInUp">Frequently Asked Questions</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">Your questions answered about our medical services</h2>
                    </div>
                    <!-- Section Title End -->

                    <!-- FAQ Accordion Start -->
                    <div class="faq-accordion" id="accordion">
                        <!-- FAQ Item Start -->
                        <div class="accordion-item wow fadeInUp">
                            <h2 class="accordion-header" id="heading1">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="false" aria-controls="collapse1">
                                    1. How can I book an appointment with a doctor?
                                </button>
                            </h2>
                            <div id="collapse1" class="accordion-collapse collapse" role="region" aria-labelledby="heading1" data-bs-parent="#accordion">
                                <div class="accordion-body">
                                    <p>We provide a wide range of services including general checkups, cardiology, pediatrics, orthopedics, dermatology, and diagnostic tests.</p>
                                </div>
                            </div>
                        </div>
                        <!-- FAQ Item End -->

                        <!-- FAQ Item Start -->
                        <div class="accordion-item wow fadeInUp" data-wow-delay="0.2s">
                            <h2 class="accordion-header" id="heading2">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                                    2. Do you provide emergency medical services?
                                </button>
                            </h2>
                            <div id="collapse2" class="accordion-collapse collapse" role="region" aria-labelledby="heading2" data-bs-parent="#accordion">
                                <div class="accordion-body">
                                    <p>We provide a wide range of services including general checkups, cardiology, pediatrics, orthopedics, dermatology, and diagnostic tests.</p>
                                </div>
                            </div>
                        </div>
                        <!-- FAQ Item End -->

                        <!-- FAQ Item Start -->
                        <div class="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                            <h2 class="accordion-header" id="heading3">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="true" aria-controls="collapse3">
                                    3. What medical services do you provide?
                                </button>
                            </h2>
                            <div id="collapse3" class="accordion-collapse collapse show" role="region" aria-labelledby="heading3" data-bs-parent="#accordion">
                                <div class="accordion-body">
                                    <p>We provide a wide range of services including general checkups, cardiology, pediatrics, orthopedics, dermatology, and diagnostic tests.</p>
                                </div>
                            </div>
                        </div>
                        <!-- FAQ Item End -->

                        <!-- FAQ Item Start -->
                        <div class="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                            <h2 class="accordion-header" id="heading4">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
                                    4. How early should I arrive for my appointment?
                                </button>
                            </h2>
                            <div id="collapse4" class="accordion-collapse collapse" role="region" aria-labelledby="heading4" data-bs-parent="#accordion">
                                <div class="accordion-body">
                                    <p>We provide a wide range of services including general checkups, cardiology, pediatrics, orthopedics, dermatology, and diagnostic tests.</p>
                                </div>
                            </div>
                        </div>
                        <!-- FAQ Item End -->

                        <!-- FAQ Item Start -->
                        <div class="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                            <h2 class="accordion-header" id="heading5">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
                                    5. What should I bring to my medical appointment?
                                </button>
                            </h2>
                            <div id="collapse5" class="accordion-collapse collapse" role="region" aria-labelledby="heading5" data-bs-parent="#accordion">
                                <div class="accordion-body">
                                    <p>We provide a wide range of services including general checkups, cardiology, pediatrics, orthopedics, dermatology, and diagnostic tests.</p>
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
