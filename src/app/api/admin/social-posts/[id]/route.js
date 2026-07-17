import SocialPost from '@/models/SocialPost';
import { makeItemHandlers } from '@/lib/crudFactory';

const { GET, PATCH, DELETE } = makeItemHandlers(SocialPost, 'social-posts');

export { GET, PATCH, DELETE };
