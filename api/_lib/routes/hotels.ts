import { HotelModel } from '../models/Hotel';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(HotelModel, 'Hotel', {
  listFilters: { provinceId: (value) => ({ provinceId: value }) },
});
