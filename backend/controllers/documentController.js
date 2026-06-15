import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinaryconfig.js';
import streamifier from 'streamifier';

// Upload buffer → Cloudinary
const uploadToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'ai-learning-documents',
        resource_type: 'raw',
        public_id: `${Date.now()}-${filename.split('.')[0]}`,
        type: 'upload'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('Cloudinary upload success:', result.secure_url);
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// =======================
// Upload Document
// =======================
export const uploadDocument = async (req, res, next) => {
  try {
    console.log("📤 Uploading document... FILE BUFFER:", !!req.file?.buffer);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF file'
      });
    }

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a document title'
      });
    }

    // Upload to Cloudinary
    console.log("🚀 Uploading to Cloudinary...");
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    console.log("✅ Cloudinary URL stored:", cloudinaryResult.secure_url);

    // Save in DB with Cloudinary URL
    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: cloudinaryResult.secure_url,  // ✅ Store Cloudinary URL
      cloudinaryId: cloudinaryResult.public_id, // ✅ Store for future deletion
      fileSize: req.file.size,
      status: 'processing'
    });

    console.log("💾 Document saved to DB with filePath:", document.filePath);

    // Process PDF in background
    processPDF(document._id, req.file.buffer).catch(console.error);

    res.status(201).json({
      success: true,
      data: document
    });

    
} catch (error) {
    // 🚨 ADD THIS CONSOLE.LOG TO SEE THE REAL ERROR
    console.error("🚨 UPLOAD CRASHED:", error);
    
    res.status(500).json({ 
      success: false, 
      error: error.message || "Internal Server Error",
      statusCode: 500 
    });
  }
};
//   } catch (error) {
//     console.error("❌ Upload error:", error);
//     next(error);
//   }
// };

// =======================
// Process PDF
// =======================
export const processPDF = async (documentId, pdfBuffer) => {
  try {
    console.log(`Processing PDF for document ${documentId}. Size: ${pdfBuffer?.length || 0} bytes`);

    const { text } = await extractTextFromPDF(pdfBuffer);
    const cleanText = text?.trim() || '';

    if (!cleanText) {
      throw new Error('No selectable text found in PDF. Scanned/image-only PDFs need OCR before chunking.');
    }

    const chunks = chunkText(text, 500, 50);

    if (chunks.length === 0) {
      throw new Error('PDF text was extracted, but no chunks were created.');
    }

    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks,
      status: 'ready',
      processingError: ''
    });

    console.log(`PDF processed for document ${documentId}. Chunks: ${chunks.length}`);

  } catch (error) {
    console.error(`PDF processing failed for document ${documentId}:`, error);

    await Document.findByIdAndUpdate(documentId, {
      status: 'failed',
      processingError: error.message || 'Unknown PDF processing error'
    });
  }
};

// =======================
// Get Documents
// =======================
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: documents
    });

  } catch (error) {
    next(error);
  }
};

// =======================
// Get Single Document
// =======================
export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: document
    });

  } catch (error) {
    next(error);
  }
};

// =======================
// Delete Document
// =======================
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    // Delete from Cloudinary
    if (document.cloudinaryId) {
      await cloudinary.uploader.destroy(document.cloudinaryId, {
        resource_type: 'raw'
      });
    }

    await Quiz.deleteMany({ documentId: document._id });
    await Flashcard.deleteMany({ documentId: document._id });

    await document.deleteOne();

    res.json({
      success: true,
      message: 'Deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// =======================
// Update Document
// =======================
export const updateDocument = async (req, res, next) => {
  try {
    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title: req.body.title },
      { new: true }
    );

    res.json({
      success: true,
      data: document
    });

  } catch (error) {
    next(error);
  }
};
