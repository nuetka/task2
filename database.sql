DROP DATABASE if EXISTS films;

CREATE DATABASE films;

CREATE TABLE film(
    film_id SERIAL PRIMARY KEY,
    film_name text NOT NULL,
    film_year int NOT NULL
);

CREATE TABLE genre(
    genre_id SERIAL PRIMARY KEY,
    genre_name varchar(32) NOT NULL
);

CREATE TABLE film_genre(
    film_id int REFERENCES film(film_id),
    genre_id int REFERENCES genre(genre_id),

    CONSTRAINT film_genre_pkey PRIMARY KEY (film_id, genre_id)
);