import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UserCheck, Save } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { FormInput } from '../../components/FormInput';
import { LoadingSpinner, ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function RecipientProfile() {
  const { profile, refreshUser } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        hospital: profile.hospital || '',
        city: profile.city || '',
        state: profile.state || '',
        medicalHistory: profile.medical_history || '',
        currentMedications: profile.current_medications || '',
        allergies: profile.allergies || ''
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await api.put('/recipients/profile', data);
      if (res.data.success) {
        setSuccess('Recipient profile updated successfully.');
        refreshUser();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout role="RECIPIENT">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Recipient Medical Profile</h1>
              <p className="text-xs text-slate-500">Update medical history and treating hospital information</p>
            </div>
          </div>

          {error && <ErrorMessage message={error} type="error" />}
          {success && <ErrorMessage message={success} type="success" />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="First Name" name="firstName" register={register} errors={errors} required />
              <FormInput label="Last Name" name="lastName" register={register} errors={errors} required />
              <FormInput label="Phone Number" name="phone" register={register} errors={errors} required />
              <FormInput label="Hospital / Medical Center" name="hospital" register={register} errors={errors} required />
              <FormInput label="City" name="city" register={register} errors={errors} required />
              <FormInput label="State" name="state" register={register} errors={errors} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
              <FormInput label="Medical History" name="medicalHistory" register={register} errors={errors} />
              <FormInput label="Current Medications" name="currentMedications" register={register} errors={errors} />
              <FormInput label="Allergies" name="allergies" register={register} errors={errors} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-sky-600 hover:bg-sky-700 shadow-md transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
