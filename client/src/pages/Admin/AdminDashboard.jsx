import React, { useState, useEffect } from 'react';
import {
  Users, UserCheck, Heart, HeartHandshake, Activity, ShieldAlert,
  GitPullRequest, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import AdminLayout from '../../layouts/AdminLayout';
import DashboardCard from '../../components/DashboardCard';
import { CardSkeleton } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import { ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError('We couldn\'t load administrator metrics right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout role="ADMIN">
        <div className="space-y-6">
          <CardSkeleton count={4} />
        </div>
      </AdminLayout>
    );
  }

  const summary = stats?.summary || {};
  const charts = stats?.charts || {};
  const recentLogs = stats?.recentLogs || [];

  return (
    <AdminLayout role="ADMIN">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Executive Operational Dashboard</h1>
            <p className="text-xs text-slate-500">Real-time organ procurement, matching engine & transplant metrics</p>
          </div>
          <button
            onClick={fetchDashboardStats}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
            <span>Refresh Metrics</span>
          </button>
        </div>

        {error && <ErrorMessage message={error} type="error" />}

        {/* Top 4 Key Operational Metrics (Section 13 requirement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Total Donors" value={summary.totalDonors || 0} subtitle={`Active Pledges: ${summary.activeDonors || 0}`} icon={Users} color="rose" />
          <DashboardCard title="Total Candidates" value={summary.totalRecipients || 0} subtitle={`Waiting Queue: ${summary.waitingRecipients || 0}`} icon={UserCheck} color="sky" />
          <DashboardCard title="Available Organs" value={summary.availableOrgans || 0} subtitle="Optimal Viability" icon={Heart} color="emerald" />
          <DashboardCard title="Pending Matches" value={summary.pendingMatches || 0} subtitle="Awaiting Review" icon={GitPullRequest} color="amber" />
        </div>

        {/* Operational Overview Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Donated Organs Distribution (Bar Chart) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Organ Procurement Inventory</h3>
            <p className="text-xs text-slate-400">Pledged organ inventory breakdown by organ type</p>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.organsDonated || []}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Organs Required Demand (Pie Chart) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Candidate Organ Demand</h3>
            <p className="text-xs text-slate-400">Demand distribution across registered candidates</p>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.organsRequired || []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    label
                  >
                    {(charts.organsRequired || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Recent Operational Activity</h3>
          {recentLogs.length === 0 ? (
            <EmptyState title="No recent operational activity" description="Audit logs will record user registrations, matches, and allocations." />
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {recentLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{log.action}: {log.description}</p>
                    <p className="text-slate-400 text-[11px]">User: {log.user_email || 'System Admin'} • IP: {log.ip_address}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{new Date(log.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
