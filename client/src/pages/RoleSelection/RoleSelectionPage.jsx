import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, UserPlus, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';

export default function RoleSelectionPage() {
  const roles = [
    {
      id: 'donor',
      title: 'Donor Portal',
      subtitle: 'Organ Donation Pledges',
      icon: HeartPulse,
      badge: 'Organ Donor',
      description: 'Register as a donor, select organs willing to donate, review consent, and manage donation status.',
      loginPath: '/login?role=donor',
      registerPath: '/register/donor',
      btnText: 'Sign in to Donor Portal',
      registerText: 'Register as a New Donor'
    },
    {
      id: 'recipient',
      title: 'Recipient Candidate Portal',
      subtitle: 'Transplant Waiting List',
      icon: UserPlus,
      badge: 'Transplant Candidate',
      description: 'Register organ requirement, view waiting-list rank position, and track potential compatibility matches.',
      loginPath: '/login?role=recipient',
      registerPath: '/register/recipient',
      btnText: 'Sign in to Recipient Portal',
      registerText: 'Register as a Candidate'
    },
    {
      id: 'admin',
      title: 'Administrator Portal',
      subtitle: 'Operations Management',
      icon: ShieldCheck,
      badge: 'Medical Administrator',
      description: 'Authorized access for medical coordinators to oversee organ inventory, review matches, and manage allocations.',
      loginPath: '/admin-login',
      registerPath: null,
      btnText: 'Sign in as Administrator',
      registerText: 'Restricted Access (Authorized Staff Only)'
    }
  ];

  return (
    <MainLayout>
      <div className="py-16 bg-slate-50 min-h-[calc(100vh-10rem)] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Access Portal</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Select Your Access Portal
            </h1>
            <p className="text-slate-500 text-xs">
              Choose your role to proceed to the appropriate login or registration workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 mb-2">
                      {role.badge}
                    </span>

                    <h3 className="text-base font-bold text-slate-900 mb-1">{role.subtitle}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">{role.description}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <Link
                      to={role.loginPath}
                      className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <span>{role.btnText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {role.registerPath ? (
                      <Link
                        to={role.registerPath}
                        className="w-full py-2 rounded-xl font-semibold text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors text-center block border border-slate-200/80"
                      >
                        {role.registerText}
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center space-x-1 py-2 text-[11px] font-medium text-slate-400">
                        <Lock className="w-3 h-3" />
                        <span>{role.registerText}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
