import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, User, Heart, ShieldAlert, Bell, LogOut, CheckCircle2, ArrowRight } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import DashboardCard from '../../components/DashboardCard';
import StatusBadge from '../../components/StatusBadge';
import { LoadingSpinner, ErrorMessage } from '../../components/LoadingSpinner';
import { ConfirmationDialog } from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DonorDashboard() {
  const { user, profile, logoutUser } = useAuth();
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
      setError('Failed to load donor donation status.');
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
        setActionSuccess('Organ donation consent has been successfully withdrawn.');
        fetchStatus();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to withdraw consent.');
    }
  };

  if (loading) return <AdminLayout role="DONOR"><LoadingSpinner message="Loading donor portal..." /></AdminLayout>;

  const donor = donorStatus?.donor || profile;
  const organs = donorStatus?.organs || [];
  const consentStatus = donorStatus?.consentStatus || donor?.consent_status || 'ACCEPTED';

  return (
    <AdminLayout role="DONOR">
      <div className="space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm inline-block">
              Organ Donor Portal
            </span>
            <h1 className="text-3xl font-extrabold">Welcome, {donor?.first_name || 'Generous Donor'}!</h1>
            <p className="text-sky-100 text-sm max-w-2xl leading-relaxed">
              Thank you for your noble pledge to save lives. Your pledge status and consent details are managed securely below.
            </p>
          </div>
        </div>

        {error && <ErrorMessage message={error} type="error" />}
        {actionSuccess && <ErrorMessage message={actionSuccess} type="success" />}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Consent Status" value={consentStatus} subtitle="Informed Consent" icon={CheckCircle2} color="emerald" />
          <DashboardCard title="Organs Pledged" value={organs.length} subtitle="Selected Organs" icon={Heart} color="rose" />
          <DashboardCard title="Matches Generated" value={donorStatus?.matchesCount || 0} subtitle="Potential Recipient Matches" icon={HeartPulse} color="sky" />
          <DashboardCard title="Allocated Organs" value={donorStatus?.allocationsCount || 0} subtitle="Transplant Allocations" icon={ShieldAlert} color="indigo" />
        </div>

        {/* Quick Actions Navigation */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link to="/donor/profile" className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-sky-50 hover:border-sky-200 transition-all font-semibold text-xs text-slate-700 flex items-center space-x-2">
              <User className="w-4 h-4 text-sky-600" />
              <span>View / Edit Profile</span>
            </Link>
            <Link to="/donor/organs" className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 transition-all font-semibold text-xs text-slate-700 flex items-center space-x-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Donation Details</span>
            </Link>
            <Link to="/notifications" className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 transition-all font-semibold text-xs text-slate-700 flex items-center space-x-2">
              <Bell className="w-4 h-4 text-indigo-500" />
              <span>Notifications</span>
            </Link>
            <button
              onClick={() => setWithdrawModalOpen(true)}
              disabled={consentStatus === 'WITHDRAWN'}
              className="p-4 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all font-semibold text-xs text-rose-700 flex items-center space-x-2 disabled:opacity-50 text-left"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{consentStatus === 'WITHDRAWN' ? 'Consent Withdrawn' : 'Withdraw Consent'}</span>
            </button>
          </div>
        </div>

        {/* Pledged Organs List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Your Registered Organ Pledges</h3>
            <Link to="/donor/organs" className="text-xs font-semibold text-sky-600 hover:underline flex items-center space-x-1">
              <span>Manage Organs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {organs.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No organs currently registered.</p>
            ) : (
              organs.map((organ) => (
                <div key={organ.id} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-xs">
                      <Heart className="w-5 h-5 fill-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{organ.organ_type}</p>
                      <p className="text-xs text-slate-400">Blood Group: {organ.blood_group} • Location: {organ.location}</p>
                    </div>
                  </div>
                  <StatusBadge status={organ.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Withdraw Consent Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          onConfirm={handleWithdrawConsent}
          title="Withdraw Organ Donation Consent?"
          message="Are you sure you wish to withdraw your organ donation pledge? This will cancel all unallocated pledged organs on the registry."
          confirmText="Confirm Consent Withdrawal"
          confirmVariant="rose"
        />

      </div>
    </AdminLayout>
  );
}
