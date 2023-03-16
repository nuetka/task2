const db = require('../db');
const filmGenreController = require('./filmGenreController');


    const createGenre = async (req, res) => {
        const {genre_name} = req.body;

        const newGenre = await db.query("INSERT into genre (genre_name) values ($1) RETURNING *", 
        [genre_name]);

        res.send(newGenre.rows[0]);
    }

    const getGenres = async (req, res) => {
        const id = req.params.id;
        if (id) {
            const genre = await db.query(`SELECT genre_name, array_agg(film_name) GROUP BY genre_name
            FROM genre
            LEFT JOIN film_genre ON film_genre.genre_id = genre.genre_id
            LEFT JOIN film ON film_genre.film_id = film.film_id WHERE genre.genre_id = $1`, [id]);
            res.send(genre.rows[0]);
        } else {
            const genres = await db.query(`SELECT genre_name, array_agg(film_name)
            FROM genre
            LEFT JOIN film_genre ON film_genre.genre_id = genre.genre_id
            LEFT JOIN film ON film_genre.film_id = film.film_id GROUP BY genre_name`);
            res.send(genres.rows);
        }
    }

    const updateGenre = async(req, res) => {
        const id = req.params.id;
        const {genre_name} = req.body;

        let updatedGenre;
        if (id) {
            const genre = await db.query("SELECT * FROM genre WHERE genre_id = $1", [id]);
            if (genre_name) {
                updatedGenre = await db.query('UPDATE genre SET genre_name = $1 WHERE genre_id = $2 RETURNING *', [genre_name, id]);
                res.send(updatedGenre.rows[0]);
            } else {
                res.send(genre.rows[0]);
            }
        } else {
            throw new Error('Не указан id жанра!');
        }
    }

    const deleteGenre = async (req, res) => {
        const id = req.params.id;
        if (id) {
            await filmGenreController.deleteGenreRecords(id);
            const genre = await db.query(`DELETE FROM genre WHERE genre_id = $1  RETURNING *`, [id]);
            res.send(genre.rows[0]);
        } else {
            throw new Error('Не указан id жанра!');
        }
    }


module.exports = {
    getGenres,
    createGenre,
    updateGenre,
    deleteGenre
}