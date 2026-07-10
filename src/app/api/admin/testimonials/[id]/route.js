import Testimonial from '@/models/Testimonial';
import { makeItemHandlers } from '@/lib/crudFactory';
const { GET, PATCH, DELETE } = makeItemHandlers(Testimonial, 'testimonials');
export { GET, PATCH, DELETE };
