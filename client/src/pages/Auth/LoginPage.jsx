import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, KeyRound } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import { FormInput } from '../../components/FormInput';
import { ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'donor';

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [activeRole, setActiveRole] = useState(initialRole.toUpperCase());
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialRole) {
      setActiveRole(initialRole.toUpperCase());
    }
  }, [initialRole]);

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      });

      if (res.data.success) {
        const { token, user, profile } = res.data.data;
        loginUser(token, user, profile);

        if (user.role === 'DONOR') {
          navigate('/donor/dashboard');
        } else if (user.role === 'RECIPIENT') {
          navigate('/recipient/dashboard');
        } else if (user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        }
      }
    } catch (err) {
      setServerError('We couldn\'t sign you in with those details. Please check your email and password and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="py-16 bg-slate-50 min-h-[calc(100vh-10rem)] flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full px-4">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                <LogIn className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Sign in to your account</h1>
              <p className="text-xs text-slate-500">Access your donor or recipient portal</p>
            </div>

            {/* Role selector tab */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveRole('DONOR')}
                className={`py-2 rounded-lg transition-all ${
                  activeRole === 'DONOR' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Donor Login
              </button>
              <button
                type="button"
                onClick={() => setActiveRole('RECIPIENT')}
                className={`py-2 rounded-lg transition-all ${
                  activeRole === 'RECIPIENT' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Candidate Login
              </button>
            </div>

            {/* Demo Credentials Box */}
            <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 text-[11px] text-sky-900 space-y-1">
              <p className="font-bold flex items-center space-x-1">
                <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                <span>Demo Credentials:</span>
              </p>
              {activeRole === 'DONOR' ? (
                <p>Email: <code className="bg-white px-1 py-0.5 rounded border border-sky-200">john.david@example.com</code> | Pass: <code className="bg-white px-1 py-0.5 rounded border border-sky-200">Password@123</code></p>
              ) : (
                <p>Email: <code className="bg-white px-1 py-0.5 rounded border border-sky-200">arun.kumar@example.com</code> | Pass: <code className="bg-white px-1 py-0.5 rounded border border-sky-200">Password@123</code></p>
              )}
            </div>

            {serverError && <ErrorMessage message={serverError} type="error" />}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                register={register}
                errors={errors}
                required
                placeholder="registered@example.com"
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                register={register}
                errors={errors}
                required
                placeholder="••••••••"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing in...' : `Sign in to ${activeRole === 'DONOR' ? 'Donor' : 'Candidate'} Portal`}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs text-slate-500">
              <p>
                Don't have an account?{' '}
                <Link
                  to={activeRole === 'DONOR' ? '/register/donor' : '/register/recipient'}
                  className="text-sky-600 font-bold hover:underline"
                >
                  Create one now
                </Link>
              </p>

              <p>
                Administrator access?{' '}
                <Link to="/admin-login" className="text-slate-800 font-bold hover:underline">
                  Sign in as Admin
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
