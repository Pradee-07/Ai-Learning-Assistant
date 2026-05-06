import express from 'express';
import {
  getFlashcards,
  getAllFlashcardSets,
  reviewFlashcard,
  toggleStarFlashcard,
  deleteFlashcardSet,
} from '../controllers/flashcardController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// All flashcard routes require authentication
router.use(protect);

// @route   GET /api/flashcards
// @desc    Get all flashcard sets for the logged-in user
router.get('/', getAllFlashcardSets);

// @route   GET /api/flashcards/:documentId
// @desc    Get flashcards associated with a specific PDF
router.get('/:documentId', getFlashcards);

// @route   POST /api/flashcards/:cardId/review
// @desc    Increment review count and update lastReviewed date
router.post('/:cardId/review', reviewFlashcard);

// @route   PUT /api/flashcards/:cardId/star
// @desc    Toggle the 'isStarred' status of a specific card
router.put('/:cardId/star', toggleStarFlashcard);

// @route   DELETE /api/flashcards/:id
// @desc    Delete an entire flashcard set
router.delete('/:id', deleteFlashcardSet);

export default router;