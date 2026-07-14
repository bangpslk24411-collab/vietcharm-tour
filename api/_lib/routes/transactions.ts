import { TransactionModel } from '../models/Transaction';
import { createCrudRouter } from '../crudRouter';

// Payment attempts are immutable audit records (ERD "GiaoDich"): no PATCH route.
export default createCrudRouter(TransactionModel, 'Transaction', {
  listFilters: { bookingId: (value) => ({ bookingId: value }) },
  withPatch: false,
});
