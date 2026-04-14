import express from 'express';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import showRoutes from './routes/showRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration for Render / Vercel
// Ensure frontend can connect in production without CORS errors
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-vercel-frontend-url.vercel.app'] // Replace with actual vercel domain
        : 'http://localhost:3000', // Local React dev server
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Root route for health check
app.get('/', (req, res) => {
    res.send('BookMyShow API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
