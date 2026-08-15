import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Heart, Activity, CheckSquare, Bell, Hospital, ShieldCheck, ArrowRight } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import DashboardCard from '../../components/DashboardCard';
import StatusBadge from '../../components/StatusBadge';
import { LoadingSpinner, ErrorMessage } from '../../components/LoadingSpinner';
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
        setError('Failed to fetch recipient waiting-list details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <AdminLayout role="RECIPIENT"><LoadingSpinner message="Loading recipient portal..." /></AdminLayout>;

  const recipient = recipientData?.recipient || profile;
  const waitingInfo = recipientData?.waitingList;
  const matches = matchesData?.matches || [];
  const allocations = matchesData?.allocations || [];

  return (
    <AdminLayout role="RECIPIENT">
      <div className="space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm inline-block">
              Transplant Candidate Portal
            </span>
            <h1 className="text-3xl font-extrabold">Welcome, {recipient?.first_name || 'Recipient Candidate'}</h1>
            <p className="text-sky-100 text-sm max-w-2xl leading-relaxed">
              Enrolled for <strong>{recipient?.required_organ}</strong> transplant at <strong>{recipient?.hospital}</strong>. Your waiting rank position and match status are listed below.
            </p>
          </div>
        </div>

        {error && <ErrorMessage message={error} type="error" />}

        {/* Highlight Waiting Rank Box */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-200 bg-gradient-to-br from-sky-50/50 to-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Official Waiting Registry Rank</span>
            <h2 className="text-4xl font-black text-slate-900">
              Your place in the waiting list: <span className="text-sky-600">#{waitingInfo?.rank || 1}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Out of {waitingInfo?.totalWaiting || 1} total candidates waiting for a {recipient?.required_organ} transplant.
            </p>
          </div>

          <Link
            to="/recipient/waiting-rank"
            className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-sky-600 hover:bg-sky-700 shadow-md transition-colors whitespace-nowrap flex items-center space-x-2"
          >
            <CheckSquare className="w-4 h-4" />
            <span>View Rank Breakdown</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Required Organ" value={recipient?.required_organ || 'Kidney'} subtitle={`Blood Group: ${recipient?.blood_group}`} icon={Heart} color="sky" />
          <DashboardCard title="Urgency Status" value={recipient?.urgency_level || 'MEDIUM'} subtitle="Clinical Urgency" icon={Activity} color="rose" />
          <DashboardCard title="Registry Status" value={recipient?.status || 'WAITING'} subtitle="Current Workflow" icon={UserCheck} color="emerald" />
          <DashboardCard title="Approved Matches" value={matches.length} subtitle="Compatibility Matches" icon={ShieldCheck} color="indigo" />
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Link to="/recipient/profile" className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-sky-50 transition-all font-semibold text-xs text-slate-700 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-sky-600" />
              <span>Update Medical Profile</span>
            </Link>
            <Link to="/recipient/waiting-rank" className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-indigo-50 transition-all font-semibold text-xs text-slate-700 flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span>View Waiting Rank</span>
            </Link>
            <Link to="/notifications" className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 transition-all font-semibold text-xs text-slate-700 flex items-center space-x-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Notifications</span>
            </Link>
          </div>
        </div>

        {/* Matches & Allocations Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Potential Organ Matches & Allocation Status</h3>
          {allocations.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase">Organ Allocated!</span>
                <StatusBadge status={allocations[0].status} />
              </div>
              <p className="text-xs text-emerald-900">
                An organ ({allocations[0].organ_type}) has been allocated to you at {recipient?.hospital}.
              </p>
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {matches.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No active compatibility matches currently recorded.</p>
            ) : (
              matches.map((m) => (
                <div key={m.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Organ Match: {m.organ_type} ({m.donor_blood_group})</p>
                    <p className="text-xs text-slate-400">Match Compatibility Score: {m.match_score}% • Facility: {m.organ_location}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
