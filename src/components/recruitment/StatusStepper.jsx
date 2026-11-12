import React from 'react';
import { Check, Clock, Calendar, CheckCircle2, XCircle } from 'lucide-react';

export function StatusStepper({ status, interviewDate, interviewVenue }) {
  const steps = [
    { key: 'Submitted', label: 'Submitted' },
    { key: 'Under Review', label: 'Under Review' },
    { key: 'Shortlisted', label: 'Shortlisted' },
    { key: 'Interview Scheduled', label: 'Interview' },
    { key: 'Final Status', label: status === 'Not Selected' ? 'Not Selected' : 'Selected' },
  ];

  // Helper to determine active step index
  const getStepIndex = (st) => {
    switch (st) {
      case 'Submitted': return 0;
      case 'Under Review': return 1;
      case 'Shortlisted': return 2;
      case 'Interview Scheduled': return 3;
      case 'Selected': return 4;
      case 'Not Selected': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);
  const isRejected = status === 'Not Selected';
  const isAccepted = status === 'Selected';

  return (
    <div className="w-full space-y-3">
      {/* Stepper bar */}
      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-dark-800 -z-0" />

        {/* Progress active bar */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 transition-all duration-500 -z-0 ${
            isRejected ? 'bg-rose-500' : 'bg-gradient-to-r from-brand-violet to-brand-cyan'
          }`}
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex || (idx === currentIndex && (isAccepted || isRejected));
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                  idx === 4 && isRejected
                    ? 'bg-rose-500 text-white ring-4 ring-rose-500/20'
                    : idx === 4 && isAccepted
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                    : isCompleted
                    ? 'bg-brand-violet text-white ring-4 ring-brand-violet/20'
                    : isCurrent
                    ? 'bg-dark-900 border-2 border-brand-cyan text-brand-cyan ring-4 ring-brand-cyan/20'
                    : 'bg-dark-850 border border-slate-700 text-slate-400'
                }`}
              >
                {idx === 4 && isRejected ? (
                  <XCircle className="w-4 h-4" />
                ) : isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium mt-1.5 whitespace-nowrap text-center ${
                  idx === 4 && isRejected
                    ? 'text-rose-400 font-semibold'
                    : idx === 4 && isAccepted
                    ? 'text-emerald-400 font-semibold'
                    : isCurrent
                    ? 'text-brand-cyan-light font-bold'
                    : isCompleted
                    ? 'text-slate-200'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Interview notice box if Interview Scheduled */}
      {status === 'Interview Scheduled' && (
        <div className="p-3.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-xs text-brand-cyan-light flex items-start gap-2.5 animate-in fade-in">
          <Calendar className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white">Interview Confirmed!</div>
            <p className="mt-0.5">
              Scheduled on <strong className="text-brand-cyan">{new Date(interviewDate || Date.now()).toLocaleString()}</strong>
            </p>
            <p className="text-slate-300">Venue / Meeting: {interviewVenue || 'Turing Lab Room 302'}</p>
          </div>
        </div>
      )}

      {/* Selected celebration box */}
      {status === 'Selected' && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white">Congratulations! You are Selected!</div>
            <p className="mt-0.5 text-slate-300">
              Welcome to the core team. Check your campus email for the orientation schedule.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
