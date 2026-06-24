import HtmlContent from '../../../components/HtmlContent';
import { getDictionary } from '../../../lib/getDictionary';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.caseStudySinglePage.metaTitle };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.caseStudySinglePage;
  const common = dict.common;
  const home = lang === 'ta' ? '/' : '/en';
  const caseStudyLink = lang === 'ta' ? '/case-study' : '/en/case-study';
  const bookLink = lang === 'ta' ? '/book-appointment' : '/en/book-appointment';

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
                                <li class="breadcrumb-item"><a href="${home}">${t.breadcrumb.home}</a></li>
                                <li class="breadcrumb-item"><a href="${caseStudyLink}">${t.breadcrumb.current}</a></li>
                                <li class="breadcrumb-item active" aria-current="page">${t.heading}</li>
                            </ol>
                        </nav>
                    </div>
                    <!-- Page Header Box End -->
                </div>
            </div>
        </div>
    </div>
    <!-- Page Header Section End -->

   <!-- Page Case Study Single Start -->
    <div class="page-case-study-single">
        <div class="container">
            <div class="row">
                <div class="col-lg-4">
                    <!-- Page Single Sidebar Start -->
                    <div class="page-single-sidebar">
                        <!-- Page Category List Start -->
                        <div class="page-category-list case-study-category-list wow fadeInUp">
                            <h2 class="page-category-list-title">Case Study Information</h2>

                            <!-- Case Study Category List Start -->
                            <div class="case-study-category-item-list">
                                <!-- Case Study Category Item Start -->
                                <div class="case-study-category-item">
                                    <h2>Client:</h2>
                                    <p>Darlene Robertson</p>
                                </div>
                                <!-- Case Study Category Item End -->
                                
                                <!-- Case Study Category Item Start -->
                                <div class="case-study-category-item">   
                                    <h2>Start Date:</h2>
                                    <p>18 November, 2025</p>
                                </div>
                                <!-- Case Study Category Item End -->
                                
                                <!-- Case Study Category Item Start -->
                                <div class="case-study-category-item">
                                    <h2>Treatment Cost:</h2>
                                    <p>\$280.00</p>
                                </div>
                                <!-- Case Study Category Item End -->
                                
                                <!-- Case Study Category Item Start -->
                                <div class="case-study-category-item">
                                    <h2>Total Duration:</h2>
                                    <p>06 Month</p>
                                </div>
                                <!-- Case Study Category Item End -->
                            </div>
                            <!-- Case Study Category List End -->
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
                    <!-- Case Study Single Content Start -->
                    <div class="case-study-single-content">
                        <!-- Page Single image Start -->
                        <div class="page-single-image">
                            <figure class="image-anime reveal">
                                <img src="/images/case-study-image-1.jpg" alt="">
                            </figure>
                        </div>
                        <!-- Page Single image End -->
                        
                        <!-- Case Study Entry Start -->
                        <div class="case-study-entry">
                            <p class="wow fadeInUp">Pediatric care plays a crucial role in ensuring the healthy growth and development of children, requiring a specialized approach that combines medical expertise with compassion and understanding. This case study focuses on improving pediatric care services by addressing key challenges in patient experience, clinical efficiency, and overall quality of care. Recognizing that children have unique healthcare needs, our objective was to create an environment that not only delivers accurate medical treatment but also ensures comfort, trust, and emotional support for both young patients and their families.</p>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">The existing system faced several limitations, including extended waiting times, lack of child-friendly infrastructure, and communication gaps between healthcare providers and parents. </p>

                            <!-- Case Study Solution Start -->
                            <div class="case-study-solution">
                                <h2 class="text-anime-style-3" data-cursor="-opaque">Solutions implemented</h2>
                                <p class="wow fadeInUp">To address the identified challenges, we introduced a series of strategic improvements focused on enhancing efficiency, patient experience, and quality of care. </p>

                                <!-- Case Study Solution Item List Start -->
                                <div class="case-study-solution-item-list">
                                    <!-- Case Study Solution Item Start -->
                                    <div class="case-study-solution-item wow fadeInUp" data-wow-delay="0.2s">
                                        <div class="case-study-solution-item-image">
                                            <figure class="image-anime">
                                                <img src="/images/case-study-solution-item-image-1.jpg" alt="">
                                            </figure>
                                        </div>
                                        <div class="case-study-solution-item-content">
                                            <span>Solutions - 01</span>
                                            <h3>Conducted staff training programs focused on pediatric care best practices</h3>
                                            <ul>
                                                <li>Provided staff training in pediatric care best practices</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <!-- Case Study Solution Item End -->

                                    <!-- Case Study Solution Item Start -->
                                    <div class="case-study-solution-item wow fadeInUp" data-wow-delay="0.4s">
                                        <div class="case-study-solution-item-image">
                                            <figure class="image-anime">
                                                <img src="/images/case-study-solution-item-image-2.jpg" alt="">
                                            </figure>
                                        </div>
                                        <div class="case-study-solution-item-content">
                                            <span>Solutions - 02</span>
                                            <h3>Integrated modern diagnostic tools for faster accurate and reliable treatment</h3>
                                            <ul>
                                                <li>Optimized patient flow to improve service efficiency overall</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <!-- Case Study Solution Item End -->
                                </div>
                                <!-- Case Study Solution Item List End -->
                            </div>
                            <!-- Case Study Solution End -->
                            
                            <!-- Case Study Result Start -->
                            <div class="case-study-result">
                                <h2 class="text-anime-style-3" data-cursor="-opaque">Results achieved</h2>
                                <p class="wow fadeInUp">The implemented improvements led to significant positive outcomes in both patient care and  efficiency. Waiting times were greatly reduced, allowing children to receive timely medical attention.</p>

                                <!-- Case Study Result Body Start -->
                                <div class="case-study-result-body">
                                    <!-- Case Study Result Image Box Start -->
                                    <div class="case-study-result-image-box wow fadeInUp" data-wow-delay="0.2s">
                                        <div class="case-study-result-image">
                                            <figure>
                                                <img src="/images/case-study-result-image.jpg" alt="">
                                            </figure>
                                        </div>
                                        <div class="case-study-result-counter-item">
                                            <div class="icon-box">
                                                <img src="/images/icon-case-study-result-counter-item.svg" alt="">
                                            </div>
                                            <div class="case-study-result-counter-item-content">
                                                <h2><span class="counter">12</span>+</h2>
                                                <p>Years of Experience</p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Case Study Result Image Box End -->
                                    
                                    <!-- Case Study Result Content Start -->
                                    <div class="case-study-result-content wow fadeInUp" data-wow-delay="0.4s">
                                        <p>Additionally, the use of advanced diagnostic tools and improved workflows increased the accuracy and effectiveness of treatments.</p>
                                        <ul>
                                            <li>Reduced Patient Wait Time Significantly</li>
                                            <li>Improved Patient & Parent Satisfaction</li>
                                            <li>Better Engagement With Young Patients</li>
                                            <li>Increased Overall Efficiency In Pediatric Services</li>
                                        </ul>
                                    </div>
                                    <!-- Case Study Result Content End -->
                                </div>
                                <!-- Case Study Result Body End -->
                            </div>
                            <!-- Case Study Result End -->
                        </div>
                        <!-- Case Study Entry End -->

                        <!-- Page Single FAQs Start -->
                        <div class="page-single-faqs">
                            <!-- Section Title Start -->
                            <div class="section-title">
                                <h2 class="text-anime-style-3" data-cursor="-opaque">Frequently Asked Questions</h2>
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
                                <div class="accordion-item wow fadeInUp" data-wow-delay="0.6s">
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
                        <!-- Page Single FAQs End -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Page Case Study Single End -->`.replace(/\r\n/g, '\n')} />
  );
}
