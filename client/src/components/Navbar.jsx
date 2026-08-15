import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, User, LogOut, ShieldAlert, Bell, HelpCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logoutUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/role-selection';
    switch (user.role) {
      case 'DONOR': return '/donor/dashboard';
      case 'RECIPIENT': return '/recipient/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/role-selection';
    }
  };

  return (
    <nav className="glass-nav sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl gradient-header flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center">
                  OPTM <span className="text-sky-600 ml-1.5 font-semibold text-sm">Health</span>
                </span>
                <span className="block text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                  Organ Procurement & Transplant
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
              Home
            </Link>
            <Link to="/help" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors flex items-center space-x-1">
              <HelpCircle className="w-4 h-4" />
              <span>Help & FAQ</span>
            </Link>
            <Link to="/terms" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>Terms & Ethics</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <Link
                  to={getDashboardPath()}
                  className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/role-selection"
                  className="px-4 py-2 text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                >
                  Select Role
                </Link>
                <Link
                  to="/role-selection"
                  className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors"
                >
                  Portal Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
