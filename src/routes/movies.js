const router = require('express').Router();
const movieController = require('../controllers/movieController')

router.get('/allMovies', movieController.allMovies);
router.get('/movieDetails/:imdbId', movieController.movieDetails)
router.get('/moviesByYear/:year', movieController.moviesByYear);
router.get('/moviesByGenre/:genre', movieController.moviesByGenre)

module.exports = router;