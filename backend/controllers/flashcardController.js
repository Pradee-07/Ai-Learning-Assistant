import Flashcard from '../models/Flashcard.js';

// @desc    Get flashcards for a specific document
// @route   GET /api/flashcards/:documentId
// @access  Private
export const getFlashcards = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.find({
      userId: req.user._id,
      documentId: req.params.documentId
    })
    .populate('documentId', 'title fileName')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all flashcard sets for the user
// @route   GET /api/flashcards
// @access  Private
export const getAllFlashcardSets = async (req, res, next) => {
  try {
    const flashcardSets = await Flashcard.find({ userId: req.user._id })
      .populate('documentId', 'title') // Shows the PDF title for each set
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets
    });
  } catch (error) {
    next(error);
  }
};



// @desc    Update review stats for a single card
// @route   POST /api/flashcards/:cardId/review
// @access  Private
export const reviewFlashcard = async (req, res, next) => {
  try {
    // 1. Find the flashcard set that contains the specific card ID
    const flashcardSet = await Flashcard.findOne({
      'cards._id': req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: 'Flashcard set or card not found',
        statusCode: 404,
      });
    }

    // 2. Find the index of the specific card in the array
    const cardIndex = flashcardSet.cards.findIndex(
      (card) => card._id.toString() === req.params.cardId
    );

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Card not found in set',
        statusCode: 404,
      });
    }

    // 3. Update review info
    flashcardSet.cards[cardIndex].lastReviewed = new Date();
    flashcardSet.cards[cardIndex].reviewCount += 1;

    // 4. Save the parent document
    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: 'Flashcard reviewed successfully',
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Toggle starred status of a card
// @route   PUT /api/flashcards/:cardId/star
// @access  Private
export const toggleStarFlashcard = async (req, res, next) => {
  try {
    // 1. Find the flashcard set containing the card
    const flashcardSet = await Flashcard.findOne({ 
      "cards._id": req.params.cardId, 
      userId: req.user._id 
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: 'Flashcard set or card not found',
        statusCode: 404
      });
    }

    // 2. Find the specific card index
    const cardIndex = flashcardSet.cards.findIndex(
      card => card._id.toString() === req.params.cardId
    );

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Card not found in set',
        statusCode: 404
      });
    }

    // 3. Toggle star status
    const updatedCard = flashcardSet.cards[cardIndex];
    updatedCard.isStarred = !updatedCard.isStarred;

    // 4. Save changes
    await flashcardSet.save();

    // 5. Send response
    res.status(200).json({ 
      success: true, 
      isStarred: updatedCard.isStarred, 
      message: `Flashcard ${updatedCard.isStarred ? 'starred' : 'unstarred'} successfully`
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete a flashcard set
// @route   DELETE /api/flashcards/:id
// @access  Private
export const deleteFlashcardSet = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!flashcardSet) {
      return res.status(404).json({ 
        success: false, 
        error: 'Flashcard set not found',
        statusCode : 404
      });
    }

    await flashcardSet.deleteOne();

    res.status(200).json({ 
      success: true, 
      message: 'Flashcard set deleted'
     });
  } catch (error) {
    next(error);
  }
};