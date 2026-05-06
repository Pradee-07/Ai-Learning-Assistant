import express from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  updateDocument
} from '../controllers/documentController.js';

import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes protected
router.use(protect);

// ✅ Upload route
router.post('/upload', upload.single('file'), uploadDocument);

router.get('/', getDocuments);
router.get('/:id', getDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

export default router;