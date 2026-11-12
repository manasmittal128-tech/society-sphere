import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Briefcase, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { getRecruitmentUrgency } from '../../utils/recommendations';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ApplicationModal } from './ApplicationModal';

export function RecruitmentCard({ recruitment }) {
  const { applications } = useData();
  const { currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const urgency = getRecruitmentUrgency(recruitment.deadline);
  const myApplication = applications.find(
    a => a.recruitmentId === recruitment.id && a.applicantId === currentUser?.id
  );

  return (
    <>
      <div className="group relative bg-dark-900 border border-slate-800/80 hover:border-slate-700 rounded-3xl p-6 transition-all duration-300 hover:shadow-hover-card flex flex-col justify-between">
        <div>
          {/* Header Row: Society Logo, Category, Urgency */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Link to={`/societies/${recruitment.societyId}`}>
                <img
                  src={recruitment.societyLogo}
                  alt={recruitment.societyName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-800 shadow-md group-hover:scale-105 transition-transform"
                />
              </Link>
              <div>
                <Link
                  to={`/societies/${recruitment.societyId}`}
                  className="text-xs font-semibold text-brand-violet-light hover:underline line-clamp-1"
                >
                  {recruitment.societyName}
                </Link>
                <h3 className="text-base font-bold text-white group-hover:text-brand-violet-light transition-colors line-clamp-1">
                  {recruitment.cycleTitle}
                </h3>
              </div>
            </div>

            {/* Urgency Pill */}
            <div
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                urgency.color === 'rose'
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : urgency.color === 'amber'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-brand-violet/15 text-brand-violet-light border-brand-violet/30'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{urgency.text}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {recruitment.description}
          </p>

          {/* Departments Open */}
          <div className="mb-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Hiring Departments ({recruitment.departments.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {recruitment.departments.map(dept => (
                <span
                  key={dept.id || dept.name}
                  className="text-xs px-2.5 py-1 rounded-lg bg-dark-850 text-slate-200 border border-slate-800 font-medium flex items-center gap-1.5"
                >
                  <span>{dept.name}</span>
                  <span className="text-[10px] text-brand-cyan">({dept.seats || 3})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Perks Preview */}
          {recruitment.perks && recruitment.perks.length > 0 && (
            <div className="mb-5 p-3 rounded-xl bg-dark-950/70 border border-slate-800/80">
              <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-violet" />
                <span>Selected Members Receive</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1">
                {recruitment.perks.slice(0, 2).map((perk, i) => (
                  <li key={i} className="line-clamp-1 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-brand-violet" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer & Actions */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span><strong className="text-slate-200">{recruitment.totalApplicants || 0}</strong> applied</span>
          </div>

          <div>
            {myApplication ? (
              <Link
                to="/my-communities"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-violet/20 text-brand-violet-light border border-brand-violet/40 hover:bg-brand-violet/30 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Track: {myApplication.status}</span>
              </Link>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-violet to-brand-blue hover:from-brand-violet-dark hover:to-brand-blue-dark shadow-glow-violet transition-all"
              >
                Apply Now
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <ApplicationModal
        recruitment={recruitment}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
