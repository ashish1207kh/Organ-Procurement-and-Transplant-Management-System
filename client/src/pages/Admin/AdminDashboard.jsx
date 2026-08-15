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
import { LoadingSpinner, ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

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
      setError('Failed to fetch administrator statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) return <AdminLayout role="ADMIN"><LoadingSpinner message="Loading executive analytics..." /></AdminLayout>;

  const summary = stats?.summary || {};
  const charts = stats?.charts || {};

  return (
    <AdminLayout role="ADMIN">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Executive Analytics Dashboard</h1>
            <p className="text-xs text-slate-500">Real-time organ procurement, matching engine & transplant metrics</p>
          </div>
          <button
            onClick={fetchDashboardStats}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-sky-600" />
            <span>Refresh Data</span>
          </button>
        </div>

        {error && <ErrorMessage message={error} type="error" />}

        {/* 8 Statistics Cards (Section 14 requirement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Total Donors" value={summary.totalDonors || 0} subtitle={`Active Pledges: ${summary.activeDonors || 0}`} icon={Users} color="rose" />
          <DashboardCard title="Total Recipients" value={summary.totalRecipients || 0} subtitle={`Waiting Candidates: ${summary.waitingRecipients || 0}`} icon={UserCheck} color="sky" />
          <DashboardCard title="Available Organs" value={summary.availableOrgans || 0} subtitle="Optimal Viability" icon={Heart} color="emerald" />
          <DashboardCard title="Allocated Organs" value={summary.allocatedOrgans || 0} subtitle="Allocated to Recipients" icon={HeartHandshake} color="indigo" />
          <DashboardCard title="Completed Transplants" value={summary.completedTransplants || 0} subtitle="Successful Procedures" icon={Activity} color="purple" />
          <DashboardCard title="Pending Matches" value={summary.pendingMatches || 0} subtitle="Awaiting Admin Review" icon={GitPullRequest} color="amber" />
          <DashboardCard title="Active Pledges" value={summary.activeDonors || 0} subtitle="Verified Consent" icon={ShieldAlert} color="emerald" />
          <DashboardCard title="Waiting Candidates" value={summary.waitingRecipients || 0} subtitle="High/Critical Urgency" icon={Activity} color="rose" />
        </div>

        {/* Recharts Analytics Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Donated Organs vs Required Organs (Bar Chart) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Organ Donated Distribution</h3>
            <p className="text-xs text-slate-400">Pledged organ inventory breakdown by organ type</p>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.organsDonated || []}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Organs Required Breakdown (Pie Chart) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Recipient Required Organs</h3>
            <p className="text-xs text-slate-400">Demand distribution across waiting candidates</p>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.organsRequired || []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
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

          {/* Chart 3: Waiting List by Organ */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Waiting Candidates by Organ</h3>
            <p className="text-xs text-slate-400">Active waiting list queue volume per organ</p>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.waitingByOrgan || []} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Allocation Status Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Allocation Lifecycle Breakdown</h3>
            <p className="text-xs text-slate-400">Status distribution (Available, Matched, Allocated, Transplanted)</p>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.allocationStatus || []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    label
                  >
                    {(charts.allocationStatus || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Recent Audit Logs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Recent Operational Audit Activity</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {(stats?.recentLogs || []).map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{log.action}: {log.description}</p>
                  <p className="text-slate-400 text-[10px]">User: {log.user_email || 'System Admin'} • IP: {log.ip_address}</p>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
