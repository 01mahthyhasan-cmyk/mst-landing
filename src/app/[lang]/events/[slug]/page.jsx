import { connectDB } from '../../../../lib/db';
import { notFound } from 'next/navigation';
import EventSingleClient from '../../../../components/EventSingleClient';

async function getEvent(slug) {
  try {
    await connectDB();
    const { default: Event } = await import('../../../../models/Event');
    const event = await Event.findOne({ slug, status: 'published' }).lean();
    return event;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: 'Event Not Found | MST Health Care' };

  const title    = lang === 'ta' ? (event.title?.ta    || event.title?.en)    : event.title?.en;
  const subtitle = lang === 'ta' ? (event.subtitle?.ta || event.subtitle?.en) : event.subtitle?.en;

  return {
    title: `${title} | MST Health Care`,
    description: subtitle || '',
    openGraph: {
      title: `${title} | MST Health Care`,
      description: subtitle || '',
      images: event.mainImage ? [{ url: event.mainImage }] : [],
    },
  };
}

export default async function EventSinglePage({ params }) {
  const { lang, slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  // Serialize lean Mongoose document for the client component
  const serialized = JSON.parse(JSON.stringify(event));

  return <EventSingleClient event={serialized} lang={lang} />;
}
