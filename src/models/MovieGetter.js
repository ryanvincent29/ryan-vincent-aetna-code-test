const Database = require("./Database");
const config = require("config");

class Movie {
  #db;

  constructor() {
    try {
      this.#db = new Database();
    } catch (e) {
      console.error(e);
    }
  }

  async getAllMovies(page) {
    let query = `select imdbId, title, genres, releaseDate, CONCAT('$', budget) as budget 
      from movies m order by imdbId
      limit ${config.get("api.pageSize")} offset ?`;
    return await this.#db.runQueryAll(query, [
      page * config.get("api.pageSize"),
    ]);
  }

  async getMovieDetails(imdbId) {
    let query = `select m.imdbId, m.title, m.overview as description, m.releaseDate, 
      CONCAT('$', budget) as budget, m.runtime, AVG(r.rating) as averageRating, m.genres, 
      m.language as originalLanguage, m.productionCompanies 
      from movies m join ratings.ratings r on m.movieId = r.movieId where m.imdbId = ?`;
    return await this.#db.runQuerySingle(query, [imdbId]);
  }

  async getMoviesByYear(year, page) {
    let query = `select imdbId, title, genres, releaseDate, CONCAT('$', budget) as budget
      from movies m where strftime('%Y', releaseDate) = ? order by releaseDate desc 
      limit ${config.get("api.pageSize")} offset ?`;
    return await this.#db.runQueryAll(query, [
      year,
      page * config.get("api.pageSize"),
    ]);
  }

  async getMoviesByGenre(genre, page) {
     let query = `select imdbId, title, genres, releaseDate, CONCAT('$', budget) as budget
       from movies as m, json_each(m.genres) as t where json_extract(t.value, '$.name') = ? collate nocase order by releaseDate desc 
       limit ${config.get("api.pageSize")} offset ?`;
    return await this.#db.runQueryAll(query, [
      genre,
      page * config.get("api.pageSize"),
    ]);
  }
}

/**
 * CREATE TABLE movies (
 *   movieId INTEGER PRIMARY KEY,
 *   imdbId TEXT NOT NULL,
 *   title TEXT NOT NULL,
 *   overview TEXT,
 *   productionCompanies TEXT,
 *   releaseDate TEXT,
 *   budget INTEGER,
 *   revenue INTEGER,
 *   runtime REAL,
 *   language TEXT,
 *   genres TEXT,
 *   status TEXT
 * );
 *
 * CREATE TABLE ratings (
 *   ratingId INTEGER PRIMARY KEY,
 *   userId INTEGER NOT NULL,
 *   movieId INTEGER NOT NULL,
 *   rating REAL NOT NULL,
 *   timestamp INTEGER NOT NULL
 * );
 *
 */

module.exports = Movie;
