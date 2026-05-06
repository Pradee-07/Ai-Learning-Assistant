import React, { useState, useEffect } from 'react';
import flashcardService from '../../services/flashcardService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard';
import toast from 'react-hot-toast';

const FlashcardsListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

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
          />
        ))}
      </div>
    );
  };

  return (
    <div className="pb-12">
      <PageHeader title="My Flashcards" />
      <div className="max-w-7xl mx-auto mt-6 sm:mt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default FlashcardsListPage;
