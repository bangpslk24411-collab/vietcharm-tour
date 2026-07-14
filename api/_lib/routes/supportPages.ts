import { SupportPageModel } from '../models/SupportPage';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(SupportPageModel, 'Support page', {
  listSort: { order: 1 },
});
