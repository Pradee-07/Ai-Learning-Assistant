import React, { useState, useEffect } from 'react';
import flashcardService from '../../services/flashcardService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard';
import toast from 'react-hot-toast';

const FlashcardsListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await flashcardService.getAllFlashcardSets();
        console.log("fetchFlashcardSets__", response.data);
        setFlashcardSets(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch flashcard sets.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSets();
  }, []);

  const handleDeleteRequest = (flashcardSet) => {
    setSelectedSet(flashcardSet);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSet) return;

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(selectedSet._id);
      toast.success('Flashcard set deleted.');
      setFlashcardSets((prevSets) => prevSets.filter((set) => set._id !== selectedSet._id));
      setSelectedSet(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error.message || 'Failed to delete flashcard set.';
      toast.error(backendMessage);
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="mt-12">
          <EmptyState
            title="No Flashcard Sets Found"
            description="You haven't generated any flashcards yet. Go to a document to create some."
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashcardSets.map((set) => (
          <FlashcardSetCard 
            key={set._id} 
            flashcardSet={set} 
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="pb-12">
        <PageHeader title="My Flashcards" />
        <div className="max-w-7xl mx-auto mt-6 sm:mt-8">
          {renderContent()}
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !deleting && setIsDeleteModalOpen(false)}
        title="Confirm Delete Flashcards"
      >
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-6">
            Are you sure you want to delete the flashcard set for{' '}
            <span className="font-semibold text-slate-900">
              {selectedSet?.documentId?.title || selectedSet?.document?.title || selectedSet?.title || 'this document'}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-5 h-11 bg-linear-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/25 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardsListPage;
