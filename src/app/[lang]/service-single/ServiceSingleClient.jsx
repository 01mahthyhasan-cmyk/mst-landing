'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const SERVICE_META = [
  { id: 'opd', icon: 'fa-solid fa-stethoscope', image: '/images/service-single-image.jpg', benefitImg: '/images/service-benefits-video-image.jpg' },
  { id: 'clinic', icon: 'fa-solid fa-hospital', image: '/images/service-single-image.jpg', benefitImg: '/images/service-benefits-video-image.jpg' },
  { id: 'ecg', icon: 'fa-solid fa-heart-pulse', image: '/images/service-single-image.jpg', benefitImg: '/images/service-benefits-video-image.jpg' },
  { id: 'physiotherapy', icon: 'fa-solid fa-person-walking', image: '/images/service-single-image.jpg', benefitImg: '/images/service-benefits-video-image.jpg' },
  { id: 'specialist', icon: 'fa-solid fa-user-doctor', image: '/images/service-single-image.jpg', benefitImg: '/images/service-benefits-video-image.jpg' },
  { id: 'laboratory', icon: 'fa-solid fa-flask', image: '/images/service-single-image.jpg', benefitImg: '/images/service-benefits-video-image.jpg' },
  { id: 'nebulizer', icon: 'fa-solid fa-lungs', image: '/images/service-single-image.jpg', benefitImg: '/images/service-benefits-video-image.jpg' },
  { id: 'elders', icon: 'fa-solid fa-hand-holding-heart', image: '/images/service-single-image.jpg', benefitImg: '/images/service-benefits-video-image.jpg' },
  { id: 'homevisit', icon: 'fa-solid fa-house-medical', image: '/images/service-single-image.jpg', benefitImg: '/images/service-benefits-video-image.jpg' },
  { id: 'ambulance', icon: 'fa-solid fa-truck-medical', image: '/images/service-single-image.jpg', benefitImg: '/images/service-benefits-video-image.jpg' }
];

export default function ServiceSingleClient({ dict, lang }) {
  const searchParams = useSearchParams();
  const t = dict.serviceSinglePage;
  const home = lang === 'en' ? '/en' : '/';
  const servicesLink = lang === 'en' ? '/en/services' : '/services';
  const bookLink = lang === 'en' ? '/en/book-appointment' : '/book-appointment';
  const serviceSingleBase = lang === 'en' ? '/en/service-single' : '/service-single';

  // Merge metadata and dictionary content to construct SERVICES
  const SERVICES = SERVICE_META.map((meta) => {
    const translation = t.services[meta.id];
    return {
      ...meta,
      ...translation
    };
  });

  const initialService = searchParams.get('service') || 'opd';
  const [activeId, setActiveId] = useState(
    SERVICES.find((s) => s.id === initialService) ? initialService : 'opd'
  );

  // Sync with URL param if it changes (e.g. back/forward nav)
  useEffect(() => {
    const param = searchParams.get('service');
    if (param && SERVICES.find((s) => s.id === param)) {
      setActiveId(param);
    }
  }, [searchParams]);

  const svc = SERVICES.find((s) => s.id === activeId) || SERVICES[0];

  return (
    <>
      {/* Page Header */}
      <div className="page-header dark-section parallaxie">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-3" data-cursor="-opaque">
                  {svc.name}
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href={home}>{t.breadcrumb.home}</Link></li>
                    <li className="breadcrumb-item"><Link href={servicesLink}>{t.breadcrumb.current}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{svc.name}</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-service-single">
        <div className="container">
          <div className="row">

            {/* ── SIDEBAR ── */}
            <div className="col-lg-4">
              <div className="page-single-sidebar">

                {/* Service Nav */}
                <div className="page-category-list wow fadeInUp">
                  <h2 className="page-category-list-title">{t.discoverServices}</h2>
                  <ul>
                    {SERVICES.map((s) => (
                      <li key={s.id} className={activeId === s.id ? 'active' : ''}>
                        <Link
                          href={`${serviceSingleBase}?service=${s.id}`}
                          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          style={activeId === s.id ? { fontWeight: 700, color: 'var(--primary-color, #0d6efd)' } : {}}
                        >
                          <i className={`${s.icon} me-2`} style={{ width: 18 }} />
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Box */}
                <div className="sidebar-cta-box dark-section wow fadeInUp" data-wow-delay="0.25s">
                  <div className="sidebar-cta-header">
                    <div className="icon-box">
                      <i className="fa-regular fa-clock"></i>
                    </div>
                    <div className="sidebar-cta-title">
                      <h2>{t.scheduleVisit}</h2>
                    </div>
                  </div>
                  <div className="sidebar-cta-body">
                    <div className="sidebar-cta-list">
                      <ul>
                        <li><span>{dict.common.emergencySupport.scheduleLabel}</span>{dict.common.emergencySupport.scheduleHours}</li>
                      </ul>
                    </div>
                    <div className="sidebar-cta-btn">
                      <a href={bookLink} className="btn-default btn-highlighted">
                        {t.bookAppointment}
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="col-lg-8">
              <div className="service-single-content">

                {/* Hero Image */}
                <div className="page-single-image">
                  <figure className="image-anime reveal">
                    <img src={svc.image} alt={svc.name} />
                  </figure>
                </div>

                {/* Entry Text */}
                <div className="service-entry">
                  <p className="wow fadeInUp">{svc.desc1}</p>
                  <p className="wow fadeInUp" data-wow-delay="0.2s">{svc.desc2}</p>

                  {/* Why Choose */}
                  <div className="service-why-choose-box">
                    <h2 className="text-anime-style-3">{svc.whyTitle}</h2>
                    <p className="wow fadeInUp">{svc.whyDesc}</p>

                    <div className="service-why-choose-item-list">
                      <div className="service-why-choose-item wow fadeInUp" data-wow-delay="0.2s">
                        <div className="service-why-choose-item-image">
                          <figure className="image-anime">
                            <img src={svc.whyImg1 || '/images/service-why-choose-item-image-1.jpg'} alt="" />
                          </figure>
                        </div>
                        <div className="service-why-choose-item-content">
                          <h3>{svc.whyPoint1}</h3>
                          <p>{t.whyChoosePoint1Desc}</p>
                        </div>
                      </div>

                      <div className="service-why-choose-item wow fadeInUp" data-wow-delay="0.4s">
                        <div className="service-why-choose-item-image">
                          <figure className="image-anime">
                            <img src={svc.whyImg2 || '/images/service-why-choose-item-image-2.jpg'} alt="" />
                          </figure>
                        </div>
                        <div className="service-why-choose-item-content">
                          <h3>{svc.whyPoint2}</h3>
                          <p>{t.whyChoosePoint2Desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Process */}
                  <div className="service-process-box">
                    <h2 className="text-anime-style-3">{svc.name} {t.processSuffix}</h2>
                    <p className="wow fadeInUp">{t.processDesc}</p>

                    <div className="service-process-item-list">
                      {svc.process && svc.process.map((p, i) => (
                        <div key={i} className="service-process-item wow fadeInUp" data-wow-delay={`${0.2 * (i + 1)}s`}>
                          <div className="service-process-item-number">
                            <h3>{p.step}</h3>
                          </div>
                          <div className="service-process-item-content">
                            <h3>{p.title}</h3>
                            <p>{p.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="section-footer-text wow fadeInUp" data-wow-delay="0.8s">
                      <ul>
                        <li className="section-footer-content">{t.trustedBy} <b>5,000+</b> {t.patients}</li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li><span className="counter">4.9</span>/5</li>
                      </ul>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="service-benefits-box">
                    <h2 className="text-anime-style-3">{t.benefitsTitle}</h2>
                    <p className="wow fadeInUp">{t.benefitsDesc}</p>

                    <div className="service-benefits-video-image-box wow fadeInUp" data-wow-delay="0.2s">
                      <div className="service-benefits-video-image">
                        <figure>
                          <img src={svc.benefitImg} alt="" />
                        </figure>
                      </div>
                      <div className="video-play-button">
                        <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" className="popup-video" data-cursor-text="Play">
                          <span className="bg-effect"><i className="fa-solid fa-play"></i></span>
                        </a>
                      </div>
                      <div className="service-benefits-list">
                        <ul>
                          {svc.benefits && svc.benefits.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div className="page-single-faqs">
                  <div className="section-title">
                    <h2 className="text-anime-style-3">{t.faqTitle}</h2>
                  </div>

                  <div className="faq-accordion" id={`accordion-${activeId}`}>
                    {svc.faqs && svc.faqs.map((faq, i) => (
                      <div key={i} className="accordion-item wow fadeInUp" data-wow-delay={`${0.2 * i}s`}>
                        <h2 className="accordion-header" id={`heading-${activeId}-${i}`}>
                          <button
                            className={`accordion-button ${i !== 0 ? 'collapsed' : ''}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${activeId}-${i}`}
                            aria-expanded={i === 0 ? 'true' : 'false'}
                            aria-controls={`collapse-${activeId}-${i}`}
                          >
                            {i + 1}. {faq.q}
                          </button>
                        </h2>
                        <div
                          id={`collapse-${activeId}-${i}`}
                          className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`}
                          role="region"
                          aria-labelledby={`heading-${activeId}-${i}`}
                          data-bs-parent={`#accordion-${activeId}`}
                        >
                          <div className="accordion-body">
                            <p>{faq.a}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
