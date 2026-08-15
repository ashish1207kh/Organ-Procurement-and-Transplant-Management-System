import React from 'react';

export function FormInput({ label, name, type = 'text', register, errors, required, placeholder, className = '', ...rest }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        {...(register ? register(name, { required: required ? `${label || name} is required` : false }) : {})}
        {...rest}
        className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
          errors && errors[name]
            ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:ring-rose-400'
            : 'border-slate-200 focus:border-transparent text-slate-800'
        }`}
      />
      {errors && errors[name] && (
        <p className="text-xs text-rose-500 font-medium">{errors[name].message}</p>
      )}
    </div>
  );
}

export function SelectInput({ label, name, options, register, errors, required, className = '', ...rest }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        {...(register ? register(name, { required: required ? `${label || name} is required` : false }) : {})}
        {...rest}
        className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-white ${
          errors && errors[name]
            ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:ring-rose-400'
            : 'border-slate-200 focus:border-transparent text-slate-800'
        }`}
      >
        <option value="">-- Select {label || 'Option'} --</option>
        {options.map((opt) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
      {errors && errors[name] && (
        <p className="text-xs text-rose-500 font-medium">{errors[name].message}</p>
      )}
    </div>
  );
}
