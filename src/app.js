if (process.env.USER) require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Middleware for parsing JSON requests
app.use(express.json());

// Route handlers
app.use("/reviews", reviewsRouter);
app.use("/theaters", theatersRouter);
app.use("/movies", moviesRouter);

// 404 Not Found handler
app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
});

module.exports = app;
