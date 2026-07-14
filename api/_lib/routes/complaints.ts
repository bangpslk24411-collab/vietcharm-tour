import { ServiceComplaintModel } from '../models/ServiceComplaint';
import { createCrudRouter } from '../crudRouter';

export default createCrudRouter(ServiceComplaintModel, 'Complaint', {
  listFilters: { userEmail: (value) => ({ userEmail: value }) },
});
