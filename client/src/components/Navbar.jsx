import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, User, LogOut, HelpCircle, FileText, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logoutUser, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    setMobileMenuOpen(false);
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
    <nav className="subtle-navbar sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm group-hover:bg-sky-700 transition-colors">
                <HeartPulse className="w-5 h-5 text-rose-300" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center">
                  OPTM <span className="text-sky-600 text-xs ml-1.5 font-semibold">Health</span>
                </span>
                <span className="block text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                  Organ Procurement & Transplant
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors">
              Home
            </Link>
            <Link to="/help" className="text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors flex items-center space-x-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help & FAQ</span>
            </Link>
            <Link to="/terms" className="text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Terms & Ethics</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <NotificationBell />
                <Link
                  to={getDashboardPath()}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Dashboard ({user?.role})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <Link
                  to="/role-selection"
                  className="px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors"
                >
                  Select Role
                </Link>
                <Link
                  to="/role-selection"
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition-colors"
                >
                  Portal Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden space-x-2">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-150">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-sky-600"
          >
            Home
          </Link>
          <Link
            to="/help"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-sky-600"
          >
            Help & FAQ
          </Link>
          <Link
            to="/terms"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-sky-600"
          >
            Terms & Ethics
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-sky-600 text-center block"
              >
                Go to {user?.role} Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 text-center block"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to="/role-selection"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-sky-600 text-center block"
              >
                Portal Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
