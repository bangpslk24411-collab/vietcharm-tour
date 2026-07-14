import { ServiceReviewModel } from '../models/ServiceReview';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(ServiceReviewModel, 'Review', {
  listFilters: {
    itemId: (value) => ({ itemId: value }),
    userEmail: (value) => ({ userEmail: value }),
  },
});
