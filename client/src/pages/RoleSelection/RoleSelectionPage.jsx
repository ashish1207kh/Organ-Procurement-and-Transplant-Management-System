import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, UserPlus, ShieldCheck, ArrowRight, UserCheck, Lock } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';

export default function RoleSelectionPage() {
  const roles = [
    {
      id: 'donor',
      title: 'Organ Donor Portal',
      subtitle: 'Pledge Organ Donation & Save Lives',
      icon: HeartPulse,
      color: 'from-rose-500 to-rose-600',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      description: 'Register as an organ donor, manage pledged organ willingness, track donation status, and update informed consent settings.',
      loginPath: '/login?role=donor',
      registerPath: '/register/donor',
      btnText: 'Donor Portal Login',
      registerText: 'Register New Donor Account'
    },
    {
      id: 'recipient',
      title: 'Recipient Portal',
      subtitle: 'Organ Requirement & Waiting List',
      icon: UserPlus,
      color: 'from-sky-500 to-blue-600',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      description: 'Complete medical recipient requirements, view real-time waiting-list rank position, and track organ match and allocation status.',
      loginPath: '/login?role=recipient',
      registerPath: '/register/recipient',
      btnText: 'Recipient Portal Login',
      registerText: 'Register Recipient Account'
    },
    {
      id: 'admin',
      title: 'Administrator Portal',
      subtitle: 'Executive Healthcare Control Center',
      icon: ShieldCheck,
      color: 'from-slate-800 to-slate-900',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      description: 'Authorized medical personnel access to monitor analytics dashboard, organ inventory, compatibility matching, and transplant allocation pipeline.',
      loginPath: '/admin-login',
      registerPath: null,
      btnText: 'Administrator Login',
      registerText: 'Restricted Access (Authorized Admin Only)'
    }
  ];

  return (
    <MainLayout>
      <div className="py-16 bg-slate-50 min-h-[calc(100vh-10rem)] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
              Authentication Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Select Your Access Role
            </h1>
            <p className="text-slate-600 text-sm">
              Choose your role below to navigate to the appropriate secure registration or login workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} text-white flex items-center justify-center shadow-lg mb-6`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border mb-3 ${role.badgeBg}`}>
                      {role.title}
                    </span>

                    <h3 className="text-xl font-extrabold text-slate-900 mb-2">{role.subtitle}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">{role.description}</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <Link
                      to={role.loginPath}
                      className="w-full py-3 rounded-xl font-bold text-sm text-white bg-sky-600 hover:bg-sky-700 shadow-md transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>{role.btnText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {role.registerPath ? (
                      <Link
                        to={role.registerPath}
                        className="w-full py-2.5 rounded-xl font-semibold text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors text-center block"
                      >
                        {role.registerText}
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center space-x-1 py-2 text-[11px] font-medium text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
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
