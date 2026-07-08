import TeamMember from '@/models/TeamMember';
import { makeItemHandlers } from '@/lib/crudFactory';
const { GET, PATCH, DELETE } = makeItemHandlers(TeamMember, 'team_members');
export { GET, PATCH, DELETE };
