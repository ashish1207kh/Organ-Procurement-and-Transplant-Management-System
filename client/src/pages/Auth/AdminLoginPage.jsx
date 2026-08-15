import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, KeyRound } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import { FormInput } from '../../components/FormInput';
import { ErrorMessage } from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/admin-login', {
        username: data.username,
        email: data.username,
        password: data.password
      });

      if (res.data.success) {
        const { token, user } = res.data.data;
        loginUser(token, user);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="py-16 bg-slate-900 min-h-[calc(100vh-10rem)] flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full px-4">
          <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700 space-y-6 text-white">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/30">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-extrabold">Administrator Portal</h1>
              <p className="text-xs text-slate-400">Authorized Medical Operations Management</p>
            </div>

            {/* Demo Admin Credentials Box */}
            <div className="p-3 bg-slate-700/60 rounded-xl border border-slate-600 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-sky-400 flex items-center space-x-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Demo Admin Credentials:</span>
              </p>
              <p>Username / Email: <code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300">admin@optm.org</code> or <code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300">admin</code></p>
              <p>Password: <code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300">Admin@123</code></p>
            </div>

            {serverError && <ErrorMessage message={serverError} type="error" />}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-slate-800">
              <FormInput
                label="Username or Email"
                name="username"
                register={register}
                errors={errors}
                required
                placeholder="admin@optm.org"
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
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white gradient-accent shadow-lg shadow-sky-500/25 hover:shadow-xl transition-all disabled:opacity-50 mt-2"
              >
                {loading ? 'Authenticating Admin...' : 'Log In to Administrator Portal'}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-700 text-center text-xs text-slate-400">
              <Link to="/role-selection" className="hover:text-white transition-colors">
                ← Return to Role Selection
              </Link>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
