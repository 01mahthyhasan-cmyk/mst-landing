import Link from 'next/link';

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-sticky">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            {/* Logo Start */}
            <Link className="navbar-brand d-flex align-items-center" href="/">
              <img src="/images/mst_logo.png" alt="Logo" style={{ maxHeight: '80px', marginRight: '10px' }} />
            </Link>
            {/* Logo End */}

            {/* Main Menu Start */}
            <div className="collapse navbar-collapse main-menu">
              <div className="nav-menu-wrapper">
                <ul className="navbar-nav mr-auto" id="menu">
                  <li className="nav-item">
                    <Link className="nav-link" href="/">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/about">About Us</Link>
                  </li>
                  <li className="nav-item submenu">
                    <Link className="nav-link" href="/services">Services</Link>
                    <ul>
                      <li className="nav-item"><Link className="nav-link" href="/service-single?service=opd">OPD (Outpatient)</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/service-single?service=clinic">Clinic Services</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/service-single?service=ecg">ECG monitoring</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/service-single?service=physiotherapy">Physiotherapy</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/service-single?service=specialist">Specialist Channelling</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/service-single?service=laboratory">Laboratory Services</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/service-single?service=nebulizer">Nebulizer Services</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/service-single?service=elders">Elders Care</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/service-single?service=homevisit">Home Visit Services</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/service-single?service=ambulance">Ambulance Services</Link></li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/blog">Blog</Link>
                  </li>
                  <li className="nav-item submenu">
                    <Link className="nav-link" href="#">Pages</Link>
                    <ul>
                      <li className="nav-item"><Link className="nav-link" href="/service-single">Service Details</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/blog-single">Blog Details</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/case-study">Case Study</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/case-study-single">Case Study Details</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/team">Our Team</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/team-single">Team Details</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/testimonials">Testimonials</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/image-gallery">Image Gallery</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/video-gallery">Video Gallery</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/faqs">FAQs</Link></li>
                      <li className="nav-item"><Link className="nav-link" href="/404">404</Link></li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/contact">Contact Us</Link>
                  </li>
                  <li className="nav-item highlighted-menu">
                    <Link className="nav-link" href="/book-appointment">Book Appointment</Link>
                  </li>
                </ul>
              </div>

              {/* Header Btn Start */}
              <div className="header-btn">
                <Link href="/book-appointment" className="btn-default btn-highlighted">
                  Book Appointment
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
