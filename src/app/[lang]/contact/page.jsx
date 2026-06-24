import HtmlContent from '../../../components/HtmlContent';
import { getDictionary } from '../../../lib/getDictionary';

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return {
        title: dict.contactPage.metaTitle,
    };
}

export default async function Page({ params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const t = dict.contactPage;
    const p = lang === 'en' ? '/en' : '';

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
                                <li class="breadcrumb-item"><a href="${p === '' ? '/' : p}">${t.breadcrumb.home}</a></li>
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

    <!-- Page Contact Us Start -->
    <div class="page-contact-us">
        <div class="container">
            <div class="row section-row align-items-center">
                <div class="col-lg-12">
                    <!-- Section Title Start -->
                    <div class="section-title section-title-center">
                        <span class="section-sub-title wow fadeInUp">${t.subTitle}</span>
                        <h2 class="text-anime-style-3" data-cursor="-opaque">${t.title}</h2>
                        <p class="wow fadeInUp" data-wow-delay="0.2s">${t.description}</p>
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
                            <p>${t.callUs}</p>
                            <h3><a href="tel:${t.phones.phone1.replace(/\s+/g, '')}">${t.phones.phone1}</a></h3>
                            <h3><a href="tel:${t.phones.phone2.replace(/\s+/g, '')}">${t.phones.phone2}</a></h3>
                            <h3><a href="tel:${t.phones.phone3.replace(/\s+/g, '')}">${t.phones.phone3}</a></h3>
                        </div>
                    </div>
                    <!-- Contact Info Item End -->

                    <!-- Contact Info Item Start -->
                    <div class="contact-info-item wow fadeInUp" data-wow-delay="0.2s">
                        <div class="icon-box">
                            <img src="/images/icon-mail-white.svg" alt="">
                        </div>
                        <div class="contact-info-item-content">
                            <p>${t.emailUs}</p>
                            <h3><a href="mailto:${t.email}">${t.email}</a></h3>
                        </div>
                    </div>
                    <!-- Contact Info Item End -->

                    <!-- Contact Info Item Start -->
                    <div class="contact-info-item wow fadeInUp" data-wow-delay="0.4s">
                        <div class="icon-box">
                            <img src="/images/icon-location-white.svg" alt="">
                        </div>
                        <div class="contact-info-item-content">
                            <p>${t.locationLabel}</p>
                            <h3>${t.address}</h3>
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
                            <span class="section-sub-title wow fadeInUp">${t.mapSubTitle}</span>
                            <h2 class="text-anime-style-3" data-cursor="-opaque">${t.contactInfoHeading}</h2>
                        </div>
                        <!-- Section Title End -->

                        <!-- Google Map Start -->
                        <div class="google-map-iframe wow fadeInUp" data-wow-delay="0.2s">
                            <iframe src="https://maps.google.com/maps?q=MST+Healthcare,+Trinco+Road,+Batticaloa&amp;z=17&amp;hl=${lang}&amp;output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
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
                            <p class="wow fadeInUp">${t.contactForm.formDescription}</p>
                        </div>
                        <!-- Section Title End -->

                        <!-- Contact Form Start -->
                        <form id="contactForm" action="#" method="POST" data-toggle="validator" class="wow fadeInUp" data-wow-delay="0.2s">
                            <div class="row">
                                <div class="form-group col-md-6 mb-4">
                                    <input type="text" name="fname" class="form-control" id="fname" placeholder="${t.contactForm.firstNamePlaceholder}" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-6 mb-4">
                                    <input type="text" name="lname" class="form-control" id="lname" placeholder="${t.contactForm.lastNamePlaceholder}" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-6 mb-4">
                                    <input type="text" name="call" class="form-control" id="call" placeholder="${t.contactForm.phoneNumberPlaceholder}" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-6 mb-4">
                                    <input type="email" name ="mail" class="form-control" id="mail" placeholder="${t.contactForm.emailPlaceholder}" required>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="form-group col-md-12 mb-5">
                                    <textarea name="msg" class="form-control" id="msg" rows="5" placeholder="${t.contactForm.messagePlaceholder}"></textarea>
                                    <div class="help-block with-errors"></div>
                                </div>

                                <div class="col-md-12">
                                    <button type="submit" class="btn-default">${t.contactForm.submitButton}</button>
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
