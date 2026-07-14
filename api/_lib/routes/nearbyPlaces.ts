import { NearbyPlaceModel } from '../models/NearbyPlace';
import { createCrudRouter } from '../crudRouter';

const router = createCrudRouter(NearbyPlaceModel, 'Nearby place', { listSort: { order: 1 } });

/** Appends a review and folds its rating into the place's running average. */
router.post('/:id/reviews', async (req, res) => {
  try {
    const review = req.body ?? {};
    if (!review.id || !review.author?.trim() || !review.comment?.trim()) {
      return res.status(400).json({ message: 'id, author and comment are required' });
    }
    const place = await NearbyPlaceModel.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Nearby place not found' });

    const previousReviewCount = place.totalReviews;
    const previousRatingTotal = place.rating * previousReviewCount;
    place.reviews.unshift(review);
    place.totalReviews = previousReviewCount + 1;
    place.rating = Number(
      ((previousRatingTotal + Number(review.rating)) / place.totalReviews).toFixed(1),
    );
    await place.save();
    res.status(201).json(place);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Bad Request' });
  }
});

export default router;
