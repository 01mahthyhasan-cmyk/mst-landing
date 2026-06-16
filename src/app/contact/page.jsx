import HtmlContent from '../../components/HtmlContent';
export const metadata = {
    title: "Contact Us | MST Health Care",
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
                        <h1 class="text-anime-style-3" data-cursor="-opaque">Contact us</h1>
                        <nav class="wow fadeInUp" >
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="/">home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Contact us</li>
                            </ol>
                        </nav>
                    </div>
                    <!-- Page Header Box End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Page Header Section End -->

    <!-- Page Contact Us Start -->
    <div class="page-contact-us">
        <div class="container">
            <div class="row section-row align-items-center">
                <div class="col-lg-12">
                    <!-- Section Title Start -->
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">Get In Touch</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">We're here whenever you need us</h2>
                        <p class="wow fadeInUp" data-wow-delay="0.2s">Reach out to MST Health Care for expert medical consultations, appointments, home visits, or emergency support. Our compassionate team is ready to assist you every step of the way.</p>
                    </div>
                    <!-- Section Title End -->
                </div>
            </div>

            <div class="row">
                <div class="col-lg-12">
                <!-- Contact Info Item List Start -->
                <div class="contact-info-item-list">
                    <!-- Contact Info Item Start -->
                    <div class="contact-info-item wow fadeInUp">
                        <div class="icon-box">
                            <img src="/images/icon-headphone.svg" alt="">
                        </div>
                        <div class="contact-info-item-content">
                            <p>Call Us</p>
                            <h3><a href="tel:0652054997">065 205 4997</a></h3>
                            <h3><a href="tel:0762951343">076 295 1343</a></h3>
                        </div>
                    </div>
                    <!-- Contact Info Item End -->

                    <!-- Contact Info Item Start -->
                    <div class="contact-info-item wow fadeInUp" data-wow-delay="0.2s">
                        <div class="icon-box">
                            <img src="/images/icon-mail-white.svg" alt="">
                        </div>
                        <div class="contact-info-item-content">
                            <p>E-mail Us</p>
                            <h3><a href="mailto:contact@msthealthcare.com">contact@msthealthcare.com</a></h3>
                        </div>
                    </div>
                    <!-- Contact Info Item End -->

                    <!-- Contact Info Item Start -->
                    <div class="contact-info-item wow fadeInUp" data-wow-delay="0.4s">
                        <div class="icon-box">
                            <img src="/images/icon-location-white.svg" alt="">
                        </div>
                        <div class="contact-info-item-content">
                            <p>Our Location</p>
                            <h3>Trinco Road, Periya Urani, Batticaloa, Sri Lanka</h3>
                        </div>
                    </div>
                    <!-- Contact Info Item End -->
                </div>
                <!-- Contact Info Item List End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Page Contact Us Section End -->

    <!-- Contact location Form Box Start -->
    <div class="contact-location-form-box">
        <div class="container">
            <div class="row">
                <div class="col-xl-6">
                    <!-- Contact location Info Box Start -->
                    <div class="contact-location-info-box">
                        <!-- Section Title Start -->
                        <div class="section-title">
                            <span class="section-sub-title wow fadeInUp">Contact Us</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">Reach out to our healthcare experts today</h2>
                        </div>
                        <!-- Section Title End -->

                        <!-- Google Map Start -->
                        <div class="google-map-iframe wow fadeInUp" data-wow-delay="0.2s">
                            <iframe src="https://maps.google.com/maps?q=7.729446887969971,81.6787109375&amp;z=17&amp;hl=en&amp;output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                        <!-- Google Map End -->
                    </div>
                    <!-- Contact location Info Box End -->
                </div>

                <div class="col-xl-6">
                    <!-- Contact Form Start -->
                    <div class="contact-form">
                        <!-- Section Title Start -->
                        <div class="section-title">
                            <p class="wow fadeInUp">Reach out to our healthcare experts today for trusted guidance and personalized care.</p>
                        </div>
                        <!-- Section Title End -->

                        <!-- Contact Form Start -->
                        <form id="contactForm" action="#" method="POST" data-toggle="validator" class="wow fadeInUp" data-wow-delay="0.2s">
                            <div class="row">
                                <div class="form-group col-md-6 mb-4">
                                    <input type="text" name="fname" class="form-control" id="fname" placeholder="First Name*" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-6 mb-4">
                                    <input type="text" name="lname" class="form-control" id="lname" placeholder="Last Name*" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-6 mb-4">
                                    <input type="text" name="call" class="form-control" id="call" placeholder="Phone Number*" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-6 mb-4">
                                    <input type="email" name ="mail" class="form-control" id="mail" placeholder="E-mail Address*" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-12 mb-5">
                                    <textarea name="msg" class="form-control" id="msg" rows="5" placeholder="Write Message Here..."></textarea>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="col-md-12">
                                    <button type="submit" class="btn-default">Submit Message</button>
                                    <div id="formsubmit" class="h3 hidden"></div>
                                </div>
                            </div>
                        </form>
                        <!-- Contact Form End -->
                    </div>
                    <!-- Contact Form End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Contact location Form Box End -->`.replace(/\r\n/g, '\n')} />
    );
}
