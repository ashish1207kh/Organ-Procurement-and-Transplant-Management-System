import React from 'react';

const statusStyles = {
  AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  TRANSPLANTED: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',

  WAITING: 'bg-amber-50 text-amber-700 border-amber-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',

  MATCHED: 'bg-sky-50 text-sky-700 border-sky-200',
  ALLOCATED: 'bg-indigo-50 text-indigo-700 border-indigo-200',

  WITHDRAWN: 'bg-rose-50 text-rose-700 border-rose-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  EXPIRED: 'bg-slate-100 text-slate-600 border-slate-200',

  CRITICAL: 'bg-rose-600 text-white font-bold',
  HIGH: 'bg-amber-500 text-white font-semibold',
  MEDIUM: 'bg-sky-500 text-white',
  LOW: 'bg-slate-500 text-white',
  INACTIVE: 'bg-slate-100 text-slate-600 border-slate-200'
};

export default function StatusBadge({ status, className = '' }) {
  const normalized = status ? status.toUpperCase() : 'UNKNOWN';
  const styleClass = statusStyles[normalized] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styleClass} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
}
