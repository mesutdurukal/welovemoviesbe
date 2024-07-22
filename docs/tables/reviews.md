## Reviews

The `reviews` table represents a review done by a critic of a single movie. It references both a critic and a movie.

- `review_id`: (Primary Key) A unique ID for the review.
- `content`: (Text) The content of the review, written in markdown.
- `score`: (Integer) A numerical representation of the score given to the movie by the critic.
- `critic_id`: (Foreign Key) A reference ID to a particular critic.
- `movie_id`: (Foreign Key) A reference ID to a particular movie.

An example record looks like the following:

```json
{
  "review_id": 1,
  "content": "...",
  "score": 4,
  "movie_id": 1,
  "critic_id": 4,
  "created_at": "2021-02-23T20:48:13.315Z",
  "updated_at": "2021-02-23T20:48:13.315Z"
}
```

To create the `created_at` and `updated_at` fields you can use the timestamps method in your migration file (e.g. `table.timestamps(true, true);`). You can read more about timestamps [here](https://knexjs.org/#Schema-timestamps).
`
*Hint:* If you are having trouble creating the `exports.up` and `exports.down` functions, try the following code to create the table:

```js
exports.up = function (knex) {
  return knex.schema.createTable("reviews", (table) => {
    table.increments("review_id");
    table.text("content");
    table.integer("score");
    table.timestamps(true, true);

    table.integer("critic_id").unsigned().notNullable();
    table.foreign("critic_id").references("critic_id").inTable("critics");

    table.integer("movie_id").unsigned().notNullable();
    table.foreign("movie_id").references("movie_id").inTable("movies");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reviews");
};

```