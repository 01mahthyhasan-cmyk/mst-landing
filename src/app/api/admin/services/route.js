import Service from '@/models/Service';
import { makeListCreateHandlers } from '@/lib/crudFactory';

const { GET, POST } = makeListCreateHandlers(Service, 'services', {
  searchFields: ['name.en', 'name.ta', 'slug'],
});

export { GET, POST };
