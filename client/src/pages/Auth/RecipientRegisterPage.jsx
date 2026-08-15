import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Hospital, CheckCircle2 } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import { FormInput, SelectInput } from '../../components/FormInput';
import { ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function RecipientRegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

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
      setServerError('You must accept the terms and conditions for waiting list enrollment.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register/recipient', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        requiredOrgan: data.requiredOrgan,
        medicalHistory: data.medicalHistory,
        currentMedications: data.currentMedications,
        allergies: data.allergies,
        hospital: data.hospital,
        city: data.city,
        state: data.state,
        urgencyLevel: data.urgencyLevel,
        consent: data.consent
      });

      if (res.data.success) {
        setSuccessMessage(res.data.message || 'Signup completed. Please log in.');
        loginUser(res.data.data.token, res.data.data.user, res.data.data.recipient);
        setTimeout(() => {
          navigate('/recipient/dashboard');
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
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto shadow-md">
                <UserPlus className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Transplant Recipient Registration</h1>
              <p className="text-xs text-slate-500">
                Enroll on the national organ transplant waiting list and compatibility matching system.
              </p>
            </div>

            {serverError && <ErrorMessage message={serverError} type="error" />}
            {successMessage && <ErrorMessage message={successMessage} type="success" />}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Personal Details */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">1. Personal Information</h3>
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
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">2. Account Credentials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Password" name="password" type="password" register={register} errors={errors} required placeholder="At least 6 characters" />
                  <FormInput label="Confirm Password" name="confirmPassword" type="password" register={register} errors={errors} required />
                </div>
              </div>

              {/* Medical & Organ Requirements */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">3. Organ Requirement & Medical Center</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectInput label="Blood Group" name="bloodGroup" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} register={register} errors={errors} required />
                  <SelectInput label="Required Organ" name="requiredOrgan" options={supportedOrgans} register={register} errors={errors} required />
                  <SelectInput label="Medical Urgency Level" name="urgencyLevel" options={['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']} register={register} errors={errors} required />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <FormInput label="Hospital / Medical Center" name="hospital" register={register} errors={errors} required placeholder="e.g. Springfield General Hospital" />
                  <FormInput label="City" name="city" register={register} errors={errors} required />
                  <FormInput label="State" name="state" register={register} errors={errors} required />
                </div>
              </div>

              {/* Medical History */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput label="Medical History" name="medicalHistory" register={register} errors={errors} placeholder="e.g. End-stage renal disease" />
                <FormInput label="Current Medications" name="currentMedications" register={register} errors={errors} placeholder="e.g. Immunosuppressants" />
                <FormInput label="Allergies" name="allergies" register={register} errors={errors} placeholder="e.g. Penicillin, Latex" />
              </div>

              {/* Terms & Consent */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consent"
                    {...register('consent', { required: 'You must accept waiting list terms to proceed.' })}
                    className="mt-1 rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
                  />
                  <label htmlFor="consent" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                    <strong className="text-slate-900 font-semibold">Waiting List & Matching Consent:</strong> I request enrollment on the OPTM organ transplant waiting registry. I consent to medical matching score evaluations and information sharing with authorized transplant centers.
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
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-sky-600 hover:bg-sky-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Enrolling Recipient...</span>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Complete Recipient Enrollment</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500">
                Already registered?{' '}
                <Link to="/login?role=recipient" className="text-sky-600 font-semibold hover:underline">
                  Log in to Recipient Portal
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
