import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldAlert, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand & info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-9 h-9 rounded-xl gradient-header flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-rose-400" />
              </div>
              <span className="text-lg font-bold">OPTM Health</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Centralized Web-based Organ Procurement and Transplant Management platform facilitating ethical donor pledges, recipient matching, and allocation workflows.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Portals & Roles</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/role-selection" className="hover:text-sky-400 transition-colors">Donor Portal</Link></li>
              <li><Link to="/role-selection" className="hover:text-sky-400 transition-colors">Recipient Portal</Link></li>
              <li><Link to="/role-selection" className="hover:text-sky-400 transition-colors">Administrator Portal</Link></li>
              <li><Link to="/help" className="hover:text-sky-400 transition-colors">Waiting List FAQs</Link></li>
            </ul>
          </div>

          {/* Governance & Ethics */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Governance</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/terms" className="hover:text-sky-400 transition-colors">Terms of Informed Consent</Link></li>
              <li><Link to="/terms" className="hover:text-sky-400 transition-colors">Privacy & Data Confidentiality</Link></li>
              <li><Link to="/terms" className="hover:text-sky-400 transition-colors">Non-Commercialization Pledge</Link></li>
              <li><Link to="/help" className="hover:text-sky-400 transition-colors">Matching Policy (5-Factor Model)</Link></li>
            </ul>
          </div>

          {/* Help & Contact */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Support & Contact</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>support@optm-health.org</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-sky-400" />
                <span>1-800-555-OPTM (6786)</span>
              </p>
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>Transplant Coordination Center</span>
              </p>
            </div>
          </div>
        </div>

        {/* Safety & Academic Disclaimer Banner */}
        <div className="mt-8 bg-slate-800/80 rounded-xl p-4 border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-amber-400 font-semibold">Important Medical & Academic Disclaimer:</strong> This application is an academic/demo management system and does not replace professional medical evaluation, transplant authority policies, or clinical decision-making.
            </p>
          </div>
          <span className="text-[10px] text-slate-500 whitespace-nowrap">OPTM v1.0 Web Edition</span>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Organ Procurement and Transplant Management System. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Built with precision for healthcare operations</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
