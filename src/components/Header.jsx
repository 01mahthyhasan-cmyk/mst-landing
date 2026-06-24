import Link from 'next/link';

/**
 * Header — receives `dict` (translation dictionary) and `locale` from the
 * [lang]/layout.js server component. Falls back to English text if no dict.
 */
export default function Header({ dict, locale = 'ta' }) {
  const t = dict?.nav ?? {};
  const services = t.services ?? {};
  const pages = t.pages ?? {};

  // Prefix for locale-aware links (Tamil has no prefix, English uses /en)
  const p = locale === 'en' ? '/en' : '';

  return (
    <header className="main-header">
      <div className="header-sticky">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            {/* Logo Start */}
            <Link className="navbar-brand d-flex align-items-center" href={p + '/'}>
              <img src="/images/mst_logo.png" alt="Logo" style={{ maxHeight: '80px', marginRight: '10px' }} />
            </Link>
            {/* Logo End */}

            {/* Main Menu Start */}
            <div className="collapse navbar-collapse main-menu">
              <div className="nav-menu-wrapper">
                <ul className="navbar-nav mr-auto" id="menu">
                  <li className="nav-item">
                    <Link className="nav-link" href={p + '/'}>{t.home ?? 'Home'}</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href={p + '/about'}>{t.aboutUs ?? 'About Us'}</Link>
                  </li>
                  <li className="nav-item submenu">
                    <Link className="nav-link" href={p + '/services'}>{t.services?.label ?? 'Services'}</Link>
                    <ul>
                      <li className="nav-item"><Link className="nav-link" href={p + '/service-single?service=opd'}>{services.opd ?? 'OPD (Outpatient)'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/service-single?service=clinic'}>{services.clinic ?? 'Clinic Services'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/service-single?service=ecg'}>{services.ecg ?? 'ECG monitoring'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/service-single?service=physiotherapy'}>{services.physiotherapy ?? 'Physiotherapy'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/service-single?service=specialist'}>{services.specialist ?? 'Specialist Channelling'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/service-single?service=laboratory'}>{services.laboratory ?? 'Laboratory Services'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/service-single?service=nebulizer'}>{services.nebulizer ?? 'Nebulizer Services'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/service-single?service=elders'}>{services.elderscare ?? 'Elders Care'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/service-single?service=homevisit'}>{services.homeVisit ?? 'Home Visit Services'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/service-single?service=ambulance'}>{services.ambulance ?? 'Ambulance Services'}</Link></li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href={p + '/blog'}>{t.blog ?? 'Blog'}</Link>
                  </li>
                  <li className="nav-item submenu">
                    <Link className="nav-link" href="#">{pages.label ?? 'Pages'}</Link>
                    <ul>
                      <li className="nav-item"><Link className="nav-link" href={p + '/service-single'}>{pages.serviceDetails ?? 'Service Details'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/blog-single'}>{pages.blogDetails ?? 'Blog Details'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/case-study'}>{pages.caseStudy ?? 'Case Study'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/case-study-single'}>{pages.caseStudyDetails ?? 'Case Study Details'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/team'}>{pages.ourTeam ?? 'Our Team'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/team-single'}>{pages.teamDetails ?? 'Team Details'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/testimonials'}>{pages.testimonials ?? 'Testimonials'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/image-gallery'}>{pages.imageGallery ?? 'Image Gallery'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/video-gallery'}>{pages.videoGallery ?? 'Video Gallery'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/faqs'}>{pages.faqs ?? 'FAQs'}</Link></li>
                      <li className="nav-item"><Link className="nav-link" href={p + '/404'}>{pages.error404 ?? '404'}</Link></li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href={p + '/contact'}>{t.contactUs ?? 'Contact Us'}</Link>
                  </li>
                  <li className="nav-item highlighted-menu">
                    <Link className="nav-link" href={p + '/book-appointment'}>{t.bookAppointment ?? 'Book Appointment'}</Link>
                  </li>
                </ul>
              </div>

              {/* Header Btn Start */}
              <div className="header-btn">
                <Link href={p + '/book-appointment'} className="btn-default btn-highlighted">
                  {t.bookAppointment ?? 'Book Appointment'}
                </Link>
              </div>
              {/* Header Btn End */}
            </div>
            {/* Main Menu End */}
            <div className="navbar-toggle"></div>
          </div>
        </nav>
        <div className="responsive-menu"></div>
      </div>
    </header>
  );
}
