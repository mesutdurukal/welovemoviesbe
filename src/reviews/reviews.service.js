const db = require("../db/connection");

const tableName = "reviews";

async function destroy(reviewId) {
  const count = await db(tableName)
      .where({ review_id: reviewId })
      .del();

  if (count === 0) {
    throw { status: 404, message: `Review with ID ${reviewId} cannot be found.` };
  }
}

async function list() {
  return db(tableName)
      .select("*")
      .then(reviews => Promise.all(reviews.map(setCritic)));
}

async function read(reviewId) {
  const review = await db(tableName)
      .where({ review_id: reviewId })
      .first();

  if (review) {
    return setCritic(review);
  } else {
    throw { status: 404, message: `Review with ID ${reviewId} cannot be found.` };
  }
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  if (review && review.critic_id) {
    review.critic = await readCritic(review.critic_id);
  } else {
    review.critic = null; // Handle case where critic_id is missing or undefined
  }
  return review;
}

async function update(reviewId, updatedReview) {
  const count = await db(tableName)
      .where({ review_id: reviewId })
      .update(updatedReview, "*");

  if (count === 0) {
    throw { status: 404, message: `Review with ID ${reviewId} cannot be found.` };
  }

  return read(reviewId);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
