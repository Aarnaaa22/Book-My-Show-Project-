import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a movie title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    language: {
        type: String,
        required: [true, 'Please specify the language']
    },
    genre: {
        type: String,
        required: [true, 'Please specify the genre']
    },
    durationMinutes: {
        type: Number,
        required: [true, 'Please specify the duration in minutes']
    },
    posterUrl: {
        type: String,
        default: 'https://via.placeholder.com/300x450'
    }
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
