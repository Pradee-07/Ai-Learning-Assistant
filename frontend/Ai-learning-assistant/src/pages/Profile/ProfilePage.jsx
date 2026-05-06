import React, { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // User details state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Visibility toggle state
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        toast.error("Failed to fetch profile data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 1. Initial Validation when user submits the form
  const handlePreSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    // If valid, open the confirmation modal instead of hitting the API directly
    setIsConfirmModalOpen(true);
  };

  // 2. Actual API call when user confirms inside the modal
  const confirmAndChangePassword = async () => {
    setPasswordLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      
      // Clear form and close modal on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsConfirmModalOpen(false);
      
      // Reset visibility toggles
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to change password.";
      toast.error(errorMsg);
      // Optional: Close modal on error to let them try again
      setIsConfirmModalOpen(false); 
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <PageHeader title="Profile Settings" />
      
      <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          {/* User Information Display */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              User Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-neutral-400" />
                  </div>
                  <p className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900">
                    {username}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-neutral-400" />
                  </div>
                  <p className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900">
                    {email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Change Password
            </h3>
            <form onSubmit={handlePreSubmit} className="space-y-4">
              
              {/* Current Password */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-neutral-400" />
                  </div>
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="w-full h-9 pl-9 pr-10 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none transition-colors"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-neutral-400" />
                  </div>
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className="w-full h-9 pl-9 pr-10 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none transition-colors"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-neutral-400" />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="w-full h-9 pl-9 pr-10 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none transition-colors"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                {/* Regular HTML button trigger handles required attributes in form automatically */}
                <Button type="submit" disabled={passwordLoading}>
                  Change Password
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => !passwordLoading && setIsConfirmModalOpen(false)}
        title="Confirm Password Change"
      >
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Are you sure you want to update your password? You will need to use your new password the next time you log into your account.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(false)}
              disabled={passwordLoading}
              className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmAndChangePassword}
              disabled={passwordLoading}
              className="px-5 h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all duration-200 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
            >
              {passwordLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm Update"
              )}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ProfilePage;