import Service from '@/models/Service';
import { makeItemHandlers } from '@/lib/crudFactory';
const { GET, PATCH, DELETE } = makeItemHandlers(Service, 'services');
export { GET, PATCH, DELETE };
