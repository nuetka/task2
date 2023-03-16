const Router = require('../framework/Router');
const genreController = require('../controller/genreController');

const router = new Router();


router.get('/api/genre', genreController.getGenres);
router.post('/api/genre', genreController.createGenre);
router.put('/api/genre', genreController.updateGenre);
router.delete('/api/genre', genreController.deleteGenre);

module.exports = router;