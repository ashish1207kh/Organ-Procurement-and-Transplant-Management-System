import React, { useState, useEffect } from 'react';
import { GitPullRequest, Play, CheckCircle2, XCircle, Activity, Award, ShieldAlert } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { LoadingSpinner, ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';

export default function MatchManagement() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/matches');
      if (res.data.success) {
        setMatches(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch matches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleRunAutoMatching = async () => {
    setMatchingLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/admin/matches/run');
      if (res.data.success) {
        setSuccess(res.data.message);
        fetchMatches();
      }
    } catch (err) {
      setError('Failed to run automatic matching calculation.');
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleUpdateStatus = async (matchId, status) => {
    setError('');
    setSuccess('');
    try {
      const res = await api.put(`/admin/matches/${matchId}`, { status });
      if (res.data.success) {
        setSuccess(`Match #${matchId} set to ${status}.`);
        fetchMatches();
      }
    } catch (err) {
      setError('Failed to update match status.');
    }
  };

  const columns = [
    { header: 'Match ID', accessor: 'id', render: (r) => `#${r.id}` },
    {
      header: 'Compatibility Score',
      accessor: 'match_score',
      render: (r) => (
        <div className="flex items-center space-x-2">
          <span className="text-base font-extrabold text-sky-600">{r.match_score}%</span>
        </div>
      )
    },
    { header: 'Donor & Organ', render: (r) => <span>{r.organ_type} ({r.donor_blood_group}) - {r.donor_first_name} {r.donor_last_name}</span> },
    { header: 'Recipient Candidate', render: (r) => <span className="font-bold">{r.recipient_first_name} {r.recipient_last_name} ({r.recipient_blood_group})</span> },
    { header: 'Urgency', accessor: 'urgency_level', render: (r) => <StatusBadge status={r.urgency_level} /> },
    { header: 'Facility Hospital', accessor: 'hospital' },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Admin Actions',
      render: (r) => (
        <div className="flex items-center space-x-2">
          {r.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleUpdateStatus(r.id, 'APPROVED')}
                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => handleUpdateStatus(r.id, 'REJECTED')}
                className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center space-x-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <AdminLayout role="ADMIN">
      <div className="space-y-6">
        
        {/* Header & Run Auto Match */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Organ Compatibility & Matching Engine</h1>
            <p className="text-xs text-slate-500">Run 5-Factor matching algorithm & review potential organ-recipient matches</p>
          </div>
          <button
            onClick={handleRunAutoMatching}
            disabled={matchingLoading}
            className="px-5 py-3 rounded-xl font-bold text-xs text-white gradient-accent shadow-md hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{matchingLoading ? 'Calculating Matches...' : 'Run Auto Matching Algorithm'}</span>
          </button>
        </div>

        {error && <ErrorMessage message={error} type="error" />}
        {success && <ErrorMessage message={success} type="success" />}

        {/* Configurable 5-Factor Weight Breakdown (Section 12 requirement) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Project Matching Score Calculation Weights</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
              <span className="text-xl font-black text-sky-700">30%</span>
              <p className="text-[11px] font-semibold text-slate-600 mt-1">Organ Type</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <span className="text-xl font-black text-indigo-700">30%</span>
              <p className="text-[11px] font-semibold text-slate-600 mt-1">ABO Blood Group</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-xl font-black text-rose-700">20%</span>
              <p className="text-[11px] font-semibold text-slate-600 mt-1">Medical Urgency</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-xl font-black text-amber-700">10%</span>
              <p className="text-[11px] font-semibold text-slate-600 mt-1">Waiting Duration</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-xl font-black text-emerald-700">10%</span>
              <p className="text-[11px] font-semibold text-slate-600 mt-1">Facility Distance</p>
            </div>
          </div>
        </div>

        {/* Ranked Matches Table */}
        <DataTable
          columns={columns}
          data={matches}
          loading={loading}
          searchPlaceholder="Search organ, recipient..."
        />

      </div>
    </AdminLayout>
  );
}
