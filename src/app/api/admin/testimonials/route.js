import Testimonial from '@/models/Testimonial';
import { makeListCreateHandlers } from '@/lib/crudFactory';
const { GET, POST } = makeListCreateHandlers(Testimonial, 'testimonials', {
  searchFields: ['authorName.en', 'authorName.ta', 'quote.en'],
});
export { GET, POST };
