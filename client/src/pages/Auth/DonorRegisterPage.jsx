import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import { FormInput, SelectInput } from '../../components/FormInput';
import { ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DonorRegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const supportedOrgans = [
    'Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Intestines',
    'Corneas', 'Skin', 'Bone Marrow', 'Bones', 'Tendons'
  ];

  const onSubmit = async (data) => {
    setServerError('');
    setSuccessMessage('');

    if (data.password !== data.confirmPassword) {
      setServerError('Passwords do not match.');
      return;
    }

    if (!data.consent) {
      setServerError('You must acknowledge and accept informed consent terms to register as a donor.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register/donor', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        address: data.address,
        city: data.city,
        state: data.state,
        medicalHistory: data.medicalHistory,
        currentMedications: data.currentMedications,
        allergies: data.allergies,
        organWillingToDonate: data.organWillingToDonate,
        consent: data.consent
      });

      if (res.data.success) {
        setSuccessMessage(res.data.message || 'Thank you for your kind act. Your donor registration has been completed.');
        loginUser(res.data.data.token, res.data.data.user, res.data.data.donor);
        setTimeout(() => {
          navigate('/donor/dashboard');
        }, 2000);
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please check inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="py-12 bg-slate-50 min-h-[calc(100vh-10rem)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mx-auto shadow-md">
                <HeartPulse className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Organ Donor Registration</h1>
              <p className="text-xs text-slate-500">
                Pledge your organ donation and join the national OPTM registry.
              </p>
            </div>

            {serverError && <ErrorMessage message={serverError} type="error" />}
            {successMessage && <ErrorMessage message={successMessage} type="success" />}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Personal Details */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">1. Personal & Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="First Name" name="firstName" register={register} errors={errors} required />
                  <FormInput label="Last Name" name="lastName" register={register} errors={errors} required />
                  <FormInput label="Email Address" name="email" type="email" register={register} errors={errors} required />
                  <FormInput label="Phone Number" name="phone" register={register} errors={errors} required />
                  <FormInput label="Date of Birth" name="dateOfBirth" type="date" register={register} errors={errors} required />
                  <SelectInput label="Gender" name="gender" options={['MALE', 'FEMALE', 'OTHER']} register={register} errors={errors} required />
                </div>
              </div>

              {/* Security */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">2. Account Security</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Password" name="password" type="password" register={register} errors={errors} required placeholder="At least 6 characters" />
                  <FormInput label="Confirm Password" name="confirmPassword" type="password" register={register} errors={errors} required />
                </div>
              </div>

              {/* Location & Blood Group */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">3. Medical Profile & Organ Pledge</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectInput label="Blood Group" name="bloodGroup" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} register={register} errors={errors} required />
                  <FormInput label="City" name="city" register={register} errors={errors} required />
                  <FormInput label="State" name="state" register={register} errors={errors} required />
                </div>
                <div className="mt-4">
                  <FormInput label="Street Address" name="address" register={register} errors={errors} required />
                </div>
              </div>

              {/* Medical History */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput label="Medical History (Optional)" name="medicalHistory" register={register} errors={errors} placeholder="e.g. None or Hypertension" />
                <FormInput label="Current Medications" name="currentMedications" register={register} errors={errors} placeholder="e.g. Multivitamins" />
                <FormInput label="Allergies" name="allergies" register={register} errors={errors} placeholder="e.g. Penicillin, Dust" />
              </div>

              {/* Organ Willing to Donate */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Select Organ(s) Willing to Donate <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {supportedOrgans.map((organ) => (
                    <label key={organ} className="flex items-center space-x-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="checkbox"
                        value={organ}
                        {...register('organWillingToDonate', { required: 'Please select at least one organ to donate' })}
                        className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
                      />
                      <span>{organ}</span>
                    </label>
                  ))}
                </div>
                {errors.organWillingToDonate && (
                  <p className="text-xs text-rose-500 font-medium">{errors.organWillingToDonate.message}</p>
                )}
              </div>

              {/* Informed Consent Checkbox */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consent"
                    {...register('consent', { required: 'You must check the informed consent box to proceed.' })}
                    className="mt-1 rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
                  />
                  <label htmlFor="consent" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                    <strong className="text-slate-900 font-semibold">Informed Consent Acknowledgement:</strong> I voluntarily pledge to donate my selected organs upon medical and legal evaluation. I acknowledge that organ donation is purely voluntary, non-commercial, and can be withdrawn at any time prior to allocation.
                  </label>
                </div>
                {errors.consent && (
                  <p className="text-xs text-rose-500 font-medium">{errors.consent.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white gradient-accent shadow-md hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Processing Donor Registration...</span>
                ) : (
                  <>
                    <Heart className="w-5 h-5 fill-white" />
                    <span>Complete Donor Registration</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500">
                Already have a donor account?{' '}
                <Link to="/login?role=donor" className="text-sky-600 font-semibold hover:underline">
                  Log in here
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
