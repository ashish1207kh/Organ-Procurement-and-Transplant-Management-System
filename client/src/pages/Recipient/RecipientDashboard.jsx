import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Heart, Activity, CheckSquare, Bell, ShieldCheck, ArrowRight } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import DashboardCard from '../../components/DashboardCard';
import StatusBadge from '../../components/StatusBadge';
import { CardSkeleton } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import { ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function RecipientDashboard() {
  const { user, profile } = useAuth();
  const [recipientData, setRecipientData] = useState(null);
  const [matchesData, setMatchesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, matchesRes] = await Promise.all([
          api.get('/recipients/profile'),
          api.get('/recipients/matches')
        ]);
        if (profileRes.data.success) {
          setRecipientData(profileRes.data.data);
        }
        if (matchesRes.data.success) {
          setMatchesData(matchesRes.data.data);
        }
      } catch (err) {
        setError('We couldn\'t load your waiting list status right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout role="RECIPIENT">
        <div className="space-y-6">
          <CardSkeleton count={4} />
        </div>
      </AdminLayout>
    );
  }

  const recipient = recipientData?.recipient || profile;
  const waitingInfo = recipientData?.waitingList;
  const matches = matchesData?.matches || [];
  const allocations = matchesData?.allocations || [];

  return (
    <AdminLayout role="RECIPIENT">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
          <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold">
            Transplant Candidate Portal
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {recipient?.first_name || 'Candidate'}</h1>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Enrolled for <strong>{recipient?.required_organ}</strong> transplant at <strong>{recipient?.hospital}</strong>. Below is your waiting-list position.
          </p>
        </div>

        {error && <ErrorMessage message={error} type="error" />}

        {/* Primary Status Overview Box (Answers: Where do I currently stand?) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Waiting-List Position</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              #{waitingInfo?.rank || 1} <span className="text-xs text-slate-500 font-medium">of {waitingInfo?.totalWaiting || 1} candidates</span>
            </h2>
            <p className="text-xs text-slate-500">
              You're currently registered in the candidate waiting list for a {recipient?.required_organ} transplant.
            </p>
          </div>

          <Link
            to="/recipient/waiting-rank"
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-colors whitespace-nowrap flex items-center space-x-1.5"
          >
            <CheckSquare className="w-4 h-4" />
            <span>View Rank Breakdown</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Required Organ" value={recipient?.required_organ || 'Kidney'} subtitle={`Blood Group: ${recipient?.blood_group}`} icon={Heart} color="sky" />
          <DashboardCard title="Urgency Status" value={recipient?.urgency_level || 'MEDIUM'} subtitle="Clinical Urgency" icon={Activity} color="rose" />
          <DashboardCard title="Registry Status" value={recipient?.status || 'WAITING'} subtitle="Workflow Status" icon={UserCheck} color="emerald" />
          <DashboardCard title="Approved Matches" value={matches.length} subtitle="Compatibility Matches" icon={ShieldCheck} color="indigo" />
        </div>

        {/* Potential Organ Matches List */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Potential Organ Matches & Allocation Progress</h3>
          {allocations.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase">Organ Allocated</span>
                <StatusBadge status={allocations[0].status} />
              </div>
              <p className="text-xs text-emerald-900">
                An organ ({allocations[0].organ_type}) has been allocated to you at {recipient?.hospital}.
              </p>
            </div>
          )}

          {matches.length === 0 ? (
            <EmptyState
              title="No potential matches identified yet"
              description="When a compatible donor organ is pledged, your match review will appear here."
              icon={ShieldCheck}
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {matches.map((m) => (
                <div key={m.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Organ Match: {m.organ_type} ({m.donor_blood_group})</p>
                    <p className="text-[11px] text-slate-400">Match Compatibility Score: {m.match_score}% • Location: {m.organ_location}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
