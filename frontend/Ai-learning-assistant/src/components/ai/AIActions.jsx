import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb, X } from "lucide-react";
import aiService from "../../services/aiService";
import toast from "react-hot-toast";
import MarkdownRenderer from "../common/MarkdownRenderer";

const AIActions = () => {
  const { id: documentId } = useParams();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    try {
      const { summary } = await aiService.generateSummary(documentId);
      setModalTitle("Generated Summary");
      setModalContent(summary);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to generate summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!concept.trim()) {
      toast.error("Please enter a concept to explain.");
      return;
    }

    setLoadingAction("explain");
    try {
      const { explanation } = await aiService.explainConcept(
        documentId,
        concept
      );
      setModalTitle(`Explanation of "${concept}"`);
      setModalContent(explanation);
      setIsModalOpen(true);
      setConcept("");
    } catch (error) {
      toast.error("Failed to explain concept.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200/60 bg-linear-to-br from-slate-50/50 to-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                AI Assistant
              </h3>
              <p className="text-xs text-slate-500 font-medium">Powered by advanced AI</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Generate Summary */}
          <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center shadow-inner">
                    <BookOpen
                      className="w-4 h-4 text-blue-600"
                      strokeWidth={2}
                    />
                  </div>
                  <h4 className="font-semibold text-slate-900">
                    Generate Summary
                  </h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Get a concise summary of the entire document.
                </p>
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={loadingAction === "summary"}
                className="shrink-0 h-10 px-5 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-md shadow-teal-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[110px]"
              >
                {loadingAction === "summary" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Summarize"
                )}
              </button>
            </div>
          </div>

          {/* Explain Concept */}
          <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center shadow-inner">
                <Lightbulb className="w-4 h-4 text-purple-600" strokeWidth={2} />
              </div>
              <h4 className="font-semibold text-slate-900">Explain Concept</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Type any concept from the document to get a detailed AI explanation.
            </p>
            <form onSubmit={handleExplainConcept} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g., Quantum Computing"
                disabled={loadingAction === "explain"}
                className="w-full sm:flex-1 h-10 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-purple-500 focus:bg-white focus:shadow-sm"
              />
              <button
                type="submit"
                disabled={loadingAction === "explain" || !concept.trim()}
                className="w-full sm:w-auto shrink-0 h-10 px-5 bg-linear-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-md shadow-purple-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[110px]"
              >
                {loadingAction === "explain" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Explain"
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Result Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 bg-slate-50/50 shrink-0">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {modalTitle}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto prose prose-sm sm:prose-base prose-slate max-w-none">
              <MarkdownRenderer content={modalContent} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIActions;