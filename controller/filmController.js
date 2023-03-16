const db = require('../db');
const filmGenreController = require('./filmGenreController');

const getFilms = async(req, res) => {
    const id = req.params.id;
    if (id) {
        const film = await db.query(`SELECT film_name, film_year, array_agg(genre_name) GROUP BY film_name, film_year
        FROM film
        LEFT JOIN film_genre ON film_genre.film_id = film.film_id
        LEFT JOIN genre ON film_genre.genre_id = genre.genre_id WHERE film.film_id = $1`, [id]);
        res.send(film.rows[0]);// rows это массив в нём 1 элемент => возвращаем только его
    } else {
        const films = await db.query(`SELECT film_name, film_year, array_agg(genre_name) GROUP BY film_name, film_year
        FROM film
        LEFT JOIN film_genre ON film_genre.film_id = film.film_id
        LEFT JOIN genre ON film_genre.genre_id = genre.genre_id `);
        res.send(films.rows);
    }

}

const createFilm = async (req, res) => {
    const {film_name, film_year, genres_id} = req.body;
    const newFilm = await db.query("INSERT into film (film_name, film_year) values ($1, $2) RETURNING *", 
    [film_name, film_year]);

    const filmID = newFilm.rows[0].film_id;
    
    await filmGenreController.addRecord(filmID, genres_id);
    
    res.send(newFilm.rows[0]);
}

const updateFilm = async (req, res) => {
    const id = req.params.id;
    const {film_name, film_year, genres_id} = req.body;

    let updatedFilm;

    if (id) {
        const film = await db.query("SELECT * FROM film WHERE film_id = $1", [id]);

        if (film_name && film_year) {
            updatedFilm = await db.query('UPDATE film SET film_name = $1, film_year = $2 WHERE film_id = $3 RETURNING *', 
            [film_name, film_year, id]);
        } else if (film_name) {
            updatedFilm = await db.query('UPDATE film SET film_name = $1 WHERE film_id = $2 RETURNING *', [film_name, id]);
        } else if (film_year) {
            updatedFilm = await db.query('UPDATE film SET film_year = $1 WHERE film_id = $2 RETURNING *', 
            [film_year, id]);
        }    
        if (genres_id) {
            await filmGenreController.deleteFilmRecords(id);
            await filmGenreController.addRecord(id, genres_id); 
        }

        if (updatedFilm) {
            res.send(updatedFilm.rows[0]);
        } else {
            res.send(film.rows[0]);
        }
    } else {
        throw new Error('Не указан id фильма!');
    }
}


const deleteFilm = async (req, res) => {
    const id = req.params.id;
    if (id) {
        await filmGenreController.deleteFilmRecords(id);
        const film = await db.query(`DELETE FROM film WHERE film_id = $1  RETURNING *`, [id]);

        res.send(film.rows[0]);
    } else {
        throw new Error('Не указан id фильма!');
    }
}

module.exports = {
    getFilms,
    createFilm,
    updateFilm,
    deleteFilm
}