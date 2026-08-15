import React from 'react';

export default function DashboardCard({ title, value, subtitle, icon: Icon, color = 'sky', trend }) {
  const colorMap = {
    sky: 'bg-sky-500 text-sky-50',
    emerald: 'bg-emerald-500 text-emerald-50',
    rose: 'bg-rose-500 text-rose-50',
    amber: 'bg-amber-500 text-amber-50',
    indigo: 'bg-indigo-500 text-indigo-50',
    purple: 'bg-purple-500 text-purple-50'
  };

  const bgIconClass = colorMap[color] || colorMap.sky;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <span className="inline-block mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
        {Icon && (
          <div className={`p-4 rounded-2xl shadow-sm ${bgIconClass}`}>
            <Icon className="w-7 h-7" />
          </div>
        )}
      </div>
    </div>
  );
}
