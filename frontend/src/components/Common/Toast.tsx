import React from 'react';
import { useInterview } from '../../context/InterviewContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useInterview();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full no-print">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
          info: <Info className="w-4 h-4 text-blue-600 shrink-0" />,
          warning: <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
        };

        const borders = {
          success: 'border-emerald-200 bg-white',
          info: 'border-blue-200 bg-white',
          warning: 'border-amber-200 bg-white',
          error: 'border-red-200 bg-white'
        };

        return (
          <div
            key={toast.id}
            className={`p-3 border rounded-sm shadow-md flex items-start space-x-2.5 ${borders[toast.type]} transition-all animate-in slide-in-from-right-5`}
          >
            <div className="mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#0F172A]">{toast.title}</p>
              {toast.message && <p className="text-[11px] text-[#64748B] mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
