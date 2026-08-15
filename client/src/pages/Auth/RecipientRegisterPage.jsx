import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Hospital } from 'lucide-react';
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
      setServerError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!data.consent) {
      setServerError('You must accept terms and conditions for waiting-list enrollment.');
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
        setSuccessMessage('You\'re all set. Your recipient candidate profile has been created successfully.');
        loginUser(res.data.data.token, res.data.data.user, res.data.data.recipient);
        setTimeout(() => {
          navigate('/recipient/dashboard');
        }, 1800);
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'We couldn\'t complete your registration right now. Please review your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="py-12 bg-slate-50 min-h-[calc(100vh-10rem)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-1.5 pb-4 border-b border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                <UserPlus className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Recipient Candidate Registration</h1>
              <p className="text-xs text-slate-500">
                Enroll on the transplant candidate registry and waiting queue.
              </p>
            </div>

            {serverError && <ErrorMessage message={serverError} type="error" />}
            {successMessage && <ErrorMessage message={successMessage} type="success" />}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Section 1: Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="First Name" name="firstName" register={register} errors={errors} required />
                  <FormInput label="Last Name" name="lastName" register={register} errors={errors} required />
                  <FormInput label="Email Address" name="email" type="email" register={register} errors={errors} required helpText="Used to sign into your candidate portal" />
                  <FormInput label="Phone Number" name="phone" register={register} errors={errors} required />
                  <FormInput label="Date of Birth" name="dateOfBirth" type="date" register={register} errors={errors} required />
                  <SelectInput label="Gender" name="gender" options={['MALE', 'FEMALE', 'OTHER']} register={register} errors={errors} required />
                </div>
              </div>

              {/* Section 2: Account Credentials */}
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Account Credentials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Password" name="password" type="password" register={register} errors={errors} required helpText="Must be at least 6 characters" />
                  <FormInput label="Confirm Password" name="confirmPassword" type="password" register={register} errors={errors} required />
                </div>
              </div>

              {/* Section 3: Organ Requirement & Medical Facility */}
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Organ Requirement & Medical Center</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectInput label="Blood Group" name="bloodGroup" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} register={register} errors={errors} required helpText="Used for blood compatibility" />
                  <SelectInput label="Required Organ" name="requiredOrgan" options={supportedOrgans} register={register} errors={errors} required />
                  <SelectInput label="Medical Urgency" name="urgencyLevel" options={['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']} register={register} errors={errors} required helpText="Clinical urgency tier" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <FormInput label="Treating Hospital" name="hospital" register={register} errors={errors} required placeholder="e.g. Springfield General" />
                  <FormInput label="City" name="city" register={register} errors={errors} required />
                  <FormInput label="State" name="state" register={register} errors={errors} required />
                </div>
              </div>

              {/* Section 4: Medical History */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                <FormInput label="Medical History" name="medicalHistory" register={register} errors={errors} placeholder="e.g. End-stage renal disease" />
                <FormInput label="Current Medications" name="currentMedications" register={register} errors={errors} placeholder="e.g. Immunosuppressants" />
                <FormInput label="Allergies" name="allergies" register={register} errors={errors} placeholder="e.g. Penicillin, Latex" />
              </div>

              {/* Terms Checkbox */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consent"
                    {...register('consent', { required: 'You must accept candidate terms to proceed.' })}
                    className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
                  />
                  <label htmlFor="consent" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                    <strong className="text-slate-800 font-bold">Waiting Registry Enrollment:</strong> I request enrollment on the transplant waiting list. I consent to compatibility matching evaluations and data sharing with authorized medical transplant centers.
                  </label>
                </div>
                {errors.consent && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.consent.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Enrolling Candidate...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Complete Candidate Enrollment</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500">
                Already registered?{' '}
                <Link to="/login?role=recipient" className="text-sky-600 font-bold hover:underline">
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
