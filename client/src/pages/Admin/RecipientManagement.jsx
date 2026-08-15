import React, { useState, useEffect } from 'react';
import { UserCheck, Eye, CheckSquare, ShieldCheck } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { LoadingSpinner, ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';

export default function RecipientManagement() {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchRecipients = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/recipients', {
        params: {
          search,
          bloodGroup: bloodGroupFilter,
          urgency: urgencyFilter,
          status: statusFilter,
          page,
          limit: 10
        }
      });
      if (res.data.success) {
        setRecipients(res.data.data);
        setTotal(res.data.pagination.total);
      }
    } catch (err) {
      setError('Failed to fetch recipients list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipients();
  }, [search, bloodGroupFilter, urgencyFilter, statusFilter, page]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Recipient Candidate',
      accessor: 'first_name',
      render: (row) => <span className="font-bold text-slate-900">{row.first_name} {row.last_name}</span>
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Age', accessor: 'age', render: (row) => `${row.age || 35} yrs` },
    {
      header: 'Blood Group',
      accessor: 'blood_group',
      render: (row) => <span className="font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">{row.blood_group}</span>
    },
    { header: 'Required Organ', accessor: 'required_organ', render: (row) => <span className="font-bold text-slate-800">{row.required_organ}</span> },
    { header: 'Urgency', accessor: 'urgency_level', render: (row) => <StatusBadge status={row.urgency_level} /> },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Hospital Facility', accessor: 'hospital' },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => {
            setSelectedRecipient(row);
            setModalOpen(true);
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors flex items-center space-x-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>
      )
    }
  ];

  return (
    <AdminLayout role="ADMIN">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Recipient Registry Management</h1>
            <p className="text-xs text-slate-500">Monitor transplant candidates, urgency priority, and medical center listings</p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={bloodGroupFilter}
              onChange={(e) => setBloodGroupFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium"
            >
              <option value="">All Blood Groups</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium"
            >
              <option value="">All Urgency Levels</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>

        {error && <ErrorMessage message={error} type="error" />}

        <DataTable
          columns={columns}
          data={recipients}
          loading={loading}
          searchPlaceholder="Search recipient, email, hospital..."
          searchValue={search}
          onSearchChange={setSearch}
          totalRows={total}
          page={page}
          limit={10}
          onPageChange={setPage}
        />

        {/* Modal View Details */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Recipient Medical Profile">
          {selectedRecipient && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="font-bold text-sm text-slate-900">{selectedRecipient.first_name} {selectedRecipient.last_name}</h4>
                <p>Email: {selectedRecipient.email} | Phone: {selectedRecipient.phone}</p>
                <p>Blood Group: <strong className="text-sky-600">{selectedRecipient.blood_group}</strong> | Required Organ: <strong>{selectedRecipient.required_organ}</strong></p>
                <p>Treating Hospital: {selectedRecipient.hospital} ({selectedRecipient.city}, {selectedRecipient.state})</p>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <p><strong>Clinical Urgency:</strong> <StatusBadge status={selectedRecipient.urgency_level} /></p>
                <p><strong>Workflow Status:</strong> <StatusBadge status={selectedRecipient.status} /></p>
                <p><strong>Medical History:</strong> {selectedRecipient.medical_history || 'None reported'}</p>
                <p><strong>Medications:</strong> {selectedRecipient.current_medications || 'None reported'}</p>
                <p><strong>Allergies:</strong> {selectedRecipient.allergies || 'None reported'}</p>
              </div>

              <div className="pt-4 flex justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-100 font-semibold text-slate-700 rounded-lg">Close</button>
              </div>
            </div>
          )}
        </Modal>

      </div>
    </AdminLayout>
  );
}
