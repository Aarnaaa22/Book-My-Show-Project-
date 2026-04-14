import express from 'express';
import { createShow, getShowsByMovie, getShowById } from '../controllers/showController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, admin, createShow);

router.route('/movie/:movieId')
    .get(getShowsByMovie);

router.route('/:id')
    .get(getShowById);

export default router;
