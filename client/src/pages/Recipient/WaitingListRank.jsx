import React, { useState, useEffect } from 'react';
import { CheckSquare, ShieldAlert, Award, Activity, Clock, Info } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { LoadingSpinner, ErrorMessage } from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { PageHeader } from '../../components/PageHeader';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function WaitingListRank() {
  const { profile } = useAuth();
  const [rankData, setRankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRank = async () => {
      try {
        const res = await api.get('/recipients/waiting-rank');
        if (res.data) {
          setRankData(res.data);
        }
      } catch (err) {
        setError('We couldn\'t load your waiting-list rank right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchRank();
  }, []);

  if (loading) return <AdminLayout role="RECIPIENT"><LoadingSpinner message="Calculating waiting rank..." /></AdminLayout>;

  return (
    <AdminLayout role="RECIPIENT">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <PageHeader
          title="Waiting List Rank Position"
          description="Real-time candidate queue position and score breakdown."
        />

        {error && <ErrorMessage message={error} type="error" />}

        {/* Hero Rank Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center space-y-4 relative overflow-hidden">
          <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold uppercase tracking-wider">
            Active Candidate Queue Position
          </span>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Your place in the waiting list: <span className="text-sky-600">#{rankData?.rank || 1}</span>
          </h2>

          <p className="text-xs text-slate-500">
            Organ Category: <strong className="text-slate-800">{rankData?.organ || profile?.required_organ || 'Kidney'}</strong> • Total Candidates: <strong className="text-slate-800">{rankData?.totalWaiting || 1}</strong>
          </p>

          <div className="inline-block pt-2">
            <StatusBadge status={rankData?.status || 'WAITING'} />
          </div>
        </div>

        {/* Queue Metrics Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase">
              <Activity className="w-4 h-4 text-sky-600" />
              <span>Matching Factors</span>
            </div>
            <p className="text-xs text-slate-600 pt-1">
              Rank score incorporates blood group compatibility (30%), clinical urgency (20%), waiting time (10%), and proximity (10%).
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Queue Status</span>
            </div>
            <p className="text-xs text-slate-600 pt-1">
              Your status is active on the candidate registry. As compatible donor organs are pledged, your rank updates dynamically.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Medical Facility</span>
            </div>
            <p className="text-xs text-slate-600 pt-1">
              Enrolled at <strong>{profile?.hospital || 'Springfield General'}</strong>. Your medical team receives immediate alert upon match review.
            </p>
          </div>
        </div>

        {/* Demo Model Disclaimer */}
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-1.5 text-xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <h4 className="font-bold text-xs">Demo Allocation Model Notice</h4>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800">
            The ranking logic and match scores are calculated using a <strong>project/demo allocation model</strong>. OPTM is an academic management platform and does not replace professional medical evaluation, UNOS/OPTN clinical policy, or hospital transplant authority decision-making.
          </p>
        </div>

      </div>
    </AdminLayout>
  );
}
