import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookmarkCheck, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function SocietyCard({ society, viewMode = 'grid', isRecommended = false, matchScore = null, matchReason = null }) {
  const { followedSocieties, toggleFollow } = useData();
  const isFollowing = followedSocieties.includes(society.id);

  const categoryColor = {
    'Technical / Academic': 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    'Cultural / Visual Arts': 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    'Entrepreneurship': 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    'Debate / Literary': 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    'Social Impact': 'border-teal-500/30 text-teal-400 bg-teal-500/10',
    'Sports / Fitness': 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    'Special Interest': 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    // Fallbacks for legacy tags
    Technical: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    Cultural: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    Literary: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    Sports: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
  }[society.category] || 'border-slate-700 text-slate-300 bg-slate-800';

  const typeBadgeColor = {
    Society: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    Club: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    'Student Chapter': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    Cell: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    Unit: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
  }[society.type] || 'bg-slate-800 text-slate-300 border-slate-700';

  if (viewMode === 'list') {
    return (
      <div className="group relative bg-dark-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-hover-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
          <Link to={`/societies/${society.id}`} className="shrink-0 relative">
            <img
              src={society.logo}
              alt={society.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-800 shadow-md group-hover:scale-105 transition-transform"
            />
            {society.recruitmentOpen && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${categoryColor}`}>
                {society.category}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${typeBadgeColor}`}>
                {society.type || 'Organization'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-dark-800 text-slate-400 border border-slate-700/60 font-mono">
                {society.acronym}
              </span>
              {society.recruitmentOpen && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Recruiting
                </span>
              )}
              {isRecommended && matchScore && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {matchScore}% Match
                </span>
              )}
            </div>

            <Link to={`/societies/${society.id}`}>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-violet-light transition-colors truncate">
                {society.name}
              </h3>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 line-clamp-1 mt-0.5">
              {society.tagline}
            </p>

            {matchReason && (
              <p className="text-xs text-brand-cyan-light/90 mt-1 font-medium flex items-center gap-1">
                <span>✨</span> {matchReason}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <strong className="text-slate-300 font-semibold">{society.memberCount}</strong> members
              </span>
              <span>•</span>
              <div className="flex items-center gap-1.5 overflow-hidden">
                {(society.tags || []).slice(0, 3).map(tag => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-dark-800 text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
          <button
            onClick={() => toggleFollow(society.id)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              isFollowing
                ? 'bg-dark-800 text-slate-300 border border-slate-700 hover:border-rose-500/50 hover:text-rose-400'
                : 'bg-brand-violet/15 hover:bg-brand-violet/25 text-brand-violet-light border border-brand-violet/30'
            }`}
          >
            {isFollowing ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Following
              </>
            ) : (
              <>
                <BookmarkCheck className="w-3.5 h-3.5" />
                Follow
              </>
            )}
          </button>

          <Link
            to={`/societies/${society.id}`}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-white border border-slate-700 transition-colors"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Grid view card
  return (
    <div className="group relative bg-dark-900 border border-slate-800/80 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-hover-card hover:-translate-y-1">
      {/* Banner preview */}
      <div className="relative h-28 w-full overflow-hidden bg-dark-950">
        <img
          src={society.coverImage}
          alt={society.name}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />

        {/* Category & Type Pills */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[70%]">
          <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md ${categoryColor}`}>
            {society.category}
          </span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border backdrop-blur-md ${typeBadgeColor}`}>
            {society.type || 'Organization'}
          </span>
        </div>

        {/* Recruitment urgency pill */}
        {society.recruitmentOpen && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 backdrop-blur-md text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Recruiting
          </div>
        )}
      </div>

      {/* Society Body */}
      <div className="p-5 flex-1 flex flex-col -mt-7 relative z-10">
        {/* Logo and acronym */}
        <div className="flex items-end justify-between mb-3">
          <div className="relative">
            <img
              src={society.logo}
              alt={society.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-dark-900 shadow-xl bg-dark-950"
            />
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-dark-800 text-slate-300 border border-slate-700 font-mono font-semibold">
            {society.acronym}
          </span>
        </div>

        {/* Match reason badge if recommended */}
        {isRecommended && matchScore && (
          <div className="mb-2.5 px-2.5 py-1 rounded-lg bg-brand-violet/15 border border-brand-violet/30 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-violet-light">
              <Sparkles className="w-3 h-3 text-brand-violet" />
              <span>{matchScore}% Match</span>
            </div>
            {matchReason && (
              <span className="text-[10px] text-slate-300 truncate max-w-[170px]" title={matchReason}>
                {matchReason}
              </span>
            )}
          </div>
        )}

        {/* Title & Tagline */}
        <Link to={`/societies/${society.id}`} className="block">
          <h3 className="text-base font-bold text-white group-hover:text-brand-violet-light transition-colors line-clamp-1">
            {society.name}
          </h3>
        </Link>

        <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 mb-4 leading-relaxed flex-1">
          {society.tagline || society.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(society.tags || []).slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-dark-800 text-slate-300 border border-slate-800"
            >
              #{tag}
            </span>
          ))}
          {(society.tags || []).length > 3 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{(society.tags || []).length - 3}
            </span>
          )}
        </div>

        {/* Member and follower stats */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span><strong className="text-slate-200 font-semibold">{society.memberCount}</strong> members</span>
          </div>
          <span>•</span>
          <div>
            <strong className="text-slate-200 font-semibold">{society.followerCount}</strong> followers
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={() => toggleFollow(society.id)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isFollowing
                ? 'bg-dark-800 text-slate-300 border border-slate-700 hover:border-rose-500/40 hover:text-rose-400'
                : 'bg-brand-violet/15 hover:bg-brand-violet/25 text-brand-violet-light border border-brand-violet/30'
            }`}
          >
            {isFollowing ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Following
              </>
            ) : (
              <>
                <BookmarkCheck className="w-3.5 h-3.5" />
                Follow
              </>
            )}
          </button>

          <Link
            to={`/societies/${society.id}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-white border border-slate-700 transition-colors"
          >
            Explore
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
