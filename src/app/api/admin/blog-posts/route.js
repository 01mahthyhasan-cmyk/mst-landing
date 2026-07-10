import BlogPost from '@/models/BlogPost';
import { makeListCreateHandlers } from '@/lib/crudFactory';
const { GET, POST } = makeListCreateHandlers(BlogPost, 'blog_posts', {
  searchFields: ['title.en', 'title.ta', 'slug', 'author.en'],
});
export { GET, POST };
