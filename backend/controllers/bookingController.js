import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';

// @desc    Create a new booking (Seat Booking Logic)
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
    const { showId, seatsRequested } = req.body;

    if (!showId || !seatsRequested || seatsRequested.length === 0) {
        res.status(400);
        throw new Error('No seats requested or show ID missing');
    }

    // Step 1: Find the show and check if it exists
    const show = await Show.findById(showId);
    if (!show) {
        res.status(404);
        throw new Error('Show not found');
    }

    // Step 2: Validate requested seats existence in the show document
    const showSeatNumbers = show.seats.map(seat => seat.seatNumber);
    const invalidSeats = seatsRequested.filter(seat => !showSeatNumbers.includes(seat));
    if (invalidSeats.length > 0) {
        res.status(400);
        throw new Error(`Invalid seats requested: ${invalidSeats.join(', ')}`);
    }

    // Step 3: Concurrency-Safe Update using Atomic Operations
    // We update the show document only if ALL requested seats are CURRENTLY unbooked.
    // MongoDB $set using $elemMatch or positional operators can be tricky for multiple elements.
    // Instead, we will use arrayFilters to update the matching seats in one atomic stroke.
    
    // Create the boolean condition: "all requested seats must not be booked"
    // Wait, array filtering might still allow partial updates if we're not careful.
    // Safer approach: Use a session transaction (if replica set) OR rely on optimistic locking / atomic constraints.
    // Assuming standard MongoDB cluster (Replica Set), transactions are reliable.
    // But since `bookmyshow` DB might not have sessions configured in standard free tiers sometimes, 
    // we can use a targeted `updateOne` with strict match condition:

    // 1. Double check before lock (reads current state)
    let seatsAvailable = true;
    show.seats.forEach(seat => {
        if (seatsRequested.includes(seat.seatNumber) && seat.isBooked) {
            seatsAvailable = false;
        }
    });

    if (!seatsAvailable) {
        res.status(400);
        throw new Error('One or more of the requested seats are already booked');
    }

    // 2. Perform Atomic update with arrayFilters
    // Query requires the document ID, and we can add a check that 'isBooked: false' for all seatsRequested 
    // stringing it in the query condition:
    
    const queryConditions = {
        _id: showId,
        // Ensure that none of the requested seats are already booked in the DB right before we update.
        seats: {
            $not: {
                $elemMatch: { seatNumber: { $in: seatsRequested }, isBooked: true }
            }
        }
    };

    const updateDocument = {
        $set: { "seats.$[elem].isBooked": true }
    };

    // We configure arrayFilters to match the elements we want to set
    const options = {
        arrayFilters: [{ "elem.seatNumber": { $in: seatsRequested } }],
        new: true,
        runValidators: true
    };

    const updatedShow = await Show.findOneAndUpdate(queryConditions, updateDocument, options);

    if (!updatedShow) {
        // If findOneAndUpdate returns null, it means the query condition failed (i.e. a seat was booked in the split second between our read and write).
        res.status(409); // Conflict
        throw new Error('Booking failed. The seats were modified by another user. Please try again.');
    }

    const totalAmount = show.ticketPrice * seatsRequested.length;

    const booking = new Booking({
        user: req.user._id,
        show: showId,
        seatsBooked: seatsRequested,
        totalAmount
    });

    const createdBooking = await booking.save();
    
    res.status(201).json(createdBooking);
});

// @desc    Get user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getUserBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate({
            path: 'show',
            populate: { path: 'movie', select: 'title posterUrl' }
        });
    
    res.json(bookings);
});
