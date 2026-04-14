import asyncHandler from 'express-async-handler';
import Movie from '../models/Movie.js';

// @desc    Fetch all movies
// @route   GET /api/movies
// @access  Public
export const getMovies = asyncHandler(async (req, res) => {
    const movies = await Movie.find({});
    res.json(movies);
});

// @desc    Create a movie
// @route   POST /api/movies
// @access  Private/Admin
export const createMovie = asyncHandler(async (req, res) => {
    const { title, description, language, genre, durationMinutes, posterUrl } = req.body;

    // Basic validation
    if (!title || !description || !language || !genre || !durationMinutes) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const movie = new Movie({
        title,
        description,
        language,
        genre,
        durationMinutes,
        posterUrl
    });

    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
});

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = asyncHandler(async (req, res) => {
    const { title, description, language, genre, durationMinutes, posterUrl } = req.body;

    const movie = await Movie.findById(req.params.id);

    if (movie) {
        movie.title = title || movie.title;
        movie.description = description || movie.description;
        movie.language = language || movie.language;
        movie.genre = genre || movie.genre;
        movie.durationMinutes = durationMinutes || movie.durationMinutes;
        movie.posterUrl = posterUrl || movie.posterUrl;

        const updatedMovie = await movie.save();
        res.json(updatedMovie);
    } else {
        res.status(404);
        throw new Error('Movie not found');
    }
});

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
        await movie.deleteOne();
        res.json({ message: 'Movie removed successfully' });
    } else {
        res.status(404);
        throw new Error('Movie not found');
    }
});
