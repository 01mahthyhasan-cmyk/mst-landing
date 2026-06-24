import Link from 'next/link';

/**
 * Footer — receives `dict` and `locale` from the [lang]/layout.js server component.
 */
export default function Footer({ dict, locale = 'ta' }) {
  const t = dict?.footer ?? {};
  const quickLinks = t.quickLinks ?? {};
  const medicalServices = t.medicalServices ?? {};
  const contactInfo = t.contactInfo ?? {};

  // Locale prefix for internal links
  const p = locale === 'en' ? '/en' : '';

  return (
    <div className="main-footer bg-section dark-section">
      <div className="container">
        <div className="row">
          <div className="col-xl-5">
            {/* Let's Talk Box Start */}
            <div className="lets-talk-box">
              <div className="section-title">
                <span className="section-sub-title wow fadeInUp">
                  {t.getInTouch ?? 'Get in Touch'}
                </span>
                <div className="lets-talk-title">
                  <h2>
                    <Link href={p + '/contact'}>{t.letsTalk ?? "Let's Talk"}</Link>
                  </h2>
                  <div className="years-experience-circle">
                    <figure>
                      <img src="/images/years-experience-circle-accent.svg" alt="" />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
            {/* Let's Talk Box End */}
          </div>

          <div className="col-xl-7">
            {/* Footer Links Box Start */}
            <div className="footer-links-box">
              {/* Footer Header Start */}
              <div className="footer-header">
                <div className="footer-logo d-flex align-items-center">
                  <img src="/images/mst_logo.png" alt="Logo" style={{ maxHeight: '65px' }} />
                </div>
                <div className="footer-social-links">
                  <ul>
                    <li><a href="https://www.facebook.com/people/MST-Health-Care/61590818814946/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f"></i></a></li>
                    <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                    <li><a href="#"><i className="fa-brands fa-whatsapp"></i></a></li>
                  </ul>
                </div>
              </div>
              {/* Footer Header End */}

              {/* Quick Links */}
              <div className="footer-links">
                <h2>{quickLinks.heading ?? 'Quick Links'}</h2>
                <ul>
                  <li><Link href={p + '/'}>{quickLinks.home ?? 'Home'}</Link></li>
                  <li><Link href={p + '/about'}>{quickLinks.aboutUs ?? 'About Us'}</Link></li>
                  <li><Link href={p + '/services'}>{quickLinks.ourServices ?? 'Our Services'}</Link></li>
                  <li><Link href={p + '/contact'}>{quickLinks.contactUs ?? 'Contact Us'}</Link></li>
                </ul>
              </div>

              {/* Medical Services */}
              <div className="footer-links">
                <h2>{medicalServices.heading ?? 'Medical Services'}</h2>
                <ul>
                  <li><Link href={p + '/services#opd'}>{medicalServices.opd ?? 'OPD Consultation'}</Link></li>
                  <li><Link href={p + '/services#physiotherapy'}>{medicalServices.physiotherapy ?? 'Physiotherapy'}</Link></li>
                  <li><Link href={p + '/services#laboratory'}>{medicalServices.laboratory ?? 'Laboratory Services'}</Link></li>
                  <li><Link href={p + '/services#home-visit'}>{medicalServices.homeVisit ?? 'Home Visit Services'}</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="footer-links">
                <h2>{contactInfo.heading ?? 'Contact Info'}</h2>
                <ul className="text-white list-unstyled">
                  <li style={{ color: '#fff', marginBottom: '8px' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#0070f3', marginRight: '8px' }}></i>
                    {t.address ?? 'Trinco Road, Periya Urani,'}
                    <br />
                    {!t.address && 'Batticaloa, Sri Lanka'}
                  </li>
                  <li style={{ color: '#fff', marginBottom: '8px' }}>
                    <i className="fa-solid fa-phone" style={{ color: '#0070f3', marginRight: '8px' }}></i>
                    {contactInfo.phone1 ?? '065 205 4997'}
                  </li>
                  <li style={{ color: '#fff' }}>
                    <i className="fa-solid fa-phone" style={{ color: '#0070f3', marginRight: '8px' }}></i>
                    {contactInfo.phone2 ?? '076 295 1343'}
                  </li>
                </ul>
              </div>
            </div>
            {/* Footer Links Box End */}
          </div>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="footer-copyright">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="footer-copyright-text">
                <p>{t.copyright ?? 'Copyright © 2025 MST Health Care. All Rights Reserved.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
