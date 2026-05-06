import express from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  updateDocument,
} from '../controllers/documentController.js';
import protect from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

// All routes are protected - User must be logged in
router.use(protect);

// Upload a new document (PDF)
// 'file' must match the key used in your Postman form-data or React Frontend
router.post('/upload', upload.single('file'), uploadDocument);

// Get all documents for the logged-in user
router.get('/', getDocuments);

// Get a single document by its MongoDB ID
router.get('/:id', getDocument);

// Delete a document by its ID
router.delete('/:id', deleteDocument);

// Update document metadata (like title) by its ID
router.put('/:id', updateDocument);

export default router;