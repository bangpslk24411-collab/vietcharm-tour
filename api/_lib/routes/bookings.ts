import { SystemBookingModel } from '../models/SystemBooking';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(SystemBookingModel, 'Booking', {
  listFilters: { userEmail: (value) => ({ userEmail: value }) },
});
