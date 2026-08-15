import React, { useState, useEffect } from 'react';
import { Heart, Plus, ShieldAlert } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { SelectInput, FormInput } from '../../components/FormInput';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';

export default function DonationDetails() {
  const [organs, setOrgans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const supportedOrgans = [
    'Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Intestines',
    'Corneas', 'Skin', 'Bone Marrow', 'Bones', 'Tendons'
  ];

  const fetchOrgans = async () => {
    try {
      const res = await api.get('/donors/organs');
      if (res.data.success) {
        setOrgans(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch organs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgans();
  }, []);

  const onAddOrgan = async (data) => {
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/donors/organs', {
        organType: data.organType,
        viabilityStatus: data.viabilityStatus
      });
      if (res.data.success) {
        setSuccess(`Organ pledge for ${data.organType} added successfully.`);
        setModalOpen(false);
        reset();
        fetchOrgans();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add organ pledge.');
    }
  };

  return (
    <AdminLayout role="DONOR">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Donation Details & Organ Pledges</h1>
            <p className="text-xs text-slate-500">Manage organs willing to donate and track procurement status</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white gradient-accent shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Pledge Additional Organ</span>
          </button>
        </div>

        {error && <ErrorMessage message={error} type="error" />}
        {success && <ErrorMessage message={success} type="success" />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {organs.map((organ) => (
            <div key={organ.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
                    <Heart className="w-5 h-5 fill-rose-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{organ.organ_type}</h3>
                    <p className="text-xs text-slate-400">Blood Group: {organ.blood_group}</p>
                  </div>
                </div>
                <StatusBadge status={organ.status} />
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <p><strong>Location:</strong> {organ.location}</p>
                <p><strong>Procurement Date:</strong> {new Date(organ.procurement_date || organ.created_at).toLocaleString()}</p>
                <p><strong>Viability Window:</strong> {organ.viability_hours} Hours ({organ.viability_status})</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal to Pledge Organ */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Pledge Additional Organ">
          <form onSubmit={handleSubmit(onAddOrgan)} className="space-y-4">
            <SelectInput label="Select Organ" name="organType" options={supportedOrgans} register={register} errors={errors} required />
            <FormInput label="Viability Notes (Optional)" name="viabilityStatus" register={register} errors={errors} placeholder="Optimal" />
            <div className="pt-2 flex justify-end space-x-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm">Submit Organ Pledge</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
