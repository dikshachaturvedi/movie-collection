// index.js
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// Read movies from file
function readMovies() {
  const data = fs.readFileSync('movies.json', 'utf8');
  return JSON.parse(data);
}

// Write movies to file
function writeMovies(movies) {
  fs.writeFileSync('movies.json', JSON.stringify(movies, null, 2));
}

// Get all movies
app.get('/movies', (req, res) => {
  const movies = readMovies();
  res.json(movies);
});

// Get a single movie by ID
app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movies = readMovies();
  const movie = movies.find(m => m.id === id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
});

// Create a new movie
app.post('/movies', (req, res) => {
  const newMovie = req.body;
  const movies = readMovies();
  movies.push(newMovie);
  writeMovies(movies);
  res.status(201).json({ message: 'Movie added', movie: newMovie });
});

// Update a movie by ID
app.put('/movies/:id', (req, res) => {
  const { id } = req.params;
  const updatedMovie = req.body;
  let movies = readMovies();
  movies = movies.map(movie => (movie.id === id ? updatedMovie : movie));
  writeMovies(movies);
  res.json({ message: 'Movie updated', movie: updatedMovie });
});

// Delete a movie by ID
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  let movies = readMovies();
  movies = movies.filter(movie => movie.id !== id);
  writeMovies(movies);
  res.json({ message: 'Movie deleted' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
