import React, { useState, useEffect } from 'react';
import { History, Search } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import DataTable from '../../components/DataTable';
import { LoadingSpinner, ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/audit-logs');
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [
    { header: 'Log ID', accessor: 'id', render: (r) => `#${r.id}` },
    { header: 'Action', accessor: 'action', render: (r) => <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">{r.action}</span> },
    { header: 'Entity Type', accessor: 'entity_type', render: (r) => <span className="font-semibold text-slate-800">{r.entity_type} #{r.entity_id || ''}</span> },
    { header: 'Description', accessor: 'description' },
    { header: 'User Email', accessor: 'user_email', render: (r) => r.user_email || 'System' },
    { header: 'IP Address', accessor: 'ip_address' },
    { header: 'Timestamp', accessor: 'created_at', render: (r) => new Date(r.created_at).toLocaleString() }
  ];

  return (
    <AdminLayout role="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">System Security & Operational Audit Logs</h1>
            <p className="text-xs text-slate-500">Immutable audit record of user registrations, match approvals, and organ allocations</p>
          </div>
        </div>

        {error && <ErrorMessage message={error} type="error" />}

        <DataTable
          columns={columns}
          data={logs}
          loading={loading}
          searchPlaceholder="Search action, description, email..."
          searchValue={search}
          onSearchChange={setSearch}
        />
      </div>
    </AdminLayout>
  );
}
