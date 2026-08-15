import React, { useState, useEffect } from 'react';
import { Users, Eye } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { PageHeader } from '../../components/PageHeader';
import { ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';

export default function DonorManagement() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [consentFilter, setConsentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/donors', {
        params: {
          search,
          bloodGroup: bloodGroupFilter,
          consentStatus: consentFilter,
          page,
          limit: 10
        }
      });
      if (res.data.success) {
        setDonors(res.data.data);
        setTotal(res.data.pagination.total);
      }
    } catch (err) {
      setError('We couldn\'t load the donor registry right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [search, bloodGroupFilter, consentFilter, page]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Donor Name',
      accessor: 'first_name',
      render: (row) => <span className="font-bold text-slate-900">{row.first_name} {row.last_name}</span>
    },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Blood Group',
      accessor: 'blood_group',
      render: (row) => <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">{row.blood_group}</span>
    },
    { header: 'Pledged Organs', accessor: 'organ_list', render: (row) => row.organ_list || 'Kidney' },
    { header: 'Location', accessor: 'city', render: (row) => `${row.city}, ${row.state}` },
    { header: 'Consent Status', accessor: 'consent_status', render: (row) => <StatusBadge status={row.consent_status} /> },
    { header: 'Registration Date', accessor: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => {
            setSelectedDonor(row);
            setModalOpen(true);
          }}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors flex items-center space-x-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Profile</span>
        </button>
      )
    }
  ];

  return (
    <AdminLayout role="ADMIN">
      <div className="space-y-6">
        <PageHeader
          title="Donor Registry"
          description="Review organ donor pledges, contact information, and consent statuses."
          actions={
            <div className="flex items-center space-x-2">
              <select
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium"
              >
                <option value="">All Blood Groups</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>

              <select
                value={consentFilter}
                onChange={(e) => setConsentFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium"
              >
                <option value="">All Consent Statuses</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="WITHDRAWN">WITHDRAWN</option>
              </select>
            </div>
          }
        />

        {error && <ErrorMessage message={error} type="error" />}

        <DataTable
          columns={columns}
          data={donors}
          loading={loading}
          searchPlaceholder="Search by name, email, city..."
          searchValue={search}
          onSearchChange={setSearch}
          totalRows={total}
          page={page}
          limit={10}
          onPageChange={setPage}
          emptyTitle="No donor records found"
          emptyDescription="New organ donor registrations will appear here."
        />

        {/* Modal View Details */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Donor Profile Details">
          {selectedDonor && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <h4 className="font-bold text-sm text-slate-900">{selectedDonor.first_name} {selectedDonor.last_name}</h4>
                <p>Email: {selectedDonor.email} | Phone: {selectedDonor.phone}</p>
                <p>Blood Group: <strong className="text-sky-600">{selectedDonor.blood_group}</strong> | DOB: {selectedDonor.date_of_birth}</p>
                <p>Address: {selectedDonor.address}, {selectedDonor.city}, {selectedDonor.state}</p>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <p><strong>Medical History:</strong> {selectedDonor.medical_history || 'None reported'}</p>
                <p><strong>Medications:</strong> {selectedDonor.current_medications || 'None reported'}</p>
                <p><strong>Allergies:</strong> {selectedDonor.allergies || 'None reported'}</p>
                <p><strong>Consent Status:</strong> <StatusBadge status={selectedDonor.consent_status} /></p>
                <p><strong>Pledged Organs:</strong> {selectedDonor.organ_list || 'Kidney'}</p>
              </div>

              <div className="pt-4 flex justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-100 font-semibold text-slate-700 rounded-xl text-xs">Close</button>
              </div>
            </div>
          )}
        </Modal>

      </div>
    </AdminLayout>
  );
}
