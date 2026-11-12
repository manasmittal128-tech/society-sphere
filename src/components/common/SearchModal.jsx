import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, Calendar, Briefcase, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { societies, events, recruitments } = useData();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedSocieties = q
    ? societies.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          (s.acronym || '').toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          (s.type && s.type.toLowerCase().includes(q)) ||
          (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
      ).slice(0, 4)
    : societies.slice(0, 3);

  const matchedEvents = q
    ? events.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.societyName.toLowerCase().includes(q) ||
          (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
      ).slice(0, 3)
    : events.slice(0, 2);

  const matchedRecruitments = q
    ? recruitments.filter(
        r =>
          r.cycleTitle.toLowerCase().includes(q) ||
          r.societyName.toLowerCase().includes(q) ||
          r.departments.some(d => d.name.toLowerCase().includes(q))
      ).slice(0, 3)
    : recruitments.filter(r => r.isOpen).slice(0, 2);

  const handleSelect = (url) => {
    navigate(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800/80">
          <Search className="w-5 h-5 text-brand-violet shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search TIET organizations (CCS, MLSC, MUDRA), fests, induction drives..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono text-slate-400 bg-dark-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-6">
          {/* Societies Section */}
          {matchedSocieties.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5 text-brand-violet" />
                Societies
              </div>
              <div className="space-y-1">
                {matchedSocieties.map(society => (
                  <button
                    key={society.id}
                    onClick={() => handleSelect(`/societies/${society.id}`)}
                    className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-dark-800/80 transition-colors group"
                  >
                    <img
                      src={society.logo}
                      alt={society.name}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white group-hover:text-brand-violet-light transition-colors truncate">
                          {society.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-violet/15 text-brand-violet-light border border-brand-violet/30 font-medium">
                          {society.type}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-dark-750 text-slate-300 border border-slate-700">
                          {society.acronym}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{society.tagline}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-violet group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Events Section */}
          {matchedEvents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                Events & Workshops
              </div>
              <div className="space-y-1">
                {matchedEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => handleSelect('/events')}
                    className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-dark-800/80 transition-colors group"
                  >
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="w-12 h-9 rounded-lg object-cover border border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white group-hover:text-brand-blue-light transition-colors truncate">
                        {event.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{event.societyName}</span>
                        <span>•</span>
                        <span className="text-brand-cyan">{event.date}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recruitment Section */}
          {matchedRecruitments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Briefcase className="w-3.5 h-3.5 text-brand-cyan" />
                Recruitment Drives
              </div>
              <div className="space-y-1">
                {matchedRecruitments.map(rec => (
                  <button
                    key={rec.id}
                    onClick={() => handleSelect('/recruitment')}
                    className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-dark-800/80 transition-colors group"
                  >
                    <img
                      src={rec.societyLogo}
                      alt={rec.societyName}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white group-hover:text-brand-cyan-light transition-colors truncate">
                        {rec.cycleTitle}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {rec.societyName} • Closes {rec.deadline}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      Open
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && matchedSocieties.length === 0 && matchedEvents.length === 0 && matchedRecruitments.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <p className="text-base font-medium">No results found for "{query}"</p>
              <p className="text-sm text-slate-400 mt-1">Try searching for "GDG", "Hackathon", "Robotics", or "Dance"</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-3 bg-dark-950 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-dark-800 rounded border border-slate-700">Enter</kbd> to open</span>
            <span><kbd className="px-1.5 py-0.5 bg-dark-800 rounded border border-slate-700">Esc</kbd> to dismiss</span>
          </div>
          <span className="text-brand-violet-light font-medium">SocietySphere Search</span>
        </div>
      </div>
    </div>
  );
}
