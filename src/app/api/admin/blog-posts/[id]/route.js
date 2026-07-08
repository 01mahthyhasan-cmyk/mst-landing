import BlogPost from '@/models/BlogPost';
import { makeItemHandlers } from '@/lib/crudFactory';
const { GET, PATCH, DELETE } = makeItemHandlers(BlogPost, 'blog_posts');
export { GET, PATCH, DELETE };
