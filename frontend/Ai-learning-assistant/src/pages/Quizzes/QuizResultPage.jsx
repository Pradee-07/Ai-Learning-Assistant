import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, BookOpen } from 'lucide-react';

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        console.log('Quiz Results Data:', data); // Debug log
        setResults(data);
      } catch (error) {
        toast.error('Failed to fetch quiz results.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!results || !results.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600 text-lg">Quiz results not found.</p>
        </div>
      </div>
    );
  }

  const quizData = results.data.quiz;
  const detailedResults = results.data.results || [];

  if (!quizData || detailedResults.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600 text-lg">No quiz data available.</p>
        </div>
      </div>
    );
  }

  const normalizeText = (text) => String(text ?? '').trim().toLowerCase();

  const getCorrectAnswerIndex = (options, correctAnswer) => {
    if (!correctAnswer || !Array.isArray(options)) return -1;

    const correctStr = normalizeText(correctAnswer);

    // 1. Handle formats like "O1", "O2", "Option 1" (1-based indexing)
    const optionMatch = correctStr.match(/^o(?:ption)?\s*(\d+)$/i);
    if (optionMatch) {
      const num = parseInt(optionMatch[1], 10);
      if (num > 0 && num <= options.length) return num - 1;
    }

    // 2. Handle raw numeric indices like "0", "1" (0-based indexing)
    const asInt = parseInt(correctStr, 10);
    if (!isNaN(asInt) && asInt >= 0 && asInt < options.length && String(asInt) === correctStr) {
      return asInt;
    }

    // 3. Exact text match
    let idx = options.findIndex(opt => normalizeText(opt) === correctStr);
    if (idx !== -1) return idx;

    // 4. Substring text match
    idx = options.findIndex(opt => {
      const normalizedOption = normalizeText(opt);
      return normalizedOption.includes(correctStr) || correctStr.includes(normalizedOption);
    });
    if (idx !== -1) return idx;

    return -1;
  };

  const computedResults = detailedResults.map(result => {
    const correctAnswerIndex = getCorrectAnswerIndex(result.options, result.correctAnswer);
    const userAnswerIndex = getCorrectAnswerIndex(result.options, result.selectedAnswer);
    const isCorrect = correctAnswerIndex !== -1 && userAnswerIndex === correctAnswerIndex;
    return {
      ...result,
      correctAnswerIndex,
      userAnswerIndex,
      isCorrect,
    };
  });

  const totalQuestions = computedResults.length;
  const correctAnswers = computedResults.filter(r => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding! 🌟';
    if (score >= 80) return 'Great job! 🎯';
    if (score >= 70) return 'Good work! 👍';
    if (score >= 60) return 'Not bad! 📚';
    return 'Keep practicing! 💪';
  };

  const resultHeaderTitle = quizData.title ? `${quizData.title} Results` : 'Quiz Results';

  return (
    <div className="pb-12">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to={`/documents/${quizData.document._id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" strokeWidth={2} />
          Back to Document
        </Link>
      </div>

      <PageHeader title={resultHeaderTitle} />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Score Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-lg shadow-slate-200/30 p-8 sm:p-12">
          <div className="text-center space-y-6">
            
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-inner">
              <Trophy className="w-8 h-8 text-emerald-600" strokeWidth={2} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Your Score
              </p>
              <div className={`inline-block text-6xl font-black bg-linear-to-r ${getScoreColor(score)} bg-clip-text text-transparent mb-4 drop-shadow-sm`}>
                {score}%
              </div>
              <p className="text-xl font-medium text-slate-700">
                {getScoreMessage(score)}
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-slate-100">
              
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
                <Target className="w-5 h-5 text-slate-500" strokeWidth={2} />
                <span className="text-sm font-semibold text-slate-700">
                  {totalQuestions} Total
                </span>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                <span className="text-sm font-semibold text-emerald-700">
                  {correctAnswers} Correct
                </span>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl shadow-sm">
                <XCircle className="w-5 h-5 text-rose-500" strokeWidth={2} />
                <span className="text-sm font-semibold text-rose-700">
                  {incorrectAnswers} Incorrect
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-slate-600" strokeWidth={2} />
            <h3 className="text-lg font-semibold text-slate-900">Detailed Review</h3>
          </div>

          {computedResults.map((result, index) => {
            const userAnswerIndex = result.userAnswerIndex;
            const correctAnswerIndex = result.correctAnswerIndex;
            const isCorrect = result.isCorrect;

            return (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/20 mb-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    {/* Question Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg mb-3">
                      <span className="text-xs font-semibold text-slate-600">
                        Question {index + 1}
                      </span>
                    </div>
                    {/* Question Text */}
                    <h4 className="text-lg font-semibold text-slate-900 leading-relaxed">
                      {result.question}
                    </h4>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border-2 ${
                    isCorrect 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-rose-50 border-rose-200'
                  }`}>
                    {isCorrect ? (
                      <CheckCircle2 className="text-emerald-500 w-5 h-5" strokeWidth={2.5} />
                    ) : (
                      <XCircle className="text-rose-500 w-5 h-5" strokeWidth={2.5} />
                    )}
                  </div>
                </div>

                {/* Options List */}
                <div className="space-y-3 mb-4">
                  {result.options.map((option, optIndex) => {
                    const isCorrectOption = optIndex === correctAnswerIndex;
                    const isUserAnswer = optIndex === userAnswerIndex;
                    const isWrongAnswer = isUserAnswer && !isCorrectOption;

                    return (
                      <div
                        key={optIndex}
                        className={`relative px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                          isCorrectOption
                            ? 'bg-emerald-50 border-emerald-300 shadow-sm shadow-emerald-500/10'
                            : isWrongAnswer
                            ? 'bg-rose-50 border-rose-300'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className={`text-sm font-medium ${
                            isCorrectOption 
                              ? 'text-emerald-900' 
                              : isWrongAnswer 
                              ? 'text-rose-900' 
                              : 'text-slate-700'
                          }`}>
                            {option}
                          </span>

                          {/* Indicators */}
                          <div className="flex items-center gap-2 shrink-0">
                            {isCorrectOption && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 border border-emerald-200 rounded-md text-xs font-bold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                                Correct
                              </span>
                            )}
                            {isWrongAnswer && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 border border-rose-200 rounded-md text-xs font-bold text-rose-700">
                                <XCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
                                Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {result.explanation && (
                  <div className="p-4 bg-linear-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-slate-600" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                          Explanation
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {result.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <Link to={`/documents/${quizData.document._id}`}>
            <button className="group relative px-8 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" strokeWidth={2.5} />
                Return to Document
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default QuizResultPage;