import React from 'react';

const statusStyles = {
  AVAILABLE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  WAITING: 'bg-amber-100 text-amber-800 border-amber-300',
  MATCHED: 'bg-sky-100 text-sky-800 border-sky-300',
  ALLOCATED: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  TRANSPLANTED: 'bg-purple-100 text-purple-800 border-purple-300',
  ACCEPTED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  PENDING: 'bg-amber-100 text-amber-800 border-amber-300',
  WITHDRAWN: 'bg-rose-100 text-rose-800 border-rose-300',
  CANCELLED: 'bg-rose-100 text-rose-800 border-rose-300',
  EXPIRED: 'bg-slate-200 text-slate-700 border-slate-300',
  APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  REJECTED: 'bg-rose-100 text-rose-800 border-rose-300',
  CRITICAL: 'bg-red-600 text-white font-bold animate-pulse',
  HIGH: 'bg-orange-500 text-white font-semibold',
  MEDIUM: 'bg-amber-500 text-white',
  LOW: 'bg-sky-500 text-white',
  ACTIVE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  INACTIVE: 'bg-slate-100 text-slate-600 border-slate-300'
};

export default function StatusBadge({ status, className = '' }) {
  const normalized = status ? status.toUpperCase() : 'UNKNOWN';
  const styleClass = statusStyles[normalized] || 'bg-slate-100 text-slate-800 border-slate-300';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styleClass} ${className}`}>
      {status}
    </span>
  );
}
