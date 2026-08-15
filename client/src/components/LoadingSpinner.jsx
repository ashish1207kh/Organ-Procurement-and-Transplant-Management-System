import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-semibold text-slate-500">{message}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">{content}</div>;
  }
  return content;
}

export function ErrorMessage({ message, type = 'error' }) {
  if (!message) return null;
  const isSuccess = type === 'success';

  return (
    <div
      className={`p-4 rounded-xl border flex items-start space-x-3 text-sm animate-in fade-in duration-150 ${
        isSuccess
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-rose-50 border-rose-200 text-rose-800'
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1 font-medium">{message}</div>
    </div>
  );
}

export function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'rose' }) {
  if (!isOpen) return null;

  const btnClass = confirmVariant === 'rose'
    ? 'bg-rose-600 hover:bg-rose-700 text-white'
    : 'bg-sky-600 hover:bg-sky-700 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full border border-slate-100 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{message}</p>
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors ${btnClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
