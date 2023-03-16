const db = require('../db');


    const addRecord = async (film_id, genres_id) => {
        let query = "INSERT INTO film_genre (film_id, genre_id) values ";
        for (let i = 0; i < genres_id.length; i++) {
            query += `(${film_id}, ${genres_id[i]})`;
            if (i !== genres_id.length - 1) {
                query += ","
            }
        }
        await db.query(query);
    }

    const deleteFilmRecords = async (film_id) => {
        let query = `DELETE FROM film_genre WHERE film_id = ${film_id}`;
        await db.query(query);
    }

    const deleteGenreRecords = async (genre_id) => {
        let query = `DELETE FROM film_genre WHERE genre_id = ${genre_id}`;
        await db.query(query);
    }


module.exports = {
    addRecord,
    deleteFilmRecords,
    deleteGenreRecords
}
