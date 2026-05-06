import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from 'lucide-react';
import moment from 'moment';

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return 'N/A';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-4 sm:p-5 hover:border-slate-300/60 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={handleNavigate}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="shrink-0 w-12 h-12 bg-linear-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-inner">
          <FileText className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
        <button
          onClick={handleDelete}
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {/* Title */}
      <h3 
        className="text-lg font-bold text-slate-900 line-clamp-2 mb-1 group-hover:text-emerald-600 transition-colors" 
        title={document.title}
      >
        {document.title}
      </h3>

      {/* Document Info */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
        {document.fileSize !== undefined && (
          <>
            <span className="uppercase tracking-wider px-2 py-0.5 bg-slate-100 rounded-md text-slate-600">
              {document.fileType?.replace('.', '') || 'PDF'}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>{formatFileSize(document.fileSize)}</span>
          </>
        )}
      </div>

      {/* Stats Section */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* If your API passes arrays instead of counts, change this to: (document.flashcardCount ?? document.flashcards?.length) !== undefined */}
        {document.flashcardCount !== undefined && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 rounded-lg">
            <BookOpen className="w-3.5 h-3.5 text-purple-600" strokeWidth={2} />
            <span className="text-xs font-semibold text-purple-700">{document.flashcardCount} Flashcards</span>
          </div>
        )}
        
        {document.quizCount !== undefined && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-lg">
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
            <span className="text-xs font-semibold text-emerald-700">{document.quizCount} Quizzes</span>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Uploaded {moment(document.createdAt).fromNow()}</span>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 pointer-events-none transition-colors duration-300"></div>
    </div>
  );
};

export default DocumentCard;
