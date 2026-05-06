import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { BrainCircuit, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Call the register function
      await authService.register(username, email, password);
      
      // Show the success message and redirect to login page
      toast.success('Registration successful! Please Login.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
      toast.error(err.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 py-12">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-md px-6">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 mb-6 shadow-lg shadow-emerald-500/30">
              <BrainCircuit className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
              Create an account
            </h1>
            <p className="text-slate-500 text-sm">
              Start your AI-powered learning experience
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="p-3 bg-red-50/80 border border-red-100 rounded-xl">
                <p className="text-sm text-red-600 font-medium text-center">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Username
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  focusedField === 'username' ? 'text-emerald-500' : 'text-slate-400'
                }`}>
                  <User className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-slate-900"
                  placeholder="yourusername"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Email
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'
                }`}>
                  <Mail className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-slate-900"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Password
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  focusedField === 'password' ? 'text-emerald-500' : 'text-slate-400'
                }`}>
                  <Lock className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-12 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 outline-none text-slate-900"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 transition duration-200 ease-out hover:text-slate-600 active:scale-95"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={2} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Subtle footer text */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;