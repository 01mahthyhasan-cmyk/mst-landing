import HtmlContent from '../../components/HtmlContent';
export const metadata = {
  title: "Book an Appointment | MST Health Care",
};

export default function Page() {
  return (
    <HtmlContent html={`<!-- Page Header Section Start -->
    <div class="page-header dark-section parallaxie">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <!-- Page Header Box Start -->
                    <div class="page-header-box">
                        <h1 class="text-anime-style-3" data-cursor="-opaque">Book appointment</h1>
                        <nav class="wow fadeInUp" >
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="/">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Book appointment</li>
                            </ol>
                        </nav>
                    </div>
                    <!-- Page Header Box End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Page Header Section End -->

    <!-- Page Appointment Start -->
    <div class="page-appointment">
        <div class="container">
            <div class="row">
                <div class="col-xl-6">
                    <!-- Appointment Content Start -->
                    <div class="our-appointment-content">
                        <!-- Section Title Start -->
                        <div class="section-title">
                            <span class="section-sub-title wow fadeInUp">Book an Appointment</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">Book your appointment for better health today</h2>
                        </div>
                        <!-- Section Title End -->

                        <!-- Google Map Start -->
                        <div class="google-map-iframe wow fadeInUp" data-wow-delay="0.2s">
                            <iframe src="https://maps.google.com/maps?q=7.729446887969971,81.6787109375&amp;z=17&amp;hl=en&amp;output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
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
                            <h2 class="text-anime-style-3" data-cursor="-opaque">Book an appointment</h2>
                        </div>
                        <!-- Section Title End -->

                        <!-- Appointment Form Start -->
                        <form id="appointmentForm" action="#" method="POST" data-toggle="validator" class="wow fadeInUp" data-wow-delay="0.2s">
                            <div class="row">
                                <div class="form-group col-md-6 mb-4">
                                    <input type="text" name="name" class="form-control" id="name" placeholder="Full Name" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-6 mb-4">
                                    <input type="email" name ="email" class="form-control" id="email" placeholder="Email Address" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-6 mb-4">
                                    <input type="text" name="phone" class="form-control" id="phone" placeholder="Phone Number" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-6 mb-4">
                                    <select name="service" class="form-control form-select" id="service" required>
                                        <option value="" disabled selected>Select Service</option>
                                        <option value="opd">OPD (Outpatient Department)</option>
                                        <option value="clinic_services">Clinic Services</option>
                                        <option value="ecg">ECG</option>
                                        <option value="physiotherapy">Physiotherapy</option>
                                        <option value="specialist_channelling">Specialist Channelling</option>
                                        <option value="laboratory_services">Laboratory Services</option>
                                        <option value="nebulizer_services">Nebulizer Services</option>
                                        <option value="elders_care">Elders Care</option>
                                        <option value="home_visit">Home Visit Services</option>
                                        <option value="ambulance">Ambulance Services</option>
                                    </select>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-12 mb-5">
                                    <textarea name="message" class="form-control" id="message" rows="5" placeholder="Write Message Here..."></textarea>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="col-md-12">
                                    <button type="submit" class="btn-default">Submit Message</button>
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
    <!-- Page Appointment End -->

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

    <!-- Our Support Section Start -->
    <div class="our-support">
        <div class="container">
            <div class="row section-row">
                <div class="col-lg-12">
                    <!-- Section Title Start -->
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">Emergency Care</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">24/7 emergency support</h2>
                        <p class="wow fadeInUp" data-wow-delay="0.2s">Our emergency department is available around the clock to provide immediate medical assistance and life-saving care when you need it most.</p>
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
                                    <h3>Schedule a hours:</h3>
                                </div>
                            </div>
                            <!-- Support CTA Header End -->

                            <!-- Support CTA Body Start -->
                            <div class="support-cta-body">
                                <!-- Support CTA List Start -->
                                <div class="support-cta-list">
                                    <ul>
                                        <li><span>Everyday:</span>06:30 AM - 08:00 PM</li>
                                    </ul>
                                </div>
                                <!-- Support CTA List End -->

                                <!-- Support CTA Button Start -->
                                <div class="support-cta-btn">
                                    <a href="/contact" class="btn-default">24/7 Services for Emergancy</a>
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
    <!-- Our Support Section End -->

    <!-- Core Features Section Start -->
    <div class="core-features bg-section dark-section">
        <div class="container">
            <div class="row">
                <div class="col-xl-5">
                    <!-- Core Features Content Start -->
                    <div class="core-features-content">
                        <!-- Section Title Start -->
                        <div class="section-title">
                            <span class="section-sub-title wow fadeInUp">Core Feature</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">Core features of our healthcare services</h2>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">Our medical services are designed to provide reliable, high-quality care with a strong focus on patient comfort and safety</p>
                        </div>
                        <!-- Section Title End -->

                        <!-- Core Features Content Button Start -->
                        <div class="core-features-content-btn wow fadeInUp" data-wow-delay="0.4s">
                            <a href="/contact" class="btn-default btn-highlighted">Contact Us</a>
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
                                <h3>Quality Medical Treatment</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="0.2s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-2.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>Personalized Patient Care</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="0.4s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-3.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>Modern Medical Facilities</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="0.6s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-4.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>24/7 Emergency Support</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="0.8s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-5.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>Fast and Accurate Test Results</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="1s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-6.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>Safe and Comfortable Environment</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="1.2s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-7.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>Experienced Medical Professionals</h3>
                            </div>
                        </div>
                        <!-- Core Features Item End -->

                        <!-- Core Features Item Start -->
                        <div class="core-features-item wow fadeInUp" data-wow-delay="1.4s">
                            <div class="icon-box">
                                <img src="/images/icon-core-features-item-8.svg" alt="">
                            </div>
                            <div class="core-features-item-content">
                                <h3>Advanced Diagnostic Technology</h3>
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
