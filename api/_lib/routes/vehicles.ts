import { VehicleModel } from '../models/Vehicle';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(VehicleModel, 'Vehicle');
