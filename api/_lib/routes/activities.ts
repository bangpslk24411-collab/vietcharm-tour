import { ActivityModel } from '../models/Activity';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(ActivityModel, 'Activity', {
  listFilters: { provinceId: (value) => ({ provinceId: value }) },
});
