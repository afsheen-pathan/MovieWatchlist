const apiUrl = "http://localhost:5000/movies";

const fetchMovies = async () => {
  const response = await fetch(apiUrl);
  const movies = await response.json();
  document.getElementById("movieList").innerHTML = movies
    .map(
      (movie) =>
        `<div class="movie-card">
            <img src="${movie.poster}" alt="${movie.title}">
            <h3>${movie.title} (${movie.year})</h3>
            <p>Genre: ${movie.genre}</p>
            <p>Status: <strong>${
              movie.watched ? "Watched ✅" : "To Watch ⏳"
            }</strong></p>
            <button onclick="toggleWatched(${movie.id}, ${movie.watched})">
                ${movie.watched ? "Mark as To Watch ⏳" : "Mark as Watched ✅"}
            </button>
            <button onclick="editMovie(${movie.id}, '${movie.title}', ${
          movie.year
        }, '${movie.genre}', '${movie.poster}')">✏️ Edit</button>
            <button onclick="deleteMovie(${movie.id})">❌ Remove</button>
        </div>`
    )
    .join("");
};

const toggleWatched = async (id, watched) => {
  await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ watched: !watched }),
  });
  fetchMovies();
};

const editMovie = (id, title, year, genre, poster) => {
  document.getElementById("movieTitle").value = title;
  document.getElementById("movieYear").value = year;
  document.getElementById("movieGenre").value = genre;
  document.getElementById("moviePosterUrl").value = poster;
  document.getElementById("movieForm").dataset.editing = id;
  document.getElementById("submitBtn").innerText = "✏️ Update Movie";
};

document.getElementById("movieForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const movieId = document.getElementById("movieForm").dataset.editing;
  const movieData = {
    title: document.getElementById("movieTitle").value,
    year: document.getElementById("movieYear").value,
    genre: document.getElementById("movieGenre").value,
    poster: document.getElementById("moviePosterUrl").value,
    watched: false,
  };

  if (movieId) {
    await fetch(`${apiUrl}/${movieId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movieData),
    });
    document.getElementById("movieForm").dataset.editing = "";
    document.getElementById("submitBtn").innerText = "➕ Add Movie";
  } else {
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movieData),
    });
  }

  document.getElementById("movieForm").reset();
  fetchMovies();
});

const deleteMovie = async (id) => {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  fetchMovies();
};

fetchMovies();
