import { TouristLocationModel } from '../models/TouristLocation';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(TouristLocationModel, 'Tourist location');
