import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import { LayoutDashboard, FileText, User, LogOut, BrainCircuit, BookOpen, X } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    if (loggingOut) return;
    setLoggingOut(true);
    logout();
    setIsLogoutModalOpen(false);
    toast.success('Logout successful!');
    navigate('/login');
    setLoggingOut(false);
  };

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
    { to: '/documents', icon: FileText, text: 'Documents' },
    { to: '/flashcards', icon: BookOpen, text: 'Flashcards' },
    { to: '/profile', icon: User, text: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-lg border-r border-slate-200/60 z-50 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and Close button for mobile */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-sm">
              <BrainCircuit className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
              AI Learning Assistant
            </h1>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden text-slate-500 hover:text-slate-900 p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => {
                // Only close sidebar on mobile when a link is clicked
                if (window.innerWidth < 768) {
                   toggleSidebar();
                }
              }}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    size={18}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 ${
                      isActive ? '' : 'group-hover:scale-110'
                    }`}
                  />
                  {link.text}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="px-3 py-4 border-t border-slate-200/60">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`group flex items-center justify-center gap-3 w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${loggingOut ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-red-50 hover:text-red-600'}`}
          >
            {loggingOut ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Logging out...
              </span>
            ) : (
              <>
                <LogOut
                  size={18}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:-translate-x-1"
                />
                Logout
              </>
            )}
          </button>
        </div>
      </aside>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => !loggingOut && setIsLogoutModalOpen(false)}
        title="Confirm Logout"
      >
        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to logout? You will need to sign in again to access your account.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
              disabled={loggingOut}
              className="w-full sm:w-auto px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmLogout}
              disabled={loggingOut}
              className="w-full sm:w-auto px-5 h-11 bg-linear-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/20 active:scale-95 disabled:opacity-50"
            >
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;