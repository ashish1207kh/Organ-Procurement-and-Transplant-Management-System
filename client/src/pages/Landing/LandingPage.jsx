import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse, UserPlus, HeartHandshake, ShieldCheck, Activity,
  Search, ArrowRight, CheckCircle, Award, Scale, HelpCircle
} from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';

export default function LandingPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-sky-50/80 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-semibold">
                <Activity className="w-4 h-4 text-sky-600 animate-pulse" />
                <span>Next-Generation Healthcare Technology Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Organ Procurement & <br />
                <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Transplant Management
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                A centralized, secure digital platform uniting organ donors, transplant candidates, and medical administrators to deliver transparent matching, equitable waiting-list calculations, and life-saving organ allocations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/register/donor"
                  className="px-6 py-3.5 rounded-xl font-bold text-white gradient-accent shadow-lg shadow-sky-500/25 hover:shadow-xl hover:scale-[1.02] transition-all text-center flex items-center justify-center space-x-2"
                >
                  <HeartPulse className="w-5 h-5" />
                  <span>Register as Donor</span>
                </Link>

                <Link
                  to="/register/recipient"
                  className="px-6 py-3.5 rounded-xl font-bold text-slate-800 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-center flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-5 h-5 text-sky-600" />
                  <span>Register as Recipient</span>
                </Link>

                <Link
                  to="/role-selection"
                  className="px-6 py-3.5 rounded-xl font-bold text-sky-700 bg-sky-50 border border-sky-100 hover:bg-sky-100 transition-all text-center flex items-center justify-center space-x-1.5"
                >
                  <span>Portal Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Key Trust Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 text-left">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">100%</h3>
                  <p className="text-xs text-slate-500 font-medium">Verified Pledges</p>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">5-Factor</h3>
                  <p className="text-xs text-slate-500 font-medium">Matching Engine</p>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Real-Time</h3>
                  <p className="text-xs text-slate-500 font-medium">Waiting Rank Calculation</p>
                </div>
              </div>
            </div>

            {/* Visual Card Display */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl gradient-header flex items-center justify-center text-white">
                      <HeartHandshake className="w-5 h-5 text-rose-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Live Allocation Flow</h4>
                      <p className="text-[11px] text-slate-400">Donor Organ Matching System</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active System
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Donor Organ: Kidney (O+)</p>
                      <p className="text-[11px] text-slate-500">Springfield General • Viability 36h</p>
                    </div>
                    <span className="text-xs font-extrabold text-sky-600">Available</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-sky-900">Match Compatibility: 94.5%</p>
                      <p className="text-[11px] text-sky-700">Recipient: Arun Kumar (Urgency: High)</p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600">Rank #1</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-800 flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Configurable match algorithm prioritizes medical urgency, ABO compatibility, and waiting time.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600">Simplified Healthcare Workflow</h2>
            <p className="text-3xl font-extrabold text-slate-900">How OPTM Connects Donors & Recipients</p>
            <p className="text-slate-600 text-sm">
              Our structured multi-role pipeline ensures informed consent, transparent ranking, and efficient allocation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            {[
              { step: '01', title: 'Pledge Donation', desc: 'Donors register medical profile, select organs, and sign electronic consent.', icon: HeartPulse },
              { step: '02', title: 'Recipient Registry', desc: 'Candidates register requirement, blood group, hospital center, and urgency level.', icon: UserPlus },
              { step: '03', title: '5-Factor Matching', desc: 'Engine computes match compatibility score using blood, organ, urgency, and distance.', icon: Activity },
              { step: '04', title: 'Admin Allocation', desc: 'Medical administrators review top matches and orchestrate organ transplant.', icon: HeartHandshake }
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow relative group">
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-4 font-extrabold text-lg shadow-md group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-sky-600 uppercase">Step {s.step}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* System Features */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600">Enterprise Capabilities</h2>
            <p className="text-3xl font-extrabold text-slate-900">Comprehensive Management Features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Waiting-List Ranking', desc: 'Real-time calculation of recipient rank based on blood compatibility, duration, and urgency.', icon: Scale },
              { title: 'Informed Consent Tracking', desc: 'Explicit consent recording with timestamps and the ability for donors to withdraw consent before allocation.', icon: ShieldCheck },
              { title: 'Organ Inventory & Viability', desc: 'Track procurement timestamps, cold ischemia hours, and organ viability status across medical facilities.', icon: Activity },
              { title: 'Role-Based Access Control', desc: 'Dedicated portals and permissions for Donors, Recipients, and Healthcare Administrators.', icon: Award },
              { title: 'Audit Logs & Transparency', desc: 'Comprehensive event logging for every registration, status update, match evaluation, and allocation.', icon: Search },
              { title: 'Notifications & Help Center', desc: 'In-app notification system keeping patients and coordinators informed at every stage.', icon: HelpCircle }
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-3 hover:border-sky-300 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ethical & Privacy Notice */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold inline-block">
                Ethical Healthcare Policy
              </span>
              <h3 className="text-2xl font-extrabold">Strict Compliance & Voluntary Consent</h3>
              <p className="text-slate-400 text-xs max-w-2xl leading-relaxed">
                OPTM strictly adheres to international ethical organ donation frameworks. All donation pledges are strictly voluntary, non-commercial, and protected by privacy standards. Financial remuneration for donation is illegal and strictly prohibited.
              </p>
            </div>
            <Link
              to="/terms"
              className="px-6 py-3 rounded-xl font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap text-sm"
            >
              Read Terms & Ethics
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
