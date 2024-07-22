const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  const { movieId } = request.params;
  const movie = await service.read(movieId);

  if (movie) {
    response.locals.movie = movie;
    return next();
  }

  next({
    status: 404,
    message: `Movie with ID ${movieId} cannot be found.`,
  });
}

async function read(request, response) {
  const { movieId } = request.params;
  const movie = await service.read(movieId);
  response.json({ data: movie });
}

async function list(request, response) {
  const { is_showing } = request.query;
  const movies = await service.list(is_showing === 'true');
  response.json({ data: movies });
}

async function theaters(request, response) {
  const { movieId } = request.params;
  const theaters = await service.getTheaters(movieId);
  response.json({ data: theaters });
}

async function reviews(request, response) {
  const { movieId } = request.params;
  const reviews = await service.getReviews(movieId);
  response.json({ data: reviews });
}

async function critics(request, response, next) {
  next({
    status: 404,
    message: `Critics not available for movie ID ${request.params.movieId}.`
  });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  theaters: [asyncErrorBoundary(movieExists), theaters],
  reviews: [asyncErrorBoundary(movieExists), reviews],
  critics: [asyncErrorBoundary(movieExists), critics],
};
