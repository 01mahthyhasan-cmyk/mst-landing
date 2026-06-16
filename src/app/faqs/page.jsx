import HtmlContent from '../../components/HtmlContent';
export const metadata = {
  title: "FAQs | MST Health Care",
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
                        <h1 class="text-anime-style-3" data-cursor="-opaque">Frequently asked questions</h1>
                        <nav class="wow fadeInUp" >
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="/">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">FAQ's</li>
                            </ol>
                        </nav>
                    </div>
                    <!-- Page Header Box End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Page Header Section End -->

    <!-- Page Faqs Start -->
    <div class="page-faqs">
        <div class="container">
            <div class="row">
                 <div class="col-lg-4">
                    <!-- Page Single Sidebar Start -->
                    <div class="page-single-sidebar">
                        <!-- Page Category List Start -->
                        <div class="page-category-list wow fadeInUp">
                            <ul>
                                <li><a href="#faq_1">General Questions</a></li>
                                <li><a href="#faq_2">Appointment & consultation</a></li>
                                <li><a href="#faq_3">Services & treatment</a></li>
                                <li><a href="#faq_4">Payments & pricing</a></li>
                                <li><a href="#faq_5">Emergency & support</a></li>
                            </ul>
                        </div>
                        <!-- Page Category List End -->

                        <!-- Sidebar CTA Box Start -->
                        <div class="sidebar-cta-box dark-section wow fadeInUp" data-wow-delay="0.25s">
                            <div class="sidebar-cta-header">
                                <div class="icon-box">
                                    <i class="fa-regular fa-clock"></i>
                                </div>
                                <div class="sidebar-cta-title">
                                    <h2>Schedule a hours:</h2>
                                </div>
                            </div>
                            <div class="sidebar-cta-body">
                                <div class="sidebar-cta-list">
                                    <ul>
                                        <li><span>Everyday:</span>6:30 AM - 8:00 PM</li>
                                    </ul>
                                </div>
                                <div class="sidebar-cta-btn">
                                    <a href="/book-appointment" class="btn-default btn-highlighted">Book An Appointment</a>
                                </div>
                            </div>
                        </div>
                        <!-- Sidebar CTA Box End -->
                    </div>
                    <!-- Page Single Sidebar End -->
                </div>

                <div class="col-lg-8">
                    <!-- Page FAQs List Start -->
                    <div class="page-faqs-list">
                        <!-- FAQs section start -->
                        <div class="page-single-faqs" id="faq_1">
                            <!-- Section Title Start -->
                            <div class="section-title">
                                <h2 class="wow fadeInUp" data-cursor="-opaque">General questions</h2>
                            </div>
                            <!-- Section Title End -->

                            <!-- FAQ Accordion Start -->
                            <div class="faq-accordion our-faq-accordion" id="accordion">
                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.2s">
                                    <h2 class="accordion-header" id="heading1">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
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
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.4s">
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
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                                    <h2 class="accordion-header" id="heading3">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
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
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.8s">
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
                                <div class="accordion-item wow fadeInUp" data-wow-delay="1s">
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
                        <!-- FAQs section End -->

                        <!-- FAQs section start -->
                        <div class="page-single-faqs" id="faq_2">
                            <!-- Section Title Start -->
                            <div class="section-title">
                                <h2 class="wow fadeInUp" data-cursor="-opaque">Appointment & consultation</h2>
                            </div>
                            <!-- Section Title End -->

                            <!-- FAQ Accordion Start -->
                            <div class="faq-accordion our-faq-accordion" id="accordion1">
                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.2s">
                                    <h2 class="accordion-header" id="heading6">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6" aria-expanded="true" aria-controls="collapse6">
                                            1. How can I book an appointment?
                                        </button>
                                    </h2>
                                    <div id="collapse6" class="accordion-collapse collapse" role="region" aria-labelledby="heading6" data-bs-parent="#accordion1">
                                        <div class="accordion-body">
                                            <p>Please bring your previous medical records, prescriptions, test reports, and a valid ID. If you have health insurance, carry your insurance details as well.  </p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                                    <h2 class="accordion-header" id="heading7">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse7" aria-expanded="false" aria-controls="collapse7">
                                            2. Can I choose a specific doctor?
                                        </button>
                                    </h2>
                                    <div id="collapse7" class="accordion-collapse collapse" role="region" aria-labelledby="heading7" data-bs-parent="#accordion1">
                                        <div class="accordion-body">
                                            <p>Please bring your previous medical records, prescriptions, test reports, and a valid ID. If you have health insurance, carry your insurance details as well.  </p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                                    <h2 class="accordion-header" id="heading8">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse8" aria-expanded="false" aria-controls="collapse8">
                                            3. What should I bring to my appointment?
                                        </button>
                                    </h2>
                                    <div id="collapse8" class="accordion-collapse collapse show" role="region" aria-labelledby="heading8" data-bs-parent="#accordion1">
                                        <div class="accordion-body">
                                            <p>Please bring your previous medical records, prescriptions, test reports, and a valid ID. If you have health insurance, carry your insurance details as well.  </p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                                    <h2 class="accordion-header" id="heading9">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse9" aria-expanded="false" aria-controls="collapse9">
                                            4. Do I need an appointment before visiting?
                                        </button>
                                    </h2>
                                    <div id="collapse9" class="accordion-collapse collapse" role="region" aria-labelledby="heading9" data-bs-parent="#accordion1">
                                        <div class="accordion-body">
                                            <p>Please bring your previous medical records, prescriptions, test reports, and a valid ID. If you have health insurance, carry your insurance details as well.  </p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="1s">
                                    <h2 class="accordion-header" id="heading10">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse10" aria-expanded="false" aria-controls="collapse10">
                                            5. What are your clinic working hours?
                                        </button>
                                    </h2>
                                    <div id="collapse10" class="accordion-collapse collapse" role="region" aria-labelledby="heading10" data-bs-parent="#accordion1">
                                        <div class="accordion-body">
                                            <p>Our clinic is open from 6:30 AM to 8:00 PM everyday, including weekends and public holidays.</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->
                            </div>
                            <!-- FAQ Accordion End -->
                        </div>
                        <!-- FAQs section End -->

                        <!-- FAQs section start -->
                        <div class="page-single-faqs" id="faq_3">
                            <!-- Section Title Start -->
                            <div class="section-title">
                                <h2 class="wow fadeInUp" data-cursor="-opaque">Services & treatment</h2>
                            </div>
                            <!-- Section Title End -->

                            <!-- FAQ Accordion Start -->
                            <div class="faq-accordion our-faq-accordion" id="accordion2">
                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.2s">
                                    <h2 class="accordion-header" id="heading11">
                                        <button class="accordion-button  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse11" aria-expanded="true" aria-controls="collapse11">
                                            1. What medical services do you provide?
                                        </button>
                                    </h2>
                                    <div id="collapse11" class="accordion-collapse collapse" role="region" aria-labelledby="heading11" data-bs-parent="#accordion2">
                                        <div class="accordion-body">
                                            <p>Yes, we offer a full range of laboratory and diagnostic services at our clinic. Our advanced testing facilities ensure accurate and timely results to support proper diagnosis and effective treatment.</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                                    <h2 class="accordion-header" id="heading12">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse12" aria-expanded="false" aria-controls="collapse12">
                                            2. Do you provide full body checkups?
                                        </button>
                                    </h2>
                                    <div id="collapse12" class="accordion-collapse collapse" role="region" aria-labelledby="heading12" data-bs-parent="#accordion2">
                                        <div class="accordion-body">
                                            <p>Yes, we offer a full range of laboratory and diagnostic services at our clinic. Our advanced testing facilities ensure accurate and timely results to support proper diagnosis and effective treatment.</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                                    <h2 class="accordion-header" id="heading13">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse13" aria-expanded="false" aria-controls="collapse13">
                                            3. Are laboratory tests available at your clinic?
                                        </button>
                                    </h2>
                                    <div id="collapse13" class="accordion-collapse collapse show" role="region" aria-labelledby="heading13" data-bs-parent="#accordion2">
                                        <div class="accordion-body">
                                            <p>Yes, we offer a full range of laboratory and diagnostic services at our clinic. Our advanced testing facilities ensure accurate and timely results to support proper diagnosis and effective treatment.</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                                    <h2 class="accordion-header" id="heading14">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse14" aria-expanded="false" aria-controls="collapse14">
                                            4. How can I book an appointment?
                                        </button>
                                    </h2>
                                    <div id="collapse14" class="accordion-collapse collapse" role="region" aria-labelledby="heading14" data-bs-parent="#accordion2">
                                        <div class="accordion-body">
                                            <p>Yes, we offer a full range of laboratory and diagnostic services at our clinic. Our advanced testing facilities ensure accurate and timely results to support proper diagnosis and effective treatment.</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="1s">
                                    <h2 class="accordion-header" id="heading15">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse15" aria-expanded="false" aria-controls="collapse15">
                                            5. What should I bring to my appointment?
                                        </button>
                                    </h2>
                                    <div id="collapse15" class="accordion-collapse collapse" role="region" aria-labelledby="heading15" data-bs-parent="#accordion2">
                                        <div class="accordion-body">
                                            <p>Yes, we offer a full range of laboratory and diagnostic services at our clinic. Our advanced testing facilities ensure accurate and timely results to support proper diagnosis and effective treatment.</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->
                            </div>
                            <!-- FAQ Accordion End -->
                        </div>
                        <!-- FAQs section End -->

                        <!-- FAQs section start -->
                        <div class="page-single-faqs" id="faq_4">
                            <!-- Section Title Start -->
                            <div class="section-title">
                                <h2 class="wow fadeInUp" data-cursor="-opaque">Payments & pricing</h2>
                            </div>
                            <!-- Section Title End -->
                            
                            <!-- FAQ Accordion Start -->
                            <div class="faq-accordion our-faq-accordion" id="accordion3">
                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.2s">
                                    <h2 class="accordion-header" id="heading16">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse16" aria-expanded="false" aria-controls="collapse16">
                                            1. What payment methods do you accept?
                                        </button>
                                    </h2>
                                    <div id="collapse16" class="accordion-collapse collapse" role="region" aria-labelledby="heading16" data-bs-parent="#accordion3">
                                        <div class="accordion-body">
                                            <p>Yes, we accept selected health insurance plans. Our team can assist you with the claim process and guide you on coverage details.</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                                    <h2 class="accordion-header" id="heading17">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse17" aria-expanded="false" aria-controls="collapse17">
                                            2. Are your services affordable?
                                        </button>
                                    </h2>
                                    <div id="collapse17" class="accordion-collapse collapse" role="region" aria-labelledby="heading17" data-bs-parent="#accordion3">
                                        <div class="accordion-body">
                                            <p>Yes, we accept selected health insurance plans. Our team can assist you with the claim process and guide you on coverage details.</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                                    <h2 class="accordion-header" id="heading18">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse18" aria-expanded="false" aria-controls="collapse18">
                                            3. Do you offer insurance support?
                                        </button>
                                    </h2>
                                    <div id="collapse18" class="accordion-collapse collapse show" role="region" aria-labelledby="heading18" data-bs-parent="#accordion3">
                                        <div class="accordion-body">
                                            <p>Yes, we accept selected health insurance plans. Our team can assist you with the claim process and guide you on coverage details.</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                                    <h2 class="accordion-header" id="heading19">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse19" aria-expanded="false" aria-controls="collapse19">
                                            4. What medical services do you provide?
                                        </button>
                                    </h2>
                                    <div id="collapse19" class="accordion-collapse collapse" role="region" aria-labelledby="heading19" data-bs-parent="#accordion3">
                                        <div class="accordion-body">
                                            <p>Yes, we accept selected health insurance plans. Our team can assist you with the claim process and guide you on coverage details.</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="1s">
                                    <h2 class="accordion-header" id="heading20">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse20" aria-expanded="false" aria-controls="collapse20">
                                            5. Are laboratory tests available at your clinic?
                                        </button>
                                    </h2>
                                    <div id="collapse20" class="accordion-collapse collapse" role="region" aria-labelledby="heading20" data-bs-parent="#accordion3">
                                        <div class="accordion-body">
                                            <p>Yes, we accept selected health insurance plans. Our team can assist you with the claim process and guide you on coverage details.</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->
                            </div>
                            <!-- FAQ Accordion End -->
                        </div>
                        <!-- FAQs section End -->

                        <!-- FAQs section start -->
                        <div class="page-single-faqs" id="faq_5">
                            <!-- Section Title Start -->
                            <div class="section-title">
                                <h2 class="wow fadeInUp" data-cursor="-opaque">Emergency & support</h2>
                            </div>
                            <!-- Section Title End -->
                            
                            <!-- FAQ Accordion Start -->
                            <div class="faq-accordion our-faq-accordion" id="accordion4">
                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.2s">
                                    <h2 class="accordion-header" id="heading21">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse21" aria-expanded="false" aria-controls="collapse21">
                                            1. Do you provide emergency services?
                                        </button>
                                    </h2>
                                    <div id="collapse21" class="accordion-collapse collapse" role="region" aria-labelledby="heading21" data-bs-parent="#accordion4">
                                        <div class="accordion-body">
                                            <p>We offer a wide range of healthcare services including general consultation, diagnostic testing, emergency care, pediatric care, cardiology, orthopedic treatment, preventive health checkups,</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                                    <h2 class="accordion-header" id="heading22">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse22" aria-expanded="false" aria-controls="collapse22">
                                            2. How can I contact you in case of emergency?
                                        </button>
                                    </h2>
                                    <div id="collapse22" class="accordion-collapse collapse" role="region" aria-labelledby="heading22" data-bs-parent="#accordion4">
                                        <div class="accordion-body">
                                            <p>We offer a wide range of healthcare services including general consultation, diagnostic testing, emergency care, pediatric care, cardiology, orthopedic treatment, preventive health checkups,</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                                    <h2 class="accordion-header" id="heading23">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse23" aria-expanded="false" aria-controls="collapse23">
                                            3. What medical services do you provide?
                                        </button>
                                    </h2>
                                    <div id="collapse23" class="accordion-collapse collapse show" role="region" aria-labelledby="heading23" data-bs-parent="#accordion4">
                                        <div class="accordion-body">
                                            <p>We offer a wide range of healthcare services including general consultation, diagnostic testing, emergency care, pediatric care, cardiology, orthopedic treatment, preventive health checkups,</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                                    <h2 class="accordion-header" id="heading24">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse24" aria-expanded="false" aria-controls="collapse24">
                                            4. Do you offer insurance support?
                                        </button>
                                    </h2>
                                    <div id="collapse24" class="accordion-collapse collapse" role="region" aria-labelledby="heading24" data-bs-parent="#accordion4">
                                        <div class="accordion-body">
                                            <p>We offer a wide range of healthcare services including general consultation, diagnostic testing, emergency care, pediatric care, cardiology, orthopedic treatment, preventive health checkups,</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->

                                <!-- FAQ Item Start -->
                                <div class="accordion-item wow fadeInUp" data-wow-delay="1s">
                                    <h2 class="accordion-header" id="heading25">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse25" aria-expanded="false" aria-controls="collapse25">
                                            5. Can I choose my preferred doctor?
                                        </button>
                                    </h2>
                                    <div id="collapse25" class="accordion-collapse collapse" role="region" aria-labelledby="heading25" data-bs-parent="#accordion4">
                                        <div class="accordion-body">
                                            <p>We offer a wide range of healthcare services including general consultation, diagnostic testing, emergency care, pediatric care, cardiology, orthopedic treatment, preventive health checkups,</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- FAQ Item End -->
                            </div>
                            <!-- FAQ Accordion End -->
                        </div>
                        <!-- FAQs section End -->
                    </div> 
                    <!-- Page FAQs List End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Page Faqs End -->`.replace(/\r\n/g, '\n')} />
  );
}
