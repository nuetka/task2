const Router = require('../framework/Router');
const filmController = require('../controller/filmController');

const router = new Router();


router.get('/api/film', filmController.getFilms);
router.post('/api/film', filmController.createFilm);
router.put('/api/film', filmController.updateFilm);
router.delete('/api/film', filmController.deleteFilm);


module.exports = router;