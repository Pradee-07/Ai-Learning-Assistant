import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../../components/common/Spinner';
import progressService from '../../services/progressService';
import toast from 'react-hot-toast';
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock, ArrowRight } from 'lucide-react';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        setDashboardData(data.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-200 mb-4 animate-pulse">
            <TrendingUp className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-600 font-medium">No dashboard data available.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData.overview.totalDocuments || 0,
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-400',
      shadowColor: 'shadow-blue-500/30'
    },
    {
      label: 'Total Flashcards',
      value: dashboardData.overview.totalFlashcards || 0,
      icon: BookOpen,
      gradient: 'from-purple-500 to-pink-400',
      shadowColor: 'shadow-purple-500/30'
    },
    {
      label: 'Total Quizzes',
      value: dashboardData.overview.totalQuizzes || 0,
      icon: BrainCircuit,
      gradient: 'from-emerald-500 to-teal-400',
      shadowColor: 'shadow-emerald-500/30'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 font-medium">
            Track your learning progress and activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group relative bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 p-6 flex items-center justify-between cursor-default"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {stat.label}
                </span>
                <div className="text-4xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
              </div>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-700" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Recent Activity
            </h3>
          </div>

          {(dashboardData.recentActivity && 
          ((dashboardData.recentActivity.documents && dashboardData.recentActivity.documents.length > 0) || 
           (dashboardData.recentActivity.quizzes && dashboardData.recentActivity.quizzes.length > 0))) ? (
            <div className="space-y-4">
              {[
                ...(dashboardData.recentActivity.documents || []).map(doc => ({
                  id: doc._id,
                  description: doc.title,
                  timestamp: doc.lastAccessed || doc.createdAt,
                  link: `/documents/${doc._id}`,
                  type: 'document'
                })),
                ...(dashboardData.recentActivity.quizzes || []).map(quiz => ({
                  id: quiz._id,
                  description: quiz.title || 'Document Quiz',
                  timestamp: quiz.completedAt || quiz.createdAt,
                  link: `/quizzes/${quiz._id}`,
                  type: 'quiz'
                }))
              ]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 5)
              .map((activity, index) => (
                <div 
                  key={`${activity.id}-${index}`} 
                  className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-emerald-100 hover:bg-emerald-50/50 hover:shadow-sm transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                      activity.type === 'document' 
                        ? 'bg-blue-500 shadow-blue-500/50' 
                        : 'bg-emerald-500 shadow-emerald-500/50'
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {activity.type === 'document' ? 'Accessed Document: ' : 'Attempted Quiz: '}
                        <span className="text-slate-600 font-medium">{activity.description}</span>
                      </p>
                      <p className="text-xs font-medium text-slate-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric', 
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  {activity.link && (
                    <Link 
                      to={activity.link} 
                      className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      View
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-200 border-dashed">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm mb-4">
                <Clock className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-800 font-bold mb-1">No recent activity yet.</p>
              <p className="text-sm text-slate-500 font-medium">Start learning to see your progress here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;