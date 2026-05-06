import express from 'express';
import {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory,
} from '../controllers/aiController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// All AI-related features require a logged-in user
router.use(protect);

// @route   POST /api/ai/generate-flashcards
// @desc    Extract key concepts and create flashcard sets
router.post('/generate-flashcards', generateFlashcards);

// @route   POST /api/ai/generate-quiz
// @desc    Generate a multiple-choice quiz based on document content
router.post('/generate-quiz', generateQuiz);

// @route   POST /api/ai/generate-summary
// @desc    Generate a concise summary of the PDF
router.post('/generate-summary', generateSummary);

// @route   POST /api/ai/chat
// @desc    Interactive chat with the document using RAG
router.post('/chat', chat);

// @route   POST /api/ai/explain-concept
// @desc    Targeted explanation for a specific highlighted term
router.post('/explain-concept', explainConcept);

// @route   GET /api/ai/chat-history/:documentId
// @desc    Retrieve previous conversations for a specific PDF
router.get('/chat-history/:documentId', getChatHistory);

export default router;