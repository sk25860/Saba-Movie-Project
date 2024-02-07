import express from 'express';
import * as controller from '../controllers/mainController.js';

const router = express.Router();

router.get('/', controller.loadPage);
router.post('/search', controller.displayMovieDetails);
router.post('/watched', controller.saveMovie);
router.post('/watch', controller.watchMovie);
router.post('/delete', controller.deleteWatchedMovie);
router.post('/sort', controller.sortMoviesByRating);
router.get('/sortWatched', controller.sortWatchedMovies);
router.get('/movie/details/:id', controller.showMovieDetails);


// Export the router
export default router;