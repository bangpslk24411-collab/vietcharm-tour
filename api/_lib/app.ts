import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createItinerary, getFallbackItinerary } from './itinerary';

// Travel catalogue (reference data)
import provincesRouter from './routes/provinces';
import attractionsRouter from './routes/attractions';
import hotelsRouter from './routes/hotels';
import activitiesRouter from './routes/activities';
import vehiclesRouter from './routes/vehicles';
import touristLocationsRouter from './routes/touristLocations';
import tourCombosRouter from './routes/tourCombos';
import nearbyPlacesRouter from './routes/nearbyPlaces';

// Content pages
import handbookEntriesRouter from './routes/handbookEntries';
import supportPagesRouter from './routes/supportPages';

// Accounts, orders & payments
import usersRouter from './routes/users';
import bookingsRouter from './routes/bookings';
import transactionsRouter from './routes/transactions';
import vouchersRouter from './routes/vouchers';

// Community & support
import reviewsRouter from './routes/reviews';
import serviceReviewsRouter from './routes/serviceReviews';
import complaintsRouter from './routes/complaints';
import partnershipsRouter from './routes/partnerships';
import tripRoomsRouter from './routes/tripRooms';

/** Shared Express app mounted by both `server.ts` (standalone) and `api/[...catchall].ts` (Vercel). */
export const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

// ── Travel catalogue (reference data) ────────────────────────────────
app.use('/api/provinces', provincesRouter);
app.use('/api/attractions', attractionsRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/tourist-locations', touristLocationsRouter);
app.use('/api/tour-combos', tourCombosRouter);
app.use('/api/nearby-places', nearbyPlacesRouter);

// ── Content pages ────────────────────────────────────────────────────
app.use('/api/handbook-entries', handbookEntriesRouter);
app.use('/api/support-pages', supportPagesRouter);

// ── Accounts, orders & payments ──────────────────────────────────────
app.use('/api/users', usersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/vouchers', vouchersRouter);

// ── Community & support ──────────────────────────────────────────────
app.use('/api/reviews', reviewsRouter);
app.use('/api/service-reviews', serviceReviewsRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/partnerships', partnershipsRouter);
app.use('/api/trip-rooms', tripRoomsRouter);

// ── Rule-based trip planner ──────────────────────────────────────────
app.post('/api/itinerary', async (req, res) => {
  const { province = 'quang-nam', budget = 3000000, language = 'vi' } = req.body ?? {};

  try {
    return res.json(await createItinerary(req.body ?? {}));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server Internal Error';
    return res.status(500).json({
      success: false,
      message,
      fallback: getFallbackItinerary(province, Number(budget), language),
    });
  }
});
