import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, HeartHandshake, GitPullRequest,
  CheckSquare, History, Bell, ShieldCheck, Heart, UserCheck
} from 'lucide-react';

export default function Sidebar({ role = 'ADMIN' }) {
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { to: '/admin/donors', label: 'Donor Management', icon: Users },
    { to: '/admin/recipients', label: 'Recipient Management', icon: UserCheck },
    { to: '/admin/organs', label: 'Organ Inventory', icon: Heart },
    { to: '/admin/matches', label: 'Match Reviews', icon: GitPullRequest },
    { to: '/admin/allocations', label: 'Transplant Pipeline', icon: HeartHandshake },
    { to: '/admin/audit-logs', label: 'System Audit Logs', icon: History }
  ];

  const donorLinks = [
    { to: '/donor/dashboard', label: 'Donor Overview', icon: LayoutDashboard },
    { to: '/donor/profile', label: 'My Medical Profile', icon: Users },
    { to: '/donor/organs', label: 'Organ Pledges', icon: Heart },
    { to: '/notifications', label: 'Notifications', icon: Bell }
  ];

  const recipientLinks = [
    { to: '/recipient/dashboard', label: 'Recipient Overview', icon: LayoutDashboard },
    { to: '/recipient/profile', label: 'My Medical Profile', icon: Users },
    { to: '/recipient/waiting-rank', label: 'Waiting List Position', icon: CheckSquare },
    { to: '/notifications', label: 'Notifications', icon: Bell }
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'DONOR' ? donorLinks : recipientLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-3">
            Navigation Menu ({role})
          </span>
          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-sky-50 text-sky-700 shadow-sm border border-sky-100'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
        <div className="flex items-center space-x-2 text-sky-700 font-semibold text-xs mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Role Authorization</span>
        </div>
        <p className="text-[11px] text-slate-500 capitalize">{role.toLowerCase()} Access Level</p>
      </div>
    </aside>
  );
}
