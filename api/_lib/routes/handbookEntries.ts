import { HandbookEntryModel } from '../models/HandbookEntry';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(HandbookEntryModel, 'Handbook entry', {
  listSort: { order: 1 },
});
