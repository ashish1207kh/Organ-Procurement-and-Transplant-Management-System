import React, { useState, useEffect } from 'react';
import { HeartHandshake, Plus, ArrowRight, CheckCircle2 } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { FormInput, SelectInput } from '../../components/FormInput';
import { useForm } from 'react-hook-form';
import { LoadingSpinner, ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';

export default function AllocationManagement() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/allocations');
      if (res.data.success) {
        setAllocations(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch allocations list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const onCreateAllocation = async (data) => {
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/admin/allocations', {
        organId: data.organId,
        recipientId: data.recipientId,
        matchId: data.matchId || null,
        notes: data.notes
      });
      if (res.data.success) {
        setSuccess('Organ allocation created successfully.');
        setModalOpen(false);
        reset();
        fetchAllocations();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create allocation.');
    }
  };

  const onUpdateAllocationStatus = async (data) => {
    if (!selectedAllocation) return;
    setError('');
    setSuccess('');
    try {
      const res = await api.put(`/admin/allocations/${selectedAllocation.id}`, {
        status: data.status,
        notes: data.notes
      });
      if (res.data.success) {
        setSuccess(`Allocation #${selectedAllocation.id} updated to ${data.status}.`);
        setStatusModalOpen(false);
        fetchAllocations();
      }
    } catch (err) {
      setError('Failed to update allocation status.');
    }
  };

  const columns = [
    { header: 'Alloc ID', accessor: 'id', render: (r) => `#${r.id}` },
    { header: 'Organ', accessor: 'organ_type', render: (r) => <span className="font-bold text-slate-900">{r.organ_type} (Organ #{r.organ_id})</span> },
    { header: 'Donor', render: (r) => <span>{r.donor_first_name} {r.donor_last_name}</span> },
    { header: 'Recipient Candidate', render: (r) => <span className="font-bold text-slate-800">{r.recipient_first_name} {r.recipient_last_name}</span> },
    { header: 'Hospital', accessor: 'hospital' },
    { header: 'Allocation Date', accessor: 'allocation_date', render: (r) => new Date(r.allocation_date).toLocaleDateString() },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      render: (r) => (
        <button
          onClick={() => {
            setSelectedAllocation(r);
            setStatusModalOpen(true);
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors"
        >
          Update Pipeline Status
        </button>
      )
    }
  ];

  return (
    <AdminLayout role="ADMIN">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Transplant Allocation Pipeline</h1>
            <p className="text-xs text-slate-500">Manage organ allocation records and surgical procedure lifecycle</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white gradient-accent shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Allocation</span>
          </button>
        </div>

        {error && <ErrorMessage message={error} type="error" />}
        {success && <ErrorMessage message={success} type="success" />}

        {/* Visual Workflow Steps (Section 18 requirement) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">End-to-End Allocation Workflow</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
            <span className="px-3 py-1 bg-slate-100 rounded-lg">Donor Registered</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg">Organ Available</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-lg">Recipient Matching</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg">Match Review</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg">Allocation</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-3 py-1 bg-rose-600 text-white rounded-lg">Transplant Completed</span>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={allocations}
          loading={loading}
          searchPlaceholder="Search allocation ID, recipient..."
        />

        {/* Create Allocation Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Organ Allocation">
          <form onSubmit={handleSubmit(onCreateAllocation)} className="space-y-4">
            <FormInput label="Organ ID" name="organId" type="number" register={register} errors={errors} required placeholder="e.g. 1" />
            <FormInput label="Recipient ID" name="recipientId" type="number" register={register} errors={errors} required placeholder="e.g. 1" />
            <FormInput label="Match ID (Optional)" name="matchId" type="number" register={register} errors={errors} placeholder="e.g. 1" />
            <FormInput label="Allocation Notes" name="notes" register={register} errors={errors} placeholder="Allocated by Admin for surgery" />

            <div className="pt-2 flex justify-end space-x-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm">Confirm Allocation</button>
            </div>
          </form>
        </Modal>

        {/* Update Status Modal */}
        <Modal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} title={`Update Status for Allocation #${selectedAllocation?.id}`}>
          <form onSubmit={handleSubmit(onUpdateAllocationStatus)} className="space-y-4">
            <SelectInput
              label="Pipeline Status"
              name="status"
              options={['ALLOCATED', 'IN_TRANSIT', 'TRANSPLANTED', 'CANCELLED']}
              register={register}
              required
            />
            <FormInput label="Update Notes" name="notes" register={register} placeholder="Transplant surgery in progress" />

            <div className="pt-2 flex justify-end space-x-3">
              <button type="button" onClick={() => setStatusModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg">Save Pipeline Status</button>
            </div>
          </form>
        </Modal>

      </div>
    </AdminLayout>
  );
}
