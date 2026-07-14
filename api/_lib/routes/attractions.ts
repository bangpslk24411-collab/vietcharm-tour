import { AttractionModel } from '../models/Attraction';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(AttractionModel, 'Attraction', {
  listFilters: { provinceId: (value) => ({ provinceId: value }) },
});
