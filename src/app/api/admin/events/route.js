import Event from '@/models/Event';
import { makeListCreateHandlers } from '@/lib/crudFactory';

const { GET, POST } = makeListCreateHandlers(Event, 'events', {
  sortField: '-postedDate',
  searchFields: ['title.en', 'title.ta', 'slug', 'subtitle.en'],
});

export { GET, POST };
