import HtmlContent from '../../../components/HtmlContent';
import { getDictionary } from '../../../lib/getDictionary';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.blogPage.metaTitle };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.blogPage;
  const home = lang === 'ta' ? '/' : '/en';

  const posts = [
    { key: 'post1', img: '/images/post-1.jpg', delay: '' },
    { key: 'post2', img: '/images/post-2.jpg', delay: '0.2s' },
    { key: 'post3', img: '/images/post-3.jpg', delay: '0.4s' },
    { key: 'post4', img: '/images/post-4.jpg', delay: '0.6s' },
    { key: 'post5', img: '/images/post-5.jpg', delay: '0.8s' },
    { key: 'post6', img: '/images/post-6.jpg', delay: '1s' },
  ];

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
                                <li class="breadcrumb-item"><a href="${home}">${t.breadcrumb.home}</a></li>
                                <li class="breadcrumb-item active" aria-current="page">${t.breadcrumb.current}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Page Header Section End -->

    <!-- Page Blog Start -->
    <div class="page-blog">
        <div class="container">
            <div class="row">
                ${posts.map(({ key, img, delay }) => `
                <div class="col-xl-4 col-md-6">
                    <div class="post-item wow fadeInUp"${delay ? ` data-wow-delay="${delay}"` : ''}>
                        <div class="post-featured-image">
                            <a href="${lang === 'ta' ? '/blog-single' : '/en/blog-single'}" data-cursor-text="View">
                                <figure class="image-anime"><img src="${img}" alt=""></figure>
                            </a>
                            <div class="post-item-tags">
                                <a href="${lang === 'ta' ? '/blog-single' : '/en/blog-single'}">${t.posts[key].category}</a>
                            </div>
                        </div>
                        <div class="post-item-body">
                            <div class="post-item-content">
                                <h2><a href="${lang === 'ta' ? '/blog-single' : '/en/blog-single'}">${t.posts[key].title}</a></h2>
                            </div>
                            <div class="post-item-btn">
                                <a href="${lang === 'ta' ? '/blog-single' : '/en/blog-single'}" class="readmore-btn">${t.readMore}</a>
                            </div>
                        </div>
                    </div>
                </div>`).join('')}

                <div class="col-lg-12">
                    <div class="page-pagination wow fadeInUp" data-wow-delay="1.2s">
                        <ul class="pagination">
                            <li><a href="#"><i class="fa-solid fa-angle-left"></i></a></li>
                            <li class="active"><a href="#">1</a></li>
                            <li><a href="#">2</a></li>
                            <li><a href="#">3</a></li>
                            <li><a href="#"><i class="fa-solid fa-angle-right"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Page Blog End -->`.replace(/\r\n/g, '\n')} />
  );
}
