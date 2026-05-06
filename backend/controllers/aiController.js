import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from '../utils/textChunker.js';

// @desc    Generate flashcards from document
// @route   POST /api/ai/generate-flashcards
// @access  Private
export const generateFlashcards = async (req, res, next) => {
    try {
        const { documentId, count = 10 } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide documentId',
                statusCode: 400
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statusCode: 404
            });
        }

        // Generate flashcards using Gemini
        const cards = await geminiService.generateFlashcards(
            document.extractedText,
            parseInt(count)
        );

        // Save to database
        const flashcardSet = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount: 0,
                isStarred: false
            }))
        });

        res.status(201).json({
            success: true,
            data: flashcardSet,
            message: 'Flashcards generated successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Generate quiz from document
 * @route   POST /api/ai/generate-quiz
 * @access  Private
 */
export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 5, title } = req.body;

    // 1. Validation: Ensure documentId is provided
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400
      });
    }

    // 2. Find the document and verify ownership/status
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404
      });
    }

    // 3. Generate quiz using Gemini service
    const questions = await geminiService.generateQuiz(
      document.extractedText,
      parseInt(numQuestions)
    );

    // 4. Save the generated quiz to the database
    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title} - Quiz`,
      questions: questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0
    });

    // 5. Send success response
    res.status(201).json({
      success: true,
      data: quiz,
      message: 'Quiz generated successfully'
    });

  } catch (error) {
    // Pass any errors to the global error handler middleware
    next(error);
  }
};

/**
 * @desc    Generate document summary
 * @route   POST /api/ai/generate-summary
 * @access  Private
 */
export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    // 1. Validation: Ensure documentId is present in the request
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400
      });
    }

    // 2. Database Lookup: Find the specific document for the logged-in user
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    // 3. Error Handling: If document doesn't exist or isn't processed yet
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404
      });
    }

    // 4. AI Generation: Call Gemini service to summarize the text
    const summary = await geminiService.generateSummary(document.extractedText);

    // 5. Success Response: Return the summary and document metadata
    res.status(200).json({
      success: true,
      data: {
        documentId: document._id,
        title: document.title,
        summary
      },
      message: 'Summary generated successfully'
    });

  } catch (error) {
    // Pass errors to the central error handling middleware
    next(error);
  }
};

/**
 * @desc    Chat with document
 * @route   POST /api/ai/chat
 * @access  Private
 */
export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    // 1. Validation: Ensure required fields are present
    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId and question',
        statusCode: 400
      });
    }

    // 2. Database Lookup: Find document and verify status
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404
      });
    }

    // 3. Context Retrieval: Find top 3 relevant chunks from the document
    const relevantChunks = findRelevantChunks(document.chunks, question, 3);
    const chunkIndices = relevantChunks.map(c => c.chunkIndex);

    // 4. History Management: Get or create the chat history session
    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user._id,
        documentId: document._id,
        messages: []
      });
    }

    // 5. AI Generation: Call Gemini with the question and retrieved context
    const answer = await geminiService.chatWithContext(question, relevantChunks);

    // 6. Save Conversation: Push both user and assistant messages to history
    chatHistory.messages.push(
      {
        role: 'user',
        content: question,
        timestamp: new Date(),
        relevantChunks: []
      },
      {
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
        relevantChunks: chunkIndices
      }
    );

    await chatHistory.save();

    // 7. Success Response
    res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistory._id
      },
      message: 'Response generated successfully'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Explain concept from document
 * @route   POST /api/ai/explain-concept
 * @access  Private
 */
export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;

    // 1. Validation: Check for required fields
    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId and concept',
        statusCode: 400
      });
    }

    // 2. Database Lookup: Find the specific document for the user
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404
      });
    }

    // 3. Context Retrieval: Find relevant chunks for the specific concept
    const relevantChunks = findRelevantChunks(document.chunks, concept, 3);
    const context = relevantChunks.map(c => c.content).join('\n\n');

    // 4. AI Generation: Request explanation from Gemini service
    const explanation = await geminiService.explainConcept(concept, context);

    // 5. Success Response
    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map(c => c.chunkIndex)
      },
      message: 'Explanation generated successfully'
    });

  } catch (error) {
    // Pass errors to the error handling middleware
    next(error);
  }
};

/**
 * @desc    Get chat history for a document
 * @route   GET /api/ai/chat-history/:documentId
 * @access  Private
 */
export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    // 1. Validation: Ensure documentId is provided in the URL params
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400
      });
    }

    // 2. Database Lookup: Find history for this specific user and document
    // We use .select('messages') to optimize the query and only pull the array
    const chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: documentId
    }).select('messages'); 

    // 3. Null Handling: If no history exists, return an empty array gracefully
    if (!chatHistory) {
      return res.status(200).json({
        success: true,
        data: [], // Return an empty array if no chat history found
        message: 'No chat history found for this document'
      });
    }

    // 4. Success Response: Return the messages array
    res.status(200).json({
      success: true,
      data: chatHistory.messages,
      message: 'Chat history retrieved successfully'
    });

  } catch (error) {
    // Pass any server errors to the global error handler
    next(error);
  }
};