import HtmlContent from '../../../components/HtmlContent';
import { getDictionary } from '../../../lib/getDictionary';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.faqsPage.metaTitle };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.faqsPage;
  const s = t.sections;
  const sb = t.sidebar;

  const sectionKeys = ['general', 'appointment', 'services', 'payments', 'emergency'];
  const accordionBaseIds = [0, 5, 10, 15, 20];
  const prefix = lang === 'en' ? '/en' : '';

  return (
    <HtmlContent html={`<!-- Page Header Section Start -->
    <div class="page-header dark-section parallaxie">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="page-header-box">
                        <h1 class="text-anime-style-3" data-cursor="-opaque">${t.heading}</h1>
                        <nav class="wow fadeInUp">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="${prefix}/">${t.breadcrumb.home}</a></li>
                                <li class="breadcrumb-item active" aria-current="page">${t.breadcrumb.current}</li>
                            </ol>
                        </nav>
                    </div>
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
                    <div class="page-single-sidebar">
                        <div class="page-category-list wow fadeInUp">
                            <ul>
                                ${sectionKeys.map((key, i) => `<li><a href="#faq_${i + 1}">${sb.categories[key]}</a></li>`).join('')}
                            </ul>
                        </div>
                        <div class="sidebar-cta-box dark-section wow fadeInUp" data-wow-delay="0.25s">
                            <div class="sidebar-cta-header">
                                <div class="icon-box"><i class="fa-regular fa-clock"></i></div>
                                <div class="sidebar-cta-title"><h2>${sb.scheduleHeading}</h2></div>
                            </div>
                            <div class="sidebar-cta-body">
                                <div class="sidebar-cta-list">
                                    <ul><li><span>${sb.scheduleLabel}</span>${sb.scheduleHours}</li></ul>
                                </div>
                                <div class="sidebar-cta-btn">
                                    <a href="${prefix}/book-appointment" class="btn-default btn-highlighted">${sb.bookButton}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-8">
                    <div class="page-faqs-list">
                        ${sectionKeys.map((skey, si) => {
                          const section = s[skey];
                          const baseId = accordionBaseIds[si];
                          const accordionId = `accordion${si > 0 ? si : ''}`;
                          const qKeys = ['q1', 'q2', 'q3', 'q4', 'q5'];
                          return `
                        <div class="page-single-faqs" id="faq_${si + 1}">
                            <div class="section-title">
                                <h2 class="wow fadeInUp" data-cursor="-opaque">${section.heading}</h2>
                            </div>
                            <div class="faq-accordion our-faq-accordion" id="${accordionId}">
                                ${qKeys.map((qkey, qi) => {
                                  const itemId = baseId + qi + 1;
                                  const isOpen = qi === 2;
                                  return `
                                <div class="accordion-item wow fadeInUp" data-wow-delay="${(qi * 0.2).toFixed(1)}s">
                                    <h2 class="accordion-header" id="heading${itemId}">
                                        <button class="accordion-button${isOpen ? '' : ' collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${itemId}" aria-expanded="${isOpen}" aria-controls="collapse${itemId}">
                                            ${section.items[qkey].question}
                                        </button>
                                    </h2>
                                    <div id="collapse${itemId}" class="accordion-collapse collapse${isOpen ? ' show' : ''}" role="region" aria-labelledby="heading${itemId}" data-bs-parent="#${accordionId}">
                                        <div class="accordion-body"><p>${section.items[qkey].answer}</p></div>
                                    </div>
                                </div>`;
                                }).join('')}
                            </div>
                        </div>`;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Page Faqs End -->`} />
  );
}
