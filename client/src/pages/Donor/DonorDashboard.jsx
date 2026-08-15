import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, User, Heart, ShieldCheck, Bell, CheckCircle2, ArrowRight } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import DashboardCard from '../../components/DashboardCard';
import StatusBadge from '../../components/StatusBadge';
import { CardSkeleton } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import { ErrorMessage } from '../../components/LoadingSpinner';
import { ConfirmationDialog } from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DonorDashboard() {
  const { user, profile } = useAuth();
  const [donorStatus, setDonorStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await api.get('/donors/status');
      if (res.data.success) {
        setDonorStatus(res.data.data);
      }
    } catch (err) {
      setError('We couldn\'t load your donation status right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleWithdrawConsent = async () => {
    try {
      const res = await api.put('/donors/consent/withdraw', { reason: withdrawReason });
      if (res.data.success) {
        setActionSuccess('Your donation consent has been successfully withdrawn.');
        fetchStatus();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to withdraw consent.');
    }
  };

  if (loading) {
    return (
      <AdminLayout role="DONOR">
        <div className="space-y-6">
          <CardSkeleton count={4} />
        </div>
      </AdminLayout>
    );
  }

  const donor = donorStatus?.donor || profile;
  const organs = donorStatus?.organs || [];
  const consentStatus = donorStatus?.consentStatus || donor?.consent_status || 'ACCEPTED';

  return (
    <AdminLayout role="DONOR">
      <div className="space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
              Organ Donor Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {donor?.first_name || 'Donor'}</h1>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Thank you for your pledge to organ donation. Below is your current donation status and registered pledges.
          </p>
        </div>

        {error && <ErrorMessage message={error} type="error" />}
        {actionSuccess && <ErrorMessage message={actionSuccess} type="success" />}

        {/* Primary Status Overview Box (Answers: What is my donation status?) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Donation Status</span>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <h2 className="text-xl font-bold text-slate-900">
                {consentStatus === 'ACCEPTED' ? 'Registered & Active Pledge' : 'Consent Withdrawn'}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              {consentStatus === 'ACCEPTED'
                ? 'Your organ pledge information is recorded and available for compatibility matching.'
                : 'Your donation consent has been withdrawn. Unallocated pledged organs are cancelled.'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <StatusBadge status={consentStatus} />
            <button
              onClick={() => setWithdrawModalOpen(true)}
              disabled={consentStatus === 'WITHDRAWN'}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-40"
            >
              {consentStatus === 'WITHDRAWN' ? 'Consent Withdrawn' : 'Withdraw Consent'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Consent Status" value={consentStatus} subtitle="Informed Consent" icon={CheckCircle2} color="emerald" />
          <DashboardCard title="Organs Pledged" value={organs.length} subtitle="Registered Organs" icon={Heart} color="rose" />
          <DashboardCard title="Matches Generated" value={donorStatus?.matchesCount || 0} subtitle="Potential Matches" icon={HeartPulse} color="sky" />
          <DashboardCard title="Allocated Organs" value={donorStatus?.allocationsCount || 0} subtitle="Transplant Allocations" icon={ShieldCheck} color="indigo" />
        </div>

        {/* Registered Pledges List */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Your Registered Organ Pledges</h3>
            <Link to="/donor/organs" className="text-xs font-bold text-sky-600 hover:underline flex items-center space-x-1">
              <span>Manage Pledges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {organs.length === 0 ? (
            <EmptyState
              title="No organ pledges registered"
              description="Pledge an organ to register your willingness for organ donation."
              icon={Heart}
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {organs.map((organ) => (
                <div key={organ.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-xs">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{organ.organ_type}</p>
                      <p className="text-[11px] text-slate-400">Blood Group: {organ.blood_group} • Location: {organ.location}</p>
                    </div>
                  </div>
                  <StatusBadge status={organ.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Withdraw Consent Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          onConfirm={handleWithdrawConsent}
          title="Withdraw donation consent?"
          message="This will update your current donation status and cancel all unallocated pledged organs on the registry. Are you sure you want to continue?"
          confirmText="Confirm Withdrawal"
          confirmVariant="rose"
        />

      </div>
    </AdminLayout>
  );
}
