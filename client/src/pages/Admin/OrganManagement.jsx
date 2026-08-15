import React, { useState, useEffect } from 'react';
import { Heart, Activity, CheckCircle2, Clock } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { SelectInput, FormInput } from '../../components/FormInput';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';

export default function OrganManagement() {
  const [organs, setOrgans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const fetchOrgans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/organs', {
        params: { search, status: statusFilter }
      });
      if (res.data.success) {
        setOrgans(res.data.data);
      }
    } catch (err) {
      setError('Failed to load organ inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgans();
  }, [search, statusFilter]);

  const onUpdateStatus = async (data) => {
    if (!selectedOrgan) return;
    setError('');
    setSuccess('');
    try {
      const res = await api.put(`/admin/organs/${selectedOrgan.id}`, {
        status: data.status,
        viabilityStatus: data.viabilityStatus,
        location: data.location
      });
      if (res.data.success) {
        setSuccess(`Organ #${selectedOrgan.id} updated successfully.`);
        setModalOpen(false);
        fetchOrgans();
      }
    } catch (err) {
      setError('Failed to update organ status.');
    }
  };

  const columns = [
    { header: 'Organ ID', accessor: 'id', render: (row) => `#${row.id}` },
    { header: 'Organ Type', accessor: 'organ_type', render: (row) => <span className="font-bold text-slate-900">{row.organ_type}</span> },
    {
      header: 'Donor Name',
      accessor: 'donor_first_name',
      render: (row) => `${row.donor_first_name} ${row.donor_last_name} (ID #${row.donor_id})`
    },
    {
      header: 'Blood Group',
      accessor: 'blood_group',
      render: (row) => <span className="font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">{row.blood_group}</span>
    },
    { header: 'Facility Location', accessor: 'location' },
    { header: 'Viability Status', accessor: 'viability_status', render: (row) => <span className="text-xs text-slate-600 font-medium">{row.viability_status || 'Optimal'}</span> },
    { header: 'Allocation Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => {
            setSelectedOrgan(row);
            reset({
              status: row.status,
              viabilityStatus: row.viability_status || 'Optimal',
              location: row.location
            });
            setModalOpen(true);
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors"
        >
          Update Status
        </button>
      )
    }
  ];

  return (
    <AdminLayout role="ADMIN">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Organ Procurement & Inventory Tracker</h1>
            <p className="text-xs text-slate-500">Track procured organs, viability deadlines, and facility locations</p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium"
          >
            <option value="">All Organ Statuses</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="MATCHED">MATCHED</option>
            <option value="ALLOCATED">ALLOCATED</option>
            <option value="TRANSPLANTED">TRANSPLANTED</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        {error && <ErrorMessage message={error} type="error" />}
        {success && <ErrorMessage message={success} type="success" />}

        <DataTable
          columns={columns}
          data={organs}
          loading={loading}
          searchPlaceholder="Search facility, organ type..."
          searchValue={search}
          onSearchChange={setSearch}
        />

        {/* Modal Update Organ */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Update Status for Organ #${selectedOrgan?.id}`}>
          <form onSubmit={handleSubmit(onUpdateStatus)} className="space-y-4">
            <SelectInput
              label="Allocation Status"
              name="status"
              options={['AVAILABLE', 'RESERVED', 'MATCHED', 'ALLOCATED', 'TRANSPLANTED', 'CANCELLED', 'EXPIRED']}
              register={register}
              required
            />
            <FormInput label="Viability Notes" name="viabilityStatus" register={register} placeholder="Optimal - Cold Ischemia 2h" />
            <FormInput label="Facility Location" name="location" register={register} placeholder="Springfield General Hospital" />

            <div className="pt-2 flex justify-end space-x-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg">Save Organ Status</button>
            </div>
          </form>
        </Modal>

      </div>
    </AdminLayout>
  );
}
