import CaseStudy from '@/models/CaseStudy';
import { makeItemHandlers } from '@/lib/crudFactory';
const { GET, PATCH, DELETE } = makeItemHandlers(CaseStudy, 'case_studies');
export { GET, PATCH, DELETE };
