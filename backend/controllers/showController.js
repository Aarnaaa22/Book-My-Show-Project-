import asyncHandler from 'express-async-handler';
import Show from '../models/Show.js';
import Movie from '../models/Movie.js';

// @desc    Create a show
// @route   POST /api/shows
// @access  Private/Admin
export const createShow = asyncHandler(async (req, res) => {
    const { movie, theatre, date, time, ticketPrice } = req.body;

    if (!movie || !theatre || !date || !time || !ticketPrice) {
        res.status(400);
        throw new Error('Please include all required fields for a show');
    }

    const movieExists = await Movie.findById(movie);
    if (!movieExists) {
        res.status(404);
        throw new Error('Movie not found');
    }

    // Default layout generator: 10 rows, 10 cols
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seats = [];
    rows.forEach(row => {
        for (let i = 1; i <= 10; i++) {
            seats.push({
                seatNumber: `${row}${i}`,
                isBooked: false
            });
        }
    });

    const show = new Show({
        movie,
        theatre,
        date,
        time,
        ticketPrice,
        seats
    });

    const createdShow = await show.save();
    res.status(201).json(createdShow);
});

// @desc    Get shows for a specific movie
// @route   GET /api/shows/movie/:movieId
// @access  Public
export const getShowsByMovie = asyncHandler(async (req, res) => {
    const shows = await Show.find({ movie: req.params.movieId }).populate('movie', 'title durationMinutes');
    
    if (shows) {
        res.json(shows);
    } else {
        res.status(404);
        throw new Error('Shows not found for this movie');
    }
});

// @desc    Get a single show details (including seats)
// @route   GET /api/shows/:id
// @access  Public
export const getShowById = asyncHandler(async (req, res) => {
    const show = await Show.findById(req.params.id).populate('movie', 'title durationMinutes');

    if (show) {
        res.json(show);
    } else {
        res.status(404);
        throw new Error('Show not found');
    }
});
