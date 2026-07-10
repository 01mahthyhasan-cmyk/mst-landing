import Event from '@/models/Event';
import { makeItemHandlers } from '@/lib/crudFactory';

const { GET, PATCH, DELETE } = makeItemHandlers(Event, 'events');

export { GET, PATCH, DELETE };
