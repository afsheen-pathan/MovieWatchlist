const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, "movies.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const loadMovies = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (error) {
    return [];
  }
};

const saveMovies = (movies) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(movies, null, 2));
};

app.get("/movies", (req, res) => res.json(loadMovies()));

app.post("/movies", (req, res) => {
  const movies = loadMovies();
  const newMovie = {
    id: Date.now(),
    title: req.body.title,
    year: req.body.year,
    genre: req.body.genre,
    poster: req.body.poster,
    watched: false,
  };
  movies.push(newMovie);
  saveMovies(movies);
  res.json(newMovie);
});

app.put("/movies/:id", (req, res) => {
  let movies = loadMovies();
  movies = movies.map((movie) =>
    movie.id == req.params.id ? { ...movie, ...req.body } : movie
  );
  saveMovies(movies);
  res.json({ message: "Movie updated" });
});

app.delete("/movies/:id", (req, res) => {
  let movies = loadMovies();
  movies = movies.filter((movie) => movie.id != req.params.id);
  saveMovies(movies);
  res.json({ message: "Movie deleted" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
