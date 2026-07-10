import CaseStudy from '@/models/CaseStudy';
import { makeListCreateHandlers } from '@/lib/crudFactory';
const { GET, POST } = makeListCreateHandlers(CaseStudy, 'case_studies', {
  searchFields: ['title.en', 'title.ta', 'slug', 'client.en'],
});
export { GET, POST };
