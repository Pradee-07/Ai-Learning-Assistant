import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js';
import fs from 'fs/promises';
import mongoose from 'mongoose';

// @desc    Upload PDF document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Please upload a PDF file',
        statusCode: 400
    });
    }

const { title } = req.body;

    // 2. Validate title
    if (!title) {
      // Delete uploaded file if no title provided to save storage
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Please provide a document title',
        statusCode: 400
      });
    }

    // 3. Construct the URL for the uploaded file
    const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

    // 4. Create document record in MongoDB
    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: fileUrl, // Store the URL instead of the local path for the frontend
      fileSize: req.file.size,
      status: 'processing'
    });

    // 5. Process PDF in background (Text extraction & Chunking)
    // In production, you would use a queue like Bull or RabbitMQ here
    processPDF(document._id, req.file.path).catch(err => {
      console.error('PDF processing error:', err);
    });

    // 6. Respond immediately to the user
    res.status(201).json({
      success: true,
      data: document,
      message: 'Document uploaded successfully. Processing in progress...'
    });

  } catch (error) {
    // Clean up file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

//helper fn

export const processPDF = async (documentId, filePath) => {
  try {
    // 1. Extract text from the PDF file
    const { text } = await extractTextFromPDF(filePath);

    // 2. Create chunks (500 words per chunk with 50-word overlap)
    const chunks = chunkText(text, 500, 50);

    // 3. Update document with extracted data and set status to 'ready'
    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: 'ready'
    });

    console.log(`Document ${documentId} processed successfully`);
  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);

    // 4. Update status to 'failed' so the frontend can show an error state
    await Document.findByIdAndUpdate(documentId, {
      status: 'failed'
    });
  }
};

// @desc    Get all user documents
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.aggregate([
      {
        // 1. Only get documents belonging to the logged-in user
        $match: { userId: new mongoose.Types.ObjectId(req.user._id) }
      },
      {
        // 2. Look up related Flashcards
        $lookup: {
          from: 'flashcards', // collection name in MongoDB
          localField: '_id',
          foreignField: 'documentId',
          as: 'flashcardSets'
        }
      },
      {
        // 3. Look up related Quizzes
        $lookup: {
          from: 'quizzes', // collection name in MongoDB
          localField: '_id',
          foreignField: 'documentId',
          as: 'quizzes'
        }
      },
      {
        // 4. Calculate the size (count) of the study material arrays
        $addFields: {
          flashcardCount: { $size: '$flashcardSets' },
          quizCount: { $size: '$quizzes' }
        }
      },
      {
        // 5. Project (Select) only needed fields to keep the response light
        $project: {
          extractedText: 0, // Exclude heavy text
          chunks: 0,        // Exclude heavy chunks
          flashcardSets: 0, // Exclude the raw flashcard data
          quizzes: 0        // Exclude the raw quiz data
        }
      },
      {
        // 6. Sort by most recent upload
        $sort: { uploadDate: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single document with chunks
// @route   GET /api/documents/:id
// @access  Private
export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json(
        { success: false, 
          error: 'Document not found',
        statusCode: 404
        });
    }

    const flashcardCount = await Flashcard.countDocuments({ documentId: document._id,userId: req.user._id});
    const quizCount = await Quiz.countDocuments({ documentId: document._id,userId: req.user._id});
    
    document.lastAccessed = Date.now();
    await document.save();

    const documentData = document.toObject();
    documentData.flashcardCount = flashcardCount;
    documentData.quizCount =quizCount;

    res.status(200).json({
      success: true,
      data: documentData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json(
        { success: false, 
          error: 'Document not found',
        statusCode: 404
        });
    }

    // 1. Delete physical file from 'uploads' folder
    await fs.unlink(document.filePath).catch(() => {});

    // 2. Delete related AI data (Quizzes and Flashcards)
    await Quiz.deleteMany({ documentId: document._id });
    await Flashcard.deleteMany({ documentId: document._id });

    // 3. Remove document record
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Document and related data deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update document title
// @route   PUT /api/documents/:id
// @access  Private
export const updateDocument = async (req, res, next) => {
  try {
    let document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    document = await Document.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};