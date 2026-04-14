import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
    seatNumber: {
        type: String,
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false
    }
});

const showSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    theatre: {
        type: String,
        required: [true, 'Please add a theatre name']
    },
    date: {
        type: Date,
        required: [true, 'Please add a show date']
    },
    time: {
        type: String,
        required: [true, 'Please add a show time (e.g. 18:30)']
    },
    ticketPrice: {
        type: Number,
        required: [true, 'Please set a ticket price']
    },
    seats: [seatSchema]
}, { timestamps: true });

// Adding an index on date/time for fast querying
showSchema.index({ date: 1, time: 1 });

const Show = mongoose.model('Show', showSchema);
export default Show;
