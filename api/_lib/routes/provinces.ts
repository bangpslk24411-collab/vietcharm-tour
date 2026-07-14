import { ProvinceModel } from '../models/Province';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(ProvinceModel, 'Province');
