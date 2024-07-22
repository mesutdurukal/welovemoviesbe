const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  const { reviewId } = request.params;
  const review = await service.read(reviewId);

  if (review) {
    response.locals.review = review;
    return next();
  }
  next({
    status: 404,
    message: `Review with ID ${reviewId} cannot be found.`,
  });
}

async function destroy(request, response) {
  await service.destroy(request.params.reviewId);
  response.sendStatus(204);
}

async function list(request, response) {
  const reviews = await service.list();
  response.json({ data: reviews });
}

async function update(request, response) {
  const { reviewId } = request.params;
  const updatedReview = await service.update(reviewId, request.body.data);
  response.json({ data: updatedReview });
}

module.exports = {
  destroy: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [asyncErrorBoundary(list)],
  update: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
