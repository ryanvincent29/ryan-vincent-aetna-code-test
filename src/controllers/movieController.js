const MovieGetter = require("../models/MovieGetter");
const movieGetter = new MovieGetter();
const ResponseObject = require("../models/ResponseObject");

/**
 *
 * @param {array or object} movieOrMovieList -
 * @param {string} colName - The column which is currently a stringified JSON
 * @returns -
 */
function convertColumnToJson(movieOrMovieList, colName) {
  if (movieOrMovieList.length > 0) {
    for (let i = 0; i < movieOrMovieList.length; i++) {
      let curMovie = movieOrMovieList[i];
      if (curMovie[colName] && typeof curMovie[colName] === "string") {
        curMovie[colName] = JSON.parse(curMovie[colName]);
      }
    }
  } else {
    movieOrMovieList[colName] = JSON.parse(movieOrMovieList[colName]);
  }
  return movieOrMovieList;
}

/*
* AC:

* An endpoint exists that lists all movies
* List is paginated: 50 movies per page, the page can be altered with the `page` query params
* Columns should include: imdb id, title, genres, release date, budget
* Budget is displayed in dollars
*/
exports.allMovies = async (req, res) => {
  const page = req.query.page ?? 0;
  console.info(`All movies requested for page: ${page}`);
  try {
    let movieList = await movieGetter.getAllMovies(page);
    if (movieList) {
      movieList = convertColumnToJson(movieList, "genres");
    }
    res.json(ResponseObject.getResponseJson(movieList, null, page));
  } catch (e) {
    console.error("Fatal error encountered requesting allMovies", e);
    res.status(500).send("Failed to get all movies");
  }
};

/**
* AC:

* An endpoint exists that lists the movie details for a particular movie
* Details should include: imdb id, title, description, release date, budget, runtime, average rating, genres, original language, production companies
* Budget should be displayed in dollars
* Ratings are pulled from the rating database
*/
exports.movieDetails = async (req, res) => {
  const imdbId = req.params.imdbId;
  console.info(`Movie Details requested with ID: ${imdbId}`);
  try {
    let movieDetails = await movieGetter.getMovieDetails(imdbId);
    if (movieDetails && movieDetails.imdbId) {
      movieDetails = convertColumnToJson(movieDetails, "genres");
      movieDetails = convertColumnToJson(movieDetails, "productionCompanies");
    }
    if (movieDetails.imdbId) {
      res.json(ResponseObject.getResponseJson([movieDetails], null, 0));
    } else {
      res.json(ResponseObject.getResponseJson([], null, 0));
    }
  } catch (e) {
    console.error("Fatal error encountered requesting movieDetails", e);
    res.status(500).send("Failed to get movie details");
  }
};

/**
* AC:

* An endpoint exists that will list all movies from a particular year 
* List is paginated: 50 movies per page, the page can be altered with the `page` query params
* List is sorted by date in chronological order
* Sort order can be descending
* Columns include: imdb id, title, genres, release date, budget
*/
exports.moviesByYear = async (req, res) => {
  const page = req.query.page ?? 0;
  const year = req.params.year;
  console.info(`Movies by year requested with Year: ${year} and page: ${page}`);
  try {
    let movieList = await movieGetter.getMoviesByYear(year, page);
    if (movieList && movieList.length) {
      movieList = convertColumnToJson(movieList, "genres");
    }
    res.json(ResponseObject.getResponseJson(movieList, null, page));
  } catch (e) {
    console.error("Fatal error encountered requesting movies by year", e);
    res
      .status(500)
      .json(
        ResponseObject.getResponseJson(
          null,
          "Failed to get movies by year",
          null
        )
      );
  }
};

/**
* AC:

* An endpoint exists that will list all movies by a genre
* List is paginated: 50 movies per page, the page can be altered with the `page` query params
* Columns include: imdb id, title, genres, release date, budget
*/
exports.moviesByGenre = async (req, res) => {
  const page = req.query.page ?? 0;
  const genre = req.params.genre;
  console.info(
    `Movies by genre requested with genre: ${genre} and page: ${page}`
  );
  try {
    let movieList = await movieGetter.getMoviesByGenre(genre, page);
    if (movieList && movieList.length) {
      movieList = convertColumnToJson(movieList, "genres");
    }
    res.json(ResponseObject.getResponseJson(movieList, null, page));
  } catch (e) {
    console.error("Fatal error encountered requesting movies by genre", e);
    res
      .status(500)
      .json(
        ResponseObject.getResponseJson(
          null,
          "Failed to get movies by genre",
          null
        )
      );
  }
};
