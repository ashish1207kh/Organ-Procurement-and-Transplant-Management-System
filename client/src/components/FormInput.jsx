import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function FormInput({
  label,
  name,
  type = 'text',
  register,
  errors,
  required,
  placeholder,
  helpText,
  className = '',
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          {...(register ? register(name, { required: required ? `${label || name} is required` : false }) : {})}
          {...rest}
          className={`w-full px-3.5 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
            errors && errors[name]
              ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:ring-rose-400'
              : 'border-slate-200 bg-white text-slate-800'
          } ${isPassword ? 'pr-10' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {helpText && !errors?.[name] && (
        <p className="text-[11px] text-slate-400 mt-0.5">{helpText}</p>
      )}
      {errors && errors[name] && (
        <p className="text-[11px] text-rose-500 font-medium">{errors[name].message}</p>
      )}
    </div>
  );
}

export function SelectInput({
  label,
  name,
  options,
  register,
  errors,
  required,
  helpText,
  className = '',
  ...rest
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        {...(register ? register(name, { required: required ? `${label || name} is required` : false }) : {})}
        {...rest}
        className={`w-full px-3.5 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-white ${
          errors && errors[name]
            ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:ring-rose-400'
            : 'border-slate-200 text-slate-800'
        }`}
      >
        <option value="">-- Select {label || 'Option'} --</option>
        {options.map((opt) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
      {helpText && !errors?.[name] && (
        <p className="text-[11px] text-slate-400 mt-0.5">{helpText}</p>
      )}
      {errors && errors[name] && (
        <p className="text-[11px] text-rose-500 font-medium">{errors[name].message}</p>
      )}
    </div>
  );
}
