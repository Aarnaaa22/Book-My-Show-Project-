// ============================================================
// COMPONENT: MovieList.js
// CONCEPTS DEMONSTRATED:
//   - useEffect: simulate fetching movie data (shimmer/loading state)
//   - useState: store movie list + loading flag locally
//   - Conditional Rendering: shimmer skeleton while loading
//   - Event Handling: search input, genre filter buttons
//   - Props: passes movie object down to MovieCard
// ============================================================

import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";

// ============================================================
// MOVIE DATA — each movie now has a real poster image URL
// Posters are sourced from TMDB (themoviedb.org) public image CDN
// Fallback emoji is kept in case the image fails to load
// ============================================================
const MOVIES_DATA = [
  {
    id: 1,
    title: "Kalki 2898 AD",
    genre: "Sci-Fi",
    language: "Telugu",
    duration: "3h 1m",
    rating: "8.4",
    price: 250,
    poster: "🚀",
    // Real TMDB poster URL for Kalki 2898 AD
    image: "https://images.indianexpress.com/2024/06/kalki-2898-ad-day-3-collection-1600.jpeg",
    description: "A futuristic sci-fi epic blending mythology with technology in 2898 AD.",
  },
  {
    id: 2,
    title: "Stree 2",
    genre: "Horror-Comedy",
    language: "Hindi",
    duration: "2h 15m",
    rating: "8.8",
    price: 200,
    poster: "👻",
    // Real TMDB poster URL for Stree 2
    image: "https://st1.latestly.com/wp-content/uploads/2023/04/1-1-13.jpg",
    description: "The legendary Stree returns to haunt Chanderi once again!",
  },
  {
    id: 3,
    title: "Pushpa 2: The Rule",
    genre: "Action",
    language: "Telugu",
    duration: "3h 20m",
    rating: "7.9",
    price: 300,
    poster: "🔥",
    // Real TMDB poster URL for Pushpa 2
    image: "https://i.ytimg.com/vi/R-sXCEmoynw/maxresdefault.jpg",
    description: "Pushpa Raj returns stronger and more defiant than ever.",
  },
  {
    id: 4,
    title: "Devara",
    genre: "Thriller",
    language: "Telugu",
    duration: "2h 50m",
    rating: "7.5",
    price: 220,
    poster: "🌊",
    // Real TMDB poster URL for Devara
    image: "https://nri.connectmyindia.com/movies/images/2024/devara-hd-images.jpg",
    description: "A fearless man and his legacy of power on the high seas.",
  },
  {
    id: 5,
    title: "Vettaiyan",
    genre: "Action",
    language: "Tamil",
    duration: "2h 30m",
    rating: "7.2",
    price: 180,
    poster: "🦅",
    // Real TMDB poster URL for Vettaiyan
    image: "https://www.koimoi.com/wp-content/new-galleries/2024/10/check-out-our-trailer-review-for-the-rajinikanth-starrer-vettaiyan-01.jpg",
    description: "A veteran cop takes on a dangerous mission to protect the innocent.",
  },
  {
    id: 6,
    title: "Singham Again",
    genre: "Action",
    language: "Hindi",
    duration: "2h 40m",
    rating: "6.8",
    price: 190,
    poster: "🦁",
    // Real TMDB poster URL for Singham Again
    image: "https://stat5.bollywoodhungama.in/wp-content/uploads/2025/03/World-Television-Premiere-of-Singham-620.jpg",
    description: "The fearless cop is back in an all-out action blockbuster.",
  },
];

const MovieList = () => {
  // useState: local state for movies list and loading indicator
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  // useEffect: simulate an API call to fetch movies
  // Runs once when the component mounts (empty dependency array [])
  useEffect(() => {
    console.log("useEffect: Simulating movie data fetch...");

    // Simulate network delay — like a real API call
    const timer = setTimeout(() => {
      setMovies(MOVIES_DATA);
      setLoading(false);
      console.log("useEffect: Movies loaded!", MOVIES_DATA.length, "movies");
    }, 1000);

    // Cleanup: cancel timer if component unmounts before it fires
    return () => clearTimeout(timer);
  }, []); // [] = run only once on mount

  // Derive unique genres for filter buttons
  const genres = ["All", ...new Set(MOVIES_DATA.map((m) => m.genre))];

  // Filter movies based on search query and selected genre
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // ---- CONDITIONAL RENDERING: Shimmer Skeleton Loading ----
  // Shows animated placeholder cards while movies are loading
  if (loading) {
    return (
      <section className="movie-list-section">
        <div className="section-header">
          <h2 className="section-title">🎥 Now Showing</h2>
        </div>
        {/* Shimmer skeleton grid — shows 6 fake cards while loading */}
        <div className="movies-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="movie-card shimmer-card">
              <div className="shimmer shimmer-poster" />
              <div className="movie-info">
                <div className="shimmer shimmer-title" />
                <div className="shimmer shimmer-text" />
                <div className="shimmer shimmer-text shimmer-text--short" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="movie-list-section">
      <div className="section-header">
        <h2 className="section-title">🎥 Now Showing</h2>
        <p className="section-subtitle">{movies.length} movies available</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="filter-controls">
        {/* Event Handling: search input onChange */}
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="genre-filters">
          {genres.map((genre) => (
            // Event Handling: genre filter button onClick
            <button
              key={genre}
              className={`genre-btn ${selectedGenre === genre ? "active" : ""}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Rendering: no results found */}
      {filteredMovies.length === 0 ? (
        <div className="no-results">
          <p>😕 No movies found for "{searchQuery}"</p>
        </div>
      ) : (
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            // Props: pass full movie object (including image URL) to MovieCard
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieList;