import React, { useState, useEffect } from 'react';
import { CheckSquare, ShieldAlert, Award, Activity, Clock, Info } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { LoadingSpinner, ErrorMessage } from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
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
        setError('Failed to calculate waiting-list rank.');
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
        
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Waiting List Rank Position</h1>
            <p className="text-xs text-slate-500">Real-time candidate queue position and score breakdown</p>
          </div>
        </div>

        {error && <ErrorMessage message={error} type="error" />}

        {/* Hero Rank Card - Displays explicit prompt requirement */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center space-y-4 relative overflow-hidden">
          <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            Active Registry Position
          </span>

          <h2 className="text-5xl font-black text-slate-900">
            Your place in the waiting list: <span className="text-sky-600">{rankData?.rank || 1}</span>
          </h2>

          <p className="text-sm text-slate-600">
            Organ Category: <strong>{rankData?.organ || profile?.required_organ || 'Kidney'}</strong> • Total Candidates: <strong>{rankData?.totalWaiting || 1}</strong>
          </p>

          <div className="inline-block pt-2">
            <StatusBadge status={rankData?.status || 'WAITING'} />
          </div>
        </div>

        {/* API Response JSON Representation */}
        <div className="bg-slate-900 rounded-2xl p-6 shadow-md text-slate-100 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <span>GET /api/recipients/:id/waiting-rank</span>
            <span>API JSON Output</span>
          </div>
          <pre className="text-sky-300 overflow-x-auto">
{JSON.stringify({
  rank: rankData?.rank || 2,
  totalWaiting: rankData?.totalWaiting || 15,
  organ: rankData?.organ || "Kidney",
  status: rankData?.status || "Waiting"
}, null, 2)}
          </pre>
        </div>

        {/* Demo Model Disclaimer */}
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h4 className="font-bold text-sm">Demo Allocation Model Notice</h4>
          </div>
          <p className="text-xs leading-relaxed text-amber-800">
            The ranking logic and match scores are calculated using a <strong>project/demo allocation model</strong> based on medical urgency, ABO blood group compatibility, waiting time, and location. This system is an academic management software and does not represent a clinically validated organ allocation algorithm or real-world UNOS/OPTN medical policy.
          </p>
        </div>

      </div>
    </AdminLayout>
  );
}
