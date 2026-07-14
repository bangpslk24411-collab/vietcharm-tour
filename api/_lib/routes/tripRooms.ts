import { TripRoomModel } from '../models/TripRoom';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(TripRoomModel, 'Trip room', {
  listFilters: {
    inviteCode: (value) => ({ inviteCode: value.trim().toUpperCase() }),
    memberEmail: (value) => ({ 'members.email': value }),
  },
});
