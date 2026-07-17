import SocialPost from '@/models/SocialPost';
import { makeListCreateHandlers } from '@/lib/crudFactory';

const { GET, POST } = makeListCreateHandlers(SocialPost, 'social-posts', {
  searchFields: ['influencerName', 'influencerHandle', 'caption'],
  sortField: 'displayOrder -createdAt',
});

export { GET, POST };
