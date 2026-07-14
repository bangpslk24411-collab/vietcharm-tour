import { UserModel } from '../models/User';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(UserModel, 'User');
