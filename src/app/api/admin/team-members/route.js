import TeamMember from '@/models/TeamMember';
import { makeListCreateHandlers } from '@/lib/crudFactory';
const { GET, POST } = makeListCreateHandlers(TeamMember, 'team_members', {
  searchFields: ['name.en', 'name.ta', 'slug', 'role.en'],
});
export { GET, POST };
