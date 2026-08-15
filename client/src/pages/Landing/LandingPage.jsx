import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse, UserPlus, HeartHandshake, ShieldCheck, Activity,
  ArrowRight, Award, Scale, HelpCircle, CheckCircle2, Lock
} from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';

export default function LandingPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
                <Activity className="w-3.5 h-3.5 text-sky-600" />
                <span>Centralized Healthcare Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Connecting organ donation with <br />
                <span className="text-sky-600">responsible transplant management.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                OPTM provides a transparent, secure digital framework uniting voluntary organ donors, transplant candidates, and medical coordinators through objective matching scores and real-time waiting-list queue tracking.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/register/donor"
                  className="px-5 py-3 rounded-xl font-bold text-xs text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-colors text-center flex items-center justify-center space-x-2"
                >
                  <HeartPulse className="w-4 h-4 text-rose-300" />
                  <span>Register as a Donor</span>
                </Link>

                <Link
                  to="/register/recipient"
                  className="px-5 py-3 rounded-xl font-semibold text-xs text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-center flex items-center justify-center space-x-2 shadow-sm"
                >
                  <UserPlus className="w-4 h-4 text-sky-600" />
                  <span>Register as a Recipient</span>
                </Link>

                <Link
                  to="/role-selection"
                  className="px-4 py-3 rounded-xl font-semibold text-xs text-slate-600 hover:text-sky-600 transition-colors text-center flex items-center justify-center space-x-1"
                >
                  <span>Portal Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Trust Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-left">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">100%</h3>
                  <p className="text-[11px] text-slate-500">Voluntary Pledges</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">5-Factor</h3>
                  <p className="text-[11px] text-slate-500">Matching Engine</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Real-Time</h3>
                  <p className="text-[11px] text-slate-500">Queue Rank Position</p>
                </div>
              </div>
            </div>

            {/* Operational Flow Card Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">System Workflow Preview</h4>
                      <p className="text-[10px] text-slate-400">Match & Allocation Protocol</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    Active System
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Organ Pledge: Kidney (O+)</p>
                      <p className="text-[11px] text-slate-400">Facility: Springfield General • Viability 36h</p>
                    </div>
                    <span className="font-bold text-sky-700">Available</span>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sky-900">Compatibility Score: 94.5%</p>
                      <p className="text-[11px] text-sky-700">Candidate: Arun Kumar (Urgency: High)</p>
                    </div>
                    <span className="font-bold text-emerald-700">Queue Rank #1</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Objective 5-factor scoring incorporates blood compatibility, clinical urgency, waiting duration, and distance.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">Structured Healthcare Process</span>
            <h2 className="text-2xl font-bold text-slate-900">How OPTM Facilitates Organ Procurement</h2>
            <p className="text-slate-500 text-xs">
              Designed to ensure voluntary consent, candidate queue visibility, and administrative coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
            {[
              { step: '01', title: 'Donor Pledge', desc: 'Donors register medical details, select pledged organs, and complete electronic consent.', icon: HeartPulse },
              { step: '02', title: 'Candidate Registry', desc: 'Recipients record required organ, blood group, treating hospital, and medical urgency.', icon: UserPlus },
              { step: '03', title: '5-Factor Matching', desc: 'The system computes compatibility score based on blood group, urgency, and duration.', icon: Activity },
              { step: '04', title: 'Admin Review', desc: 'Medical coordinators evaluate ranked matches and orchestrate allocation pipeline.', icon: HeartHandshake }
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-sky-600 uppercase">Step {s.step}</span>
                  <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* System Features */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">Core Capabilities</span>
            <h2 className="text-2xl font-bold text-slate-900">Platform Features & Operational Design</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Waiting-List Ranking', desc: 'Transparent calculation of candidate position based on clinical urgency and registration duration.', icon: Scale },
              { title: 'Informed Consent Log', desc: 'Electronic consent logging with the ability for donors to withdraw consent prior to organ allocation.', icon: ShieldCheck },
              { title: 'Organ Inventory Tracking', desc: 'Track procurement timestamps, facility locations, and viability windows across centers.', icon: Activity },
              { title: 'Role Authorization', desc: 'Dedicated security controls and interfaces for Donors, Recipients, and Administrators.', icon: Award },
              { title: 'Operational Audit Trail', desc: 'Comprehensive event logging for registrations, status updates, match scoring, and allocations.', icon: CheckCircle2 },
              { title: 'Knowledge & Support', desc: 'Contextual help FAQs and in-app notifications keeping coordinators informed at every stage.', icon: HelpCircle }
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ethical Governance Notice */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-400 text-[10px] font-bold uppercase tracking-wider inline-block">
                Ethical & Legal Compliance
              </span>
              <h3 className="text-xl font-bold">Voluntary & Non-Commercial Organ Donation</h3>
              <p className="text-slate-400 text-xs max-w-2xl leading-relaxed">
                OPTM strictly operates in compliance with organ procurement ethical standards. All donation pledges are strictly voluntary, non-commercial, and protected by data privacy laws. Financial reward for organ donation is strictly illegal.
              </p>
            </div>
            <Link
              to="/terms"
              className="px-5 py-2.5 rounded-xl font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap text-xs"
            >
              Read Terms & Policy
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
