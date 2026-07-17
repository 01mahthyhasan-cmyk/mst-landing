import HtmlContent from '../../../components/HtmlContent';
import { getDictionary } from '../../../lib/getDictionary';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.servicesPage.metaTitle, description: dict.servicesPage.metaDescription };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.servicesPage;
  const tc = dict.common;
  const fs = tc.factStatistics;
  const wcu = dict.homePage.whyChooseUs;
  const exp = dict.aboutPage.expertise;
  const test = dict.homePage.testimonials;
  const fa = tc.faqSection;

  const serviceItems = [
    { key: 'opd', href: '/service-single?service=opd', icon: 'icon-service-item-1.svg' },
    { key: 'clinic', href: '/service-single?service=clinic', icon: 'icon-service-item-2.svg' },
    { key: 'ecg', href: '/service-single?service=ecg', icon: 'icon-service-item-3.svg' },
    { key: 'physiotherapy', href: '/service-single?service=physiotherapy', icon: 'icon-service-item-4.svg' },
    { key: 'specialist', href: '/service-single?service=specialist', icon: 'icon-service-item-5.svg' },
    { key: 'laboratory', href: '/service-single?service=laboratory', icon: 'icon-service-item-7.svg' },
    { key: 'nebulizer', href: '/service-single?service=nebulizer', icon: 'icon-service-item-6.svg' },
    { key: 'elders', href: '/service-single?service=elders', icon: 'icon-service-item-8.svg' },
    { key: 'homevisit', href: '/service-single?service=homevisit', icon: 'icon-service-item-1.svg' },
    { key: 'ambulance', href: '/service-single?service=ambulance', icon: 'icon-service-item-2.svg' },
  ];

  const testimonialItems = [
    { key: 'testimonial1', img: 'author-1.jpg' },
    { key: 'testimonial2', img: 'author-5.jpg' },
    { key: 'testimonial3', img: 'author-3.jpg' },
    { key: 'testimonial4', img: 'author-4.jpg' },
  ];

  const faqItems = [
    { key: 'q1', id: 1, expanded: false },
    { key: 'q2', id: 2, expanded: false },
    { key: 'q3', id: 3, expanded: true },
    { key: 'q4', id: 4, expanded: false },
    { key: 'q5', id: 5, expanded: false },
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

    <!-- Page Service Section Start -->
    <div class="page-service">
        <div class="container">
            <div class="row">
                ${serviceItems.map((s, i) => `
                <div class="col-xl-3 col-md-6">
                    <div class="service-item wow fadeInUp"${i > 0 ? ` data-wow-delay="${(i * 0.1).toFixed(1)}s"` : ''}>
                        <div class="icon-box">
                            <img src="/images/${s.icon}" alt="">
                        </div>
                        <div class="service-item-body">
                            <div class="service-item-content">
                                <h2><a href="${prefix}${s.href}">${t.items[s.key].title}</a></h2>
                                <p>${t.items[s.key].description}</p>
                            </div>
                            <div class="service-item-btn">
                                <a href="${prefix}${s.href}" class="readmore-btn">${t.items[s.key].viewDetails}</a>
                            </div>
                        </div>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </div>
    <!-- Page Service Section End -->

    <!-- Our Fact Section Start -->
    <div class="our-facts bg-section dark-section">
        <div class="container">
            <div class="row section-row">
                <div class="col-lg-12">
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">${fs.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${fs.heading}</h2>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xl-4 col-md-6">
                    <div class="fact-item wow fadeInUp">
                        <div class="fact-item-header">
                            <div class="fact-item-counter-content">
                                <h2><span class="counter">35</span>+</h2>
                                <ul><li>${fs.professionalTeam.label}</li></ul>
                            </div>
                            <div class="icon-box"><img src="/images/icon-fact-item-1.svg" alt=""></div>
                        </div>
                        <div class="fact-item-content"><p>${fs.professionalTeam.description}</p></div>
                    </div>
                </div>
                <div class="col-xl-4 col-md-6">
                    <div class="fact-item wow fadeInUp" data-wow-delay="0.2s">
                        <div class="fact-item-header">
                            <div class="fact-item-counter-content">
                                <h2><span class="counter">12</span>+</h2>
                                <ul><li>${fs.medicalDepartments.label}</li></ul>
                            </div>
                            <div class="icon-box"><img src="/images/icon-fact-item-2.svg" alt=""></div>
                        </div>
                        <div class="fact-item-content"><p>${fs.medicalDepartments.description}</p></div>
                    </div>
                </div>
                <div class="col-xl-4 col-md-6">
                    <div class="fact-item wow fadeInUp" data-wow-delay="0.4s">
                        <div class="fact-item-header">
                            <div class="fact-item-counter-content">
                                <h2><span class="counter">24</span>/7</h2>
                                <ul><li>${fs.emergencySupport.label}</li></ul>
                            </div>
                            <div class="icon-box"><img src="/images/icon-fact-item-3.svg" alt=""></div>
                        </div>
                        <div class="fact-item-content"><p>${fs.emergencySupport.description}</p></div>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="section-footer-text wow fadeInUp" data-wow-delay="0.4s">
                        <p>${fs.servicesFooter}</p>
                        <ul>
                            <li class="section-footer-content">${fs.trustedUsers.replace('{{count}}', '58,900+')}</li>
                            <li><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></li>
                            <li><span class="counter">4.9</span>/5</li>
                        </ul>
                    </div>
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
                    <div class="why-choose-us-content">
                        <div class="section-title">
                            <span class="section-sub-title wow fadeInUp">${wcu.subTitle}</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">${wcu.heading}</h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">${wcu.description}</p>
                        </div>
                        <div class="why-choose-us-body">
                            <div class="why-choose-counter-box wow fadeInUp" data-wow-delay="0.4s">
                                <div class="why-choose-counter-item-list">
                                    <div class="why-choose-counter-item">
                                        <h2><span class="counter">25</span>+</h2>
                                        <p>${wcu.yearsExperience}</p>
                                    </div>
                                    <div class="why-choose-counter-item">
                                        <h2><span class="counter">24</span>/7</h2>
                                        <p>${wcu.emergencySupport}</p>
                                    </div>
                                </div>
                                <div class="why-choose-counter-image">
                                    <figure class="image-anime"><img src="/images/why-choose-counter-image.jpg" alt=""></figure>
                                </div>
                            </div>
                            <div class="why-choose-body-image">
                                <figure class="image-anime reveal"><img src="/images/why-choose-body-image.jpg" alt=""></figure>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6">
                    <div class="why-choose-us-image-box wow fadeInUp">
                        <div class="years-experience-circle">
                            <figure><img src="/images/years-experience-circle-white.svg" alt=""></figure>
                        </div>
                        <div class="why-choose-us-image">
                            <figure><img src="/images/why-choose-us-image.png" alt=""></figure>
                        </div>
                        <div class="why-choose-cta-box">
                            <div class="icon-box"><img src="/images/icon-why-choose-cta-box.svg" alt=""></div>
                            <div class="why-choose-cta-content">
                                <h2><span class="counter">12</span>+</h2>
                                <p>${wcu.medicalDepartments}</p>
                            </div>
                        </div>
                    </div>
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
                    <div class="section-title section-title-center">
                        <span class="section-sub-title">${t.approach.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${t.approach.heading}</h2>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xl-4 col-md-6">
                    <div class="approach-cta-box wow fadeInUp">
                        <div class="hero-client-box">
                            <div class="satisfy-client-images">
                                <div class="satisfy-client-image"><figure class="image-anime"><img src="/images/author-1.jpg" alt=""></figure></div>
                                <div class="satisfy-client-image"><figure class="image-anime"><img src="/images/author-2.jpg" alt=""></figure></div>
                                <div class="satisfy-client-image"><figure class="image-anime"><img src="/images/author-3.jpg" alt=""></figure></div>
                            </div>
                            <div class="hero-client-content">
                                <h2><span class="counter">4.9</span>/5<i class="fa fa-solid fa-star"></i></h2>
                                <p>${t.approach.reviewBadge}</p>
                            </div>
                        </div>
                        <div class="approach-cta-body">
                            <div class="approach-cta-content"><p>${t.approach.ctaText}</p></div>
                            <div class="approach-cta-btn">
                                <a href="${prefix}/contact" class="btn-default">${t.approach.ctaButton}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-md-6">
                    <div class="approach-item wow fadeInUp" data-wow-delay="0.2s">
                        <div class="icon-box"><img src="/images/icon-approach-item-1.svg" alt=""></div>
                        <div class="approach-item-content">
                            <h3>${t.approach.item1Title}</h3>
                            <p>${t.approach.item1Desc}</p>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-md-6">
                    <div class="approach-item wow fadeInUp" data-wow-delay="0.4s">
                        <div class="icon-box"><img src="/images/icon-approach-item-2.svg" alt=""></div>
                        <div class="approach-item-content">
                            <h3>${t.approach.item2Title}</h3>
                            <p>${t.approach.item2Desc}</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="section-footer-text wow fadeInUp" data-wow-delay="0.4s">
                        <p>${fs.servicesFooter}</p>
                        <ul>
                            <li class="section-footer-content">${fs.trustedUsers.replace('{{count}}', '58,900+')}</li>
                            <li class="section-footer-rating"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></li>
                            <li><span class="counter">4.9</span>/5</li>
                        </ul>
                    </div>
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
                    <div class="expertise-image-box wow fadeInUp">
                        <div class="expertise-image-box-1">
                            <div class="expertise-image"><figure class="image-anime"><img src="/images/our-expertise-image-1.jpg" alt=""></figure></div>
                        </div>
                        <div class="expertise-image-box-2">
                            <div class="expertise-experience-circle"><figure><img src="/images/experience-circle-accent.svg" alt=""></figure></div>
                            <div class="expertise-image"><figure class="image-anime"><img src="/images/our-expertise-image-2.jpg" alt=""></figure></div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6">
                    <div class="our-expertise-content">
                        <div class="section-title">
                            <span class="section-sub-title wow fadeInUp">${exp.subTitle}</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">${exp.heading}</h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">${exp.description}</p>
                        </div>
                        <div class="expertise-item-list">
                            <div class="expertise-item">
                                <div class="circle" data-size="60" data-value="0.85">
                                    <div class="progress_value"><span class="pro_data"></span><span>%</span></div>
                                </div>
                                <div class="expertise-item-content">
                                    <h3>${exp.items.generalMedicine.title}</h3>
                                    <p>${exp.items.generalMedicine.description}</p>
                                </div>
                            </div>
                            <div class="expertise-item">
                                <div class="circle" data-size="60" data-value="0.67">
                                    <div class="progress_value"><span class="pro_data"></span><span>%</span></div>
                                </div>
                                <div class="expertise-item-content">
                                    <h3>${exp.items.homeVisit.title}</h3>
                                    <p>${exp.items.homeVisit.description}</p>
                                </div>
                            </div>
                        </div>
                        <div class="expertise-content-footer wow fadeInUp" data-wow-delay="0.4s">
                            <div class="expertise-content-btn">
                                <a href="${prefix}/book-appointment" class="btn-default">${dict.aboutPage.whatWeDo.bookButton}</a>
                            </div>
                            <div class="what-we-contact-item">
                                <div class="icon-box"><img src="/images/icon-headphone.svg" alt=""></div>
                                <div class="what-we-contact-item-content">
                                    <p>${exp.emergencyCall}</p>
                                    <h3><a href="tel:${exp.emergencyPhone}">${exp.emergencyPhone}</a></h3>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">${test.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${test.heading}</h2>
                        <p class="wow fadeInUp" data-wow-delay="0.2s">${test.description}</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="testimonial-slider wow fadeInUp">
                        <div class="swiper">
                            <div class="swiper-wrapper" data-cursor-text="Drag">
                                ${testimonialItems.map(item => `
                                <div class="swiper-slide">
                                    <div class="testimonial-item">
                                        <div class="testimonial-item-header">
                                            <div class="testimonial-item-quote"><img src="/images/testimonial-quote.svg" alt=""></div>
                                            <div class="testimonial-item-content"><p>${test.items[item.key].quote}</p></div>
                                        </div>
                                        <div class="testimonial-item-author">
                                            <div class="testimonial-author-image"><figure class="image-anime"><img src="/images/${item.img}" alt=""></figure></div>
                                            <div class="testimonial-author-content">
                                                <h2>${test.items[item.key].authorName}</h2>
                                                <p>${test.items[item.key].authorRole}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="section-footer-text section-satisfy-img wow fadeInUp" data-wow-delay="0.2s">
                        <div class="satisfy-client-images">
                            <div class="satisfy-client-image"><figure class="image-anime"><img src="/images/author-1.jpg" alt=""></figure></div>
                            <div class="satisfy-client-image add-more"><img src="/images/icon-phone-white.svg" alt=""></div>
                        </div>
                        <p>${test.footerText} -<a href="${prefix}/testimonials">${test.viewAllLink}</a></p>
                    </div>
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
                    <div class="faq-cta-box">
                        <div class="faq-cta-image"><figure class="image-anime reveal"><img src="/images/faq-cta-image.jpg" alt=""></figure></div>
                        <div class="faq-cta-body">
                            <div class="faq-cta-content wow fadeInUp">
                                <h3>${fa.ctaHeading}</h3>
                                <p>${fa.ctaDescription}</p>
                            </div>
                            <div class="faq-cta-btn wow fadeInUp" data-wow-delay="0.2s">
                                <a href="${prefix}/faqs" class="btn-default">${fa.ctaButton}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-7">
                    <div class="section-title">
                        <span class="section-sub-title wow fadeInUp">${fa.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${fa.heading}</h2>
                    </div>
                    <div class="faq-accordion" id="accordion">
                        ${faqItems.map(item => `
                        <div class="accordion-item wow fadeInUp"${item.id > 1 ? ` data-wow-delay="${((item.id - 1) * 0.2).toFixed(1)}s"` : ''}>
                            <h2 class="accordion-header" id="heading${item.id}">
                                <button class="accordion-button${item.expanded ? '' : ' collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${item.id}" aria-expanded="${item.expanded}" aria-controls="collapse${item.id}">
                                    ${fa.items[item.key].question}
                                </button>
                            </h2>
                            <div id="collapse${item.id}" class="accordion-collapse collapse${item.expanded ? ' show' : ''}" role="region" aria-labelledby="heading${item.id}" data-bs-parent="#accordion">
                                <div class="accordion-body"><p>${fa.items[item.key].answer}</p></div>
                            </div>
                        </div>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Our FAQs Section End -->`} />
  );
}
