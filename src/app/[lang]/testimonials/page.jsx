import HtmlContent from '../../../components/HtmlContent';
import { getDictionary } from '../../../lib/getDictionary';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.testimonialsPage.metaTitle, description: dict.testimonialsPage.metaDescription };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.testimonialsPage;
  const tc = dict.common;
  const fs = tc.factStatistics;
  const es = tc.emergencySupport;
  const cf = tc.coreFeatures;
  const fa = tc.faqSection;

  const testimonialImages = ['author-1.jpg', 'author-2.jpg', 'author-3.jpg', 'author-4.jpg', 'author-5.jpg', 'author-6.jpg'];
  const testimonialKeys = ['t1', 't2', 't3', 't4', 't5', 't6'];
  const delays = ['', '0.2s', '0.4s', '0.6s', '0.8s', '1s'];

  const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5'];
  const prefix = lang === 'en' ? '/en' : '';

  const coreFeaturesItems = [
    { key: 'qualityTreatment', icon: 'icon-core-features-item-1.svg' },
    { key: 'personalizedCare', icon: 'icon-core-features-item-2.svg' },
    { key: 'modernFacilities', icon: 'icon-core-features-item-3.svg' },
    { key: 'emergencySupport', icon: 'icon-core-features-item-4.svg' },
    { key: 'fastAccurate', icon: 'icon-core-features-item-5.svg' },
    { key: 'safeEnvironment', icon: 'icon-core-features-item-6.svg' },
    { key: 'experiencedProfessionals', icon: 'icon-core-features-item-7.svg' },
    { key: 'advancedDiagnostic', icon: 'icon-core-features-item-8.svg' },
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

    <!-- Page Testimonials Start -->
    <div class="page-testimonials">
        <div class="container">
            <div class="row">
                ${testimonialKeys.map((key, i) => `
                <div class="col-xl-4 col-md-6">
                    <div class="testimonial-item wow fadeInUp"${delays[i] ? ` data-wow-delay="${delays[i]}"` : ''}>
                        <div class="testimonial-item-header">
                            <div class="testimonial-item-quote"><img src="/images/testimonial-quote.svg" alt=""></div>
                            <div class="testimonial-item-content"><p>${t.items[key].quote}</p></div>
                        </div>
                        <div class="testimonial-item-author">
                            <div class="testimonial-author-image">
                                <figure class="image-anime"><img src="/images/${testimonialImages[i]}" alt="${t.items[key].name}"></figure>
                            </div>
                            <div class="testimonial-author-content">
                                <h2>${t.items[key].name}</h2>
                                <p>${t.items[key].role}</p>
                            </div>
                        </div>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </div>
    <!-- Page Testimonials End -->

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

    <!-- Our Support Section Start -->
    <div class="our-support">
        <div class="container">
            <div class="row section-row">
                <div class="col-lg-12">
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">${es.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${es.heading}</h2>
                        <p class="wow fadeInUp" data-wow-delay="0.2s">${es.description}</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="support-video-image-box wow fadeInUp" data-wow-delay="0.4s">
                        <div class="support-cta-box">
                            <div class="support-cta-header">
                                <div class="icon-box"><i class="fa-regular fa-clock"></i></div>
                                <div class="support-cta-title"><h3>${es.scheduleHeading}</h3></div>
                            </div>
                            <div class="support-cta-body">
                                <div class="support-cta-list">
                                    <ul><li><span>${es.scheduleLabel}</span>${es.scheduleHours}</li></ul>
                                </div>
                                <div class="support-cta-btn">
                                    <a href="${prefix}/contact" class="btn-default">${es.ctaButton}</a>
                                </div>
                            </div>
                        </div>
                        <div class="support-video-box">
                            <div class="support-video-image">
                                <figure><img src="/images/support-video-image.jpg" alt=""></figure>
                            </div>
                            <div class="video-play-button">
                                <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" class="popup-video" data-cursor-text="Play">
                                    <span class="bg-effect"><i class="fa-solid fa-play"></i></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="section-footer-text wow fadeInUp" data-wow-delay="0.6s">
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
    <!-- Our Support Section End -->

    <!-- Core Features Section Start -->
    <div class="core-features bg-section dark-section">
        <div class="container">
            <div class="row">
                <div class="col-xl-5">
                    <div class="core-features-content">
                        <div class="section-title">
                            <span class="section-sub-title wow fadeInUp">${cf.subTitle}</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">${cf.heading}</h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">${cf.description}</p>
                        </div>
                        <div class="core-features-content-btn wow fadeInUp" data-wow-delay="0.4s">
                            <a href="${prefix}/contact" class="btn-default btn-highlighted">${cf.contactButton}</a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-7">
                    <div class="core-features-item-list">
                        ${coreFeaturesItems.map((item, i) => `
                        <div class="core-features-item wow fadeInUp"${i > 0 ? ` data-wow-delay="${(i * 0.2).toFixed(1)}s"` : ''}>
                            <div class="icon-box"><img src="/images/${item.icon}" alt=""></div>
                            <div class="core-features-item-content"><h3>${cf.items[item.key]}</h3></div>
                        </div>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Core Features Section End -->

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
                        ${faqKeys.map((key, i) => `
                        <div class="accordion-item wow fadeInUp"${i > 0 ? ` data-wow-delay="${(i * 0.2).toFixed(1)}s"` : ''}>
                            <h2 class="accordion-header" id="heading${i + 1}">
                                <button class="accordion-button${i === 2 ? '' : ' collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i + 1}" aria-expanded="${i === 2}" aria-controls="collapse${i + 1}">
                                    ${fa.items[key].question}
                                </button>
                            </h2>
                            <div id="collapse${i + 1}" class="accordion-collapse collapse${i === 2 ? ' show' : ''}" role="region" aria-labelledby="heading${i + 1}" data-bs-parent="#accordion">
                                <div class="accordion-body"><p>${fa.items[key].answer}</p></div>
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
