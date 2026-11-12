import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Clock,
  Sparkles,
  Users,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { RecruitmentCard } from '../components/recruitment/RecruitmentCard';
import { getRecruitmentUrgency } from '../utils/recommendations';
import { TIET_CATEGORIES } from '../data/mockData';

export function RecruitmentPortal() {
  const { recruitments, applications } = useData();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [filterUrgentOnly, setFilterUrgentOnly] = useState(false);

  const filteredRecruitments = useMemo(() => {
    return recruitments
      .filter(r => r.isOpen) // Active recruiting drives only
      .filter(r => {
        if (selectedCategory !== 'All Categories' && r.category !== selectedCategory) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = r.cycleTitle.toLowerCase().includes(q);
          const matchSociety = r.societyName.toLowerCase().includes(q);
          const matchDept = r.departments.some(d => d.name.toLowerCase().includes(q));
          if (!matchTitle && !matchSociety && !matchDept) return false;
        }

        if (filterUrgentOnly) {
          const urgency = getRecruitmentUrgency(r.deadline);
          if (!urgency.urgent) return false;
        }

        return true;
      });
  }, [recruitments, selectedCategory, searchQuery, filterUrgentOnly]);

  const userAppliedRecruitmentIds = applications
    .filter(a => a.applicantId === currentUser?.id)
    .map(a => a.recruitmentId);

  return (
    <div className="space-y-8">
      {/* Top Urgency Hero Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-violet/20 via-dark-900 to-brand-cyan/20 border border-brand-violet/30 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            TIET Student Organization Induction Drives
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            TIET Recruitment Portal
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Apply to executive councils, technical developer wings, design teams, and event operations across Creative Computing Society, MLSC, MUDRA, and OWASP. Build campus impact and leadership skills.
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-amber-300/80 pt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Demonstration recruitment cycles with multi-step application form and live status tracking.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-brand-violet" />
              <strong className="text-white">{recruitments.filter(r => r.isOpen).length}</strong> Active Induction Drives
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <strong className="text-white">{userAppliedRecruitmentIds.length}</strong> Applications Submitted by You
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TIET_CATEGORIES.map(category => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-brand-violet text-white shadow-glow-violet border border-brand-violet/40'
                  : 'bg-dark-900 hover:bg-dark-850 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by society (CCS, MLSC, MUDRA), domain, or role..."
            className="w-full pl-10 pr-10 py-2 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-xs sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setFilterUrgentOnly(!filterUrgentOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              filterUrgentOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-dark-850 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Urgent Deadlines (≤ 3 Days)
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white font-bold">{filteredRecruitments.length}</strong> active hiring drives
        </span>
        {(searchQuery || selectedCategory !== 'All Categories' || filterUrgentOnly) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
              setFilterUrgentOnly(false);
            }}
            className="text-brand-violet-light font-semibold hover:underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {filteredRecruitments.length === 0 ? (
        <div className="p-16 rounded-3xl bg-dark-900 border border-slate-800 text-center space-y-3 text-slate-400">
          <Briefcase className="w-12 h-12 mx-auto opacity-40 text-slate-400" />
          <h3 className="text-lg font-bold text-white">No active recruitments match your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try choosing a different domain category or clearing your urgent deadline filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecruitments.map(rec => (
            <RecruitmentCard key={rec.id} recruitment={rec} />
          ))}
        </div>
      )}
    </div>
  );
}
