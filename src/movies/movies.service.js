const db = require("../db/connection");

async function list(is_showing) {
    return db("movies")
        .select("movies.*")
        .modify((queryBuilder) => {
            if (is_showing) {
                queryBuilder
                    .join(
                        "movies_theaters",
                        "movies.movie_id",
                        "movies_theaters.movie_id"
                    )
                    .where({ "movies_theaters.is_showing": true })
                    .groupBy("movies.movie_id");
            }
        });
}

async function read(movie_id) {
    return db("movies")
        .where({ movie_id })
        .first();
}

async function getTheaters(movieId) {
    return db("theaters")
        .join("movies_theaters", "theaters.theater_id", "movies_theaters.theater_id")
        .where({ "movies_theaters.movie_id": movieId })
        .select("theaters.*");
}

async function getReviews(movieId) {
    const reviews = await db("reviews")
        .where({ movie_id: movieId })
        .join("critics", "reviews.critic_id", "critics.critic_id")
        .select(
            "reviews.*",
            "critics.preferred_name",
            "critics.surname",
            "critics.organization_name"
        );

    // Format reviews to include critic information in a nested object
    return reviews.map(review => ({
        ...review,
        critic: {
            preferred_name: review.preferred_name,
            surname: review.surname,
            organization_name: review.organization_name
        }
    }));
}

module.exports = {
    list,
    read,
    getTheaters,
    getReviews,
};
