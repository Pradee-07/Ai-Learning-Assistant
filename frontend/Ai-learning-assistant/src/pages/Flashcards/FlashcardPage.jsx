import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import Flashcard from "../../components/flashcards/Flashcard";

const FlashcardPage = () => {
  const { id: documentId } = useParams();
  const [flashcardSets, setFlashcardSets] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardSets(response.data[0]);
      setFlashcards(response.data[0]?.cards || []);
      setCurrentCardIndex(0); // Reset index when new data loads
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcards();
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error.message || "Failed to generate flashcards.";
      toast.error(backendMessage);
    } finally {
      setGenerating(false);
    }
  };

  const handleReview = async (index) => {
    const currentCard = flashcards[index];
    if (!currentCard) return;

    try {
      // Fire silently in the background so we don't spam the user with success toasts
      await flashcardService.reviewFlashcard(currentCard._id, index);
    } catch (error) {
      console.error("Failed to review flashcard silently.", error);
    }
  };

  const handleNextCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex((prevIndex) => 
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        )
      );
      toast.success("Flashcard starred status updated!");
    } catch {
      toast.error("Failed to update star status.");
    }
  };

  const handleDeleteFlashcardSet = async () => {
    if (!flashcardSets?._id) return;
    
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(flashcardSets._id);
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchFlashcards(); // Refetch to show empty state
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  const renderFlashcardContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcards.length === 0) {
      return (
        <div className="mt-8">
          <EmptyState
            title="No Flashcards Yet"
            description="Generate flashcards from your document to start learning."
            buttonText="Generate Flashcards"
            onActionClick={handleGenerateFlashcards}
            isLoading={generating}
          />
        </div>
      );
    }

    const currentCard = flashcards[currentCardIndex];

    return (
      <div className="flex flex-col items-center space-y-6 sm:space-y-8 mt-6 sm:mt-8">
        
        {/* Flashcard Container */}
        <div className="w-full max-w-2xl perspective-1000">
          <Flashcard 
            flashcard={currentCard} 
            onToggleStar={handleToggleStar} 
          />
        </div>

        {/* Navigation Controls */}
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex sm:w-auto sm:gap-6 bg-white/80 backdrop-blur-xl border border-slate-200 px-3 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-sm">
          <button
            onClick={handlePrevCard}
            disabled={flashcards.length <= 1}
            className="group flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 h-10 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm sm:text-base font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" /> 
            <span className="hidden sm:inline">Previous</span>
          </button>
          
          <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-4 py-1.5 rounded-lg">
            {currentCardIndex + 1} / {flashcards.length}
          </span>
          
          <button
            onClick={handleNextCard}
            disabled={flashcards.length <= 1}
            className="group flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 h-10 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm sm:text-base font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-12">
      <Link
        to={`/documents/${documentId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group w-fit"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Document
      </Link>

      <div className="mt-6 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 p-4 sm:p-8">
        <PageHeader
          title="Flashcards"
          subtitle={flashcards.length > 0 ? `${flashcards.length} flashcards available` : 'Generate flashcards from your document to start learning.'}
        >
          {!loading && flashcards.length > 0 && (
            <div className="flex w-full flex-col sm:w-auto sm:flex-row items-stretch sm:items-center gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={deleting || generating}
                className="inline-flex items-center justify-center gap-2 px-4 h-11 bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                <Trash2 size={16} />
                <span>Delete Set</span>
              </button>

              <button 
                onClick={handleGenerateFlashcards} 
                disabled={generating}
                className={`inline-flex items-center justify-center gap-2 px-5 h-11 font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 ${
                  flashcards.length > 0 
                    ? 'bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20' 
                    : 'bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/25'
                }`}
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    {flashcards.length > 0 ? <Sparkles size={16} /> : <Plus size={16} strokeWidth={2.5} />}
                    {flashcards.length > 0 ? "Generate More" : "Generate Flashcards"}
                  </>
                )}
              </button>
            </div>
          )}
        </PageHeader>

        <div className="mt-6">
          {renderFlashcardContent()}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !deleting && setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <div className="p-6">
          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete all flashcards for this document? 
              This action cannot be undone and you will lose your study progress.
            </p>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteFlashcardSet}
              disabled={deleting}
              className="px-5 h-11 bg-linear-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/25 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete All
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default FlashcardPage;
