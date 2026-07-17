import { getDictionary } from '../../../lib/getDictionary';
import ServiceSingleClient from './ServiceSingleClient';
import { Suspense } from 'react';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return { title: dict.serviceSinglePage.metaTitle, description: dict.serviceSinglePage.metaDescription };
}

export default async function ServiceSinglePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <Suspense fallback={
      <div className="preloader">
        <div className="loading-container">
          <div className="loading"></div>
          <div id="loading-icon">
            <img src="/images/mst_logo.png" alt="Loader" style={{ maxWidth: '100px', height: 'auto' }} />
          </div>
        </div>
      </div>
    }>
      <ServiceSingleClient dict={dict} lang={lang} />
    </Suspense>
  );
}
