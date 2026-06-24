import HtmlContent from '../../../components/HtmlContent';
import { getDictionary } from '../../../lib/getDictionary';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.blogSinglePage.metaTitle };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.blogSinglePage;
  const b = t.body;

  return (
    <HtmlContent html={`<!-- Page Header Section Start -->
    <div class="page-header dark-section parallaxie">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="page-header-box">
                        <h1 class="text-anime-style-3" data-cursor="-opaque">${t.heading}</h1>
                        <nav class="wow fadeInUp">
                            <div class="post-single-meta wow fadeInUp">
                                <ol class="breadcrumb">
                                    <li><i class="fa-regular fa-user"></i> ${t.author}</li>
                                    <li><i class="fa-regular fa-clock"></i> ${t.date}</li>
                                </ol>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Page Header Section End -->

    <!-- Page Single Post Start -->
    <div class="page-single-post">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="post-image">
                        <figure class="image-anime reveal">
                            <img src="/images/post-2.jpg" alt="">
                        </figure>
                    </div>

                    <div class="post-content">
                        <div class="post-entry">
                            <p class="wow fadeInUp">${b.p1}</p>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">${b.p2}</p>
                            <blockquote class="wow fadeInUp" data-wow-delay="0.4s">
                                <p>${b.quote}</p>
                            </blockquote>
                            <p class="wow fadeInUp" data-wow-delay="0.6s">${b.p3}</p>
                            <h2 class="wow fadeInUp" data-wow-delay="0.8s">${b.subHeading}</h2>
                            <p class="wow fadeInUp" data-wow-delay="1s">${b.p4}</p>
                            <ul class="wow fadeInUp" data-wow-delay="1.2s">
                                <li>${b.li1}</li>
                                <li>${b.li2}</li>
                                <li>${b.li3}</li>
                                <li>${b.li4}</li>
                                <li>${b.li5}</li>
                            </ul>
                            <p class="wow fadeInUp" data-wow-delay="1.4s">${b.p5}</p>
                        </div>

                        <div class="post-tag-links">
                            <div class="row align-items-center">
                                <div class="col-lg-8">
                                    <div class="post-tags wow fadeInUp" data-wow-delay="0.5s">
                                        <span class="tag-links">
                                            ${t.tagsLabel}
                                            <a href="#">${t.tags.healthTips}</a>
                                            <a href="#">${t.tags.medicalCare}</a>
                                            <a href="#">${t.tags.wellnessGuide}</a>
                                        </span>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="post-social-sharing wow fadeInUp" data-wow-delay="0.5s">
                                        <ul>
                                            <li><a href="#"><i class="fa-brands fa-facebook-f"></i></a></li>
                                            <li><a href="#"><i class="fa-brands fa-linkedin-in"></i></a></li>
                                            <li><a href="#"><i class="fa-brands fa-instagram"></i></a></li>
                                            <li><a href="#"><i class="fa-brands fa-x-twitter"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Page Single Post End -->`.replace(/\r\n/g, '\n')} />
  );
}
