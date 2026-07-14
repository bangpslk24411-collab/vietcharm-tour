import { PartnershipApplicationModel } from '../models/PartnershipApplication';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(PartnershipApplicationModel, 'Application');
