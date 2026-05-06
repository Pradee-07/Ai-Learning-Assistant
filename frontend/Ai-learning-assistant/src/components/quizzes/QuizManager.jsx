import React, { useState, useEffect } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import quizService from '../../services/quizService';
import aiService from '../../services/aiService';
import Spinner from '../common/Spinner';
import Modal from '../common/Modal';
import QuizCard from './QuizCard';
import EmptyState from '../common/EmptyState';

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizService.getQuizzesForDocument(documentId);
      
      let quizzesData = [];
      if (Array.isArray(response)) {
        quizzesData = response;
      } else if (response && Array.isArray(response.data)) {
        quizzesData = response.data;
      } else if (response && response.data && Array.isArray(response.data.data)) {
        quizzesData = response.data.data;
      }
      
      setQuizzes(quizzesData);
    } catch (error) {
      toast.error('Failed to fetch quizzes.');
      console.error("Fetch Quizzes Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchQuizzes();
    }
  }, [documentId]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await aiService.generateQuiz(documentId, { numQuestions });
      toast.success('Quiz generated successfully!');
      setIsGenerateModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      console.error("Quiz Generation Error Details:", error);
      
      // Look deep into the Axios error object to grab the real backend message
      const backendMessage = 
        error?.response?.data?.message || 
        error?.response?.data?.error || 
        error.message || 
        'Failed to generate quiz.';
        
      toast.error(`Generation Failed: ${backendMessage}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;
    
    setDeleting(true);
    try {
      await quizService.deleteQuiz(selectedQuiz._id);
      toast.success(`'${selectedQuiz.title || 'Quiz'}' deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedQuiz(null);
      setQuizzes(quizzes.filter(q => q._id !== selectedQuiz._id));
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error.message || 'Failed to delete quiz.';
      toast.error(backendMessage);
    } finally {
      setDeleting(false);
    }
  };

  const renderQuizContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (quizzes.length === 0) {
      return (
        <EmptyState
          title="No Quizzes Yet"
          description="Generate a quiz from your document to test your knowledge and track your progress."
          buttonText="Generate Quiz"
          onActionClick={() => setIsGenerateModalOpen(true)}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {quizzes.map((quiz, index) => (
          <QuizCard 
            key={quiz._id} 
            quiz={quiz} 
            index={index}
            onDelete={handleDeleteRequest} 
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
        
        {quizzes.length > 0 && !loading && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Your Quizzes
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'} available
              </p>
            </div>
            
            <button 
              onClick={() => setIsGenerateModalOpen(true)}
              className="group inline-flex items-center gap-2 px-5 h-11 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Generate New Quiz
            </button>
          </div>
        )}

        {renderQuizContent()}
      </div>

      {/* Generate Quiz Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => !generating && setIsGenerateModalOpen(false)}
        title="Generate New Quiz"
      >
        <form onSubmit={handleGenerateQuiz}>
          <div className="p-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Number of Questions
              </label>
              <input
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="20"
                required
                disabled={generating}
                className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-sm"
              />
              <p className="text-xs text-slate-500">
                Choose how many questions you want the AI to generate based on the document's content (Max 20).
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/50 border-t border-slate-200/60 rounded-b-3xl">
            <button
              type="button"
              onClick={() => setIsGenerateModalOpen(false)}
              disabled={generating}
              className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={generating}
              className="px-5 h-11 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" strokeWidth={2} />
                  Generate Quiz
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !deleting && setIsDeleteModalOpen(false)}
        title="Confirm Delete Quiz"
      >
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-6">
            Are you sure you want to delete the quiz:{' '}
            <span className="font-semibold text-slate-900">
              {selectedQuiz?.title || 'Quiz'}
            </span>? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
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

export default QuizManager;
