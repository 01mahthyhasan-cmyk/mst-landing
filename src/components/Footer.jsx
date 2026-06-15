import Link from 'next/link';

export default function Footer() {
  return (
    <div className="main-footer bg-section dark-section">
      <div className="container">
        <div className="row">
          <div className="col-xl-5">
            {/* Let's Talk Box Start */}
            <div className="lets-talk-box">
              {/* Section Title Start */}
              <div className="section-title">
                <span className="section-sub-title wow fadeInUp">Get in Touch</span>
                {/* Let's Talk Title Start */}
                <div className="lets-talk-title">
                  <h2><Link href="/contact">Let's Talk</Link></h2>
                  {/* Footer Experience Circle Start */}
                  <div className="years-experience-circle">
                    <figure>
                      <img src="/images/years-experience-circle-accent.svg" alt="" />
                    </figure>
                  </div>
                  {/* Footer Experience Circle End */}
                </div>
                {/* Let's Talk Title End */}
              </div>
              {/* Section Title End */}
            </div>
            {/* Let's Talk Box End */}
          </div>

          <div className="col-xl-7">
            {/* Footer Links Box Start */}
            <div className="footer-links-box">
              {/* Footer Header Start */}
              <div className="footer-header">
                {/* Footer Logo Start */}
                <div className="footer-logo d-flex align-items-center">
                  <img src="/images/mst_logo.png" alt="Logo" style={{ maxHeight: '65px' }} />
                </div>
                {/* Footer Logo End */}

                {/* Footer Social Links Start  */}
                <div className="footer-social-links">
                  <ul>
                    <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                    <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                    <li><a href="#"><i className="fa-brands fa-whatsapp"></i></a></li>
                  </ul>
                </div>
                {/* Footer Social Links End  */}
              </div>
              {/* Footer Header End */}

              {/* Footer Links Start */}
              <div className="footer-links">
                <h2>Quick Links</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/services">Our Services</Link></li>
                  <li><Link href="/contact">Contact Us</Link></li>
                </ul>
              </div>
              {/* Footer Links End */}

              {/* Footer Links Start */}
              <div className="footer-links">
                <h2>Medical Services</h2>
                <ul>
                  <li><Link href="/services#opd">OPD Consultation</Link></li>
                  <li><Link href="/services#physiotherapy">Physiotherapy</Link></li>
                  <li><Link href="/services#laboratory">Laboratory Services</Link></li>
                  <li><Link href="/services#home-visit">Home Visit Services</Link></li>
                </ul>
              </div>
              {/* Footer Links End */}

              {/* Footer Links Start */}
              <div className="footer-links">
                <h2>Contact Info</h2>
                <ul className="text-white list-unstyled">
                  <li style={{ color: '#fff', marginBottom: '8px' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#0070f3', marginRight: '8px' }}></i>
                    Trinco Road, Periya Urani,<br />Batticaloa, Sri Lanka
                  </li>
                  <li style={{ color: '#fff', marginBottom: '8px' }}>
                    <i className="fa-solid fa-phone" style={{ color: '#0070f3', marginRight: '8px' }}></i>
                    065 205 4997
                  </li>
                  <li style={{ color: '#fff' }}>
                    <i className="fa-solid fa-phone" style={{ color: '#0070f3', marginRight: '8px' }}></i>
                    076 295 1343
                  </li>
                </ul>
              </div>
              {/* Footer Links End */}
            </div>
            {/* Footer Links Box End */}
          </div>
        </div>
      </div>

      {/* Footer Copyright Start */}
      <div className="footer-copyright">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* Footer Copyright Text Start */}
              <div className="footer-copyright-text">
                <p>Copyright © 2025 MST Health Care. All Rights Reserved.</p>
              </div>
              {/* Footer Copyright Text End */}
            </div>
          </div>
        </div>
      </div>
      {/* Footer Copyright End */}
    </div>
  );
}
