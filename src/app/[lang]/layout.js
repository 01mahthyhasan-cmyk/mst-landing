import "../globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ScriptsLoader from "../../components/ScriptsLoader";
import LanguageToggle from "../../components/LanguageToggle";
import { getDictionary } from "../../lib/getDictionary";

export const metadata = {
  title: "MST Health Care | Compassion. Care. Comfort.",
  description: "MST Health Care provides outpatient consultations, physiotherapy, laboratory services, elder care, home visits, ambulance services, and community healthcare programs in Batticaloa, Sri Lanka.",
  keywords: "MST Health Care, Batticaloa Healthcare, OPD Services, Physiotherapy, Laboratory Services, Ambulance Services, Home Visits, Elders Care, Medical Camps",
};

export default async function LocaleLayout({ children, params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
        
        <link rel="shortcut icon" type="image/x-icon" href="/images/favicon.png" />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&amp;display=swap" rel="stylesheet" />
        
        {/* Load Noto Sans Tamil for Tamil language */}
        {lang === 'ta' && (
          <>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@100..900&display=swap" rel="stylesheet" />
            <style>{`
              :root {
                --default-font: "Noto Sans Tamil", "Rethink Sans", sans-serif !important;
              }
            `}</style>
          </>
        )}

        {/* CSS stylesheets */}
        <link href="/css/bootstrap.min.css" rel="stylesheet" media="screen" />
        <link href="/css/slicknav.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="/css/swiper-bundle.min.css" />
        <link href="/css/all.min.css" rel="stylesheet" media="screen" />
        <link href="/css/animate.css" rel="stylesheet" />
        <link rel="stylesheet" href="/css/magnific-popup.css" />
        <link rel="stylesheet" href="/css/mousecursor.css" />
        <link href="/css/custom.css" rel="stylesheet" media="screen" />

        {/* JS scripts served sequentially */}
        <script src="/js/jquery-3.7.1.min.js" defer></script>
        <script src="/js/circle-progress.min.js" defer></script>
        <script src="/js/bootstrap.min.js" defer></script>
        <script src="/js/validator.min.js" defer></script>
        <script src="/js/jquery.slicknav.js" defer></script>
        <script src="/js/swiper-bundle.min.js" defer></script>
        <script src="/js/jquery.waypoints.min.js" defer></script>
        <script src="/js/jquery.counterup.min.js" defer></script>
        <script src="/js/jquery.magnific-popup.min.js" defer></script>
        <script src="/js/SmoothScroll.js" defer></script>
        <script src="/js/parallaxie.js" defer></script>
        <script src="/js/gsap.min.js" defer></script>
        <script src="/js/magiccursor.js" defer></script>
        <script src="/js/SplitText.min.js" defer></script>
        <script src="/js/ScrollTrigger.min.js" defer></script>
        <script src="/js/jquery.mb.YTPlayer.min.js" defer></script>
        <script src="/js/wow.min.js" defer></script>
        <script src="/js/function.js" defer></script>
      </head>
      <body>
        {/* Preloader Start */}
        <div className="preloader">
          <div className="loading-container">
            <div className="loading"></div>
            <div id="loading-icon">
              <img src="/images/mst_logo.png" alt="Loader" />
            </div>
          </div>
        </div>
        {/* Preloader End */}

        <LanguageToggle currentLocale={lang} />

        <Header dict={dict} locale={lang} />
        
        {children}
        
        <Footer dict={dict} locale={lang} />
        
        <ScriptsLoader />
      </body>
    </html>
  );
}
