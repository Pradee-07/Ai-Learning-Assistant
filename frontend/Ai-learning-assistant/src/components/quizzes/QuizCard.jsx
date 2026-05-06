import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Award, BarChart2, Play } from 'lucide-react';
import moment from 'moment';

const QuizCard = ({ quiz, index, onDelete }) => {
  const displayLabel = `Quiz ${index + 1}`;
  const cardTitle = quiz.title ? quiz.title : `Untitled Quiz`;
  const hasAttempted = Boolean(quiz.completedAt || quiz.userAnswers?.length);
  return (
    <div className="group relative bg-white/60 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-6 flex flex-col h-full hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 min-h-64 sm:min-h-80">
      
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 z-10"
      >
        <Trash2 className="w-4 h-4" strokeWidth={2} />
      </button>

      <div className="flex flex-col h-full space-y-4">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            <span>{displayLabel}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-200">
            <Award className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
            <span className="text-emerald-700">
              {hasAttempted ? 'Attempted' : 'Not attempted'}
            </span>
          </div>

          <div>
            <h3
              className="text-base font-semibold text-slate-900 mb-1 line-clamp-2"
              title={cardTitle}
            >
              {cardTitle}
            </h3>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Created {moment(quiz.createdAt).format("MMM D, YYYY")}
            </p>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100 mt-auto">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-sm font-semibold text-slate-700">
              {quiz.questions?.length || 0}{" "}
              {quiz.questions?.length === 1 ? "Question" : "Questions"}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-2 pt-4 border-t border-slate-100">
          {quiz?.userAnswers?.length > 0 ? (
            <Link to={`/quizzes/${quiz._id}/results`}>
              <button className="group/btn w-full inline-flex items-center justify-center gap-2 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all duration-200">
                <BarChart2 className="w-4 h-4" strokeWidth={2.5} />
                View Results
              </button>
            </Link>
          ) : (
            <Link to={`/quizzes/${quiz._id}`}>
              <button className="group/btn relative w-full h-11 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl overflow-hidden transition-all duration-200 shadow-md active:scale-95 flex items-center justify-center gap-2">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" strokeWidth={2.5} />
                  Start Quiz
                </span>
                
                {/* Button Shine Animation */}
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              </button>
            </Link>
          )}
        </div>
      </div>

    </div>
  );
};

export default QuizCard;
