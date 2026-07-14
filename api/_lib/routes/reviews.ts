import { ReviewModel } from '../models/Review';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(ReviewModel, 'Review');
