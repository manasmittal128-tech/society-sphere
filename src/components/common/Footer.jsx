import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Calendar, Briefcase, Radio, Heart, ExternalLink } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from './BrandIcons';
import { TIET_CATEGORIES, TIET_ORG_TYPES } from '../../data/mockData';

export function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-slate-800/80 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-violet to-brand-cyan p-[1px] shadow-glow-violet">
                <div className="w-full h-full bg-dark-950 rounded-[7px] flex items-center justify-center">
                  <span className="text-base font-black bg-gradient-to-r from-brand-violet-light to-brand-cyan-light bg-clip-text text-transparent">
                    S
                  </span>
                </div>
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">SocietySphere</span>
                <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                  TIET Edition
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Discover your people. Find your community. The centralized platform for students of <span className="text-slate-200 font-medium">Thapar Institute of Engineering & Technology, Patiala</span> to explore official societies, clubs, student chapters, and cells.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-850 hover:bg-dark-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-slate-800"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-850 hover:bg-dark-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-slate-800"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-850 hover:bg-dark-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-slate-800"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>

            <div className="p-3 rounded-xl bg-dark-900 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <div>
                <span className="text-brand-violet-light font-semibold">Campus Context:</span> Thapar Institute of Engineering & Technology, Patiala, Punjab, India (Estd. 1956).
              </div>
              <div className="text-[10px] text-slate-400">
                Primary directory reference: <a href="https://studentsocieties.thapar.edu/" target="_blank" rel="noreferrer" className="text-brand-cyan hover:underline inline-flex items-center gap-0.5">studentsocieties.thapar.edu <ExternalLink className="w-2.5 h-2.5" /></a>. Sample schedules and applicant records are demonstration data.
              </div>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">TIET Directory</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/societies" className="hover:text-white transition-colors">
                  Explore All Organizations
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Events Hub & Fests
                </Link>
              </li>
              <li>
                <Link to="/recruitment" className="hover:text-white transition-colors">
                  Recruitment Drives
                </Link>
              </li>
              <li>
                <Link to="/feed" className="hover:text-white transition-colors">
                  Campus Feed & Notices
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  TIET Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Domains</h4>
            <ul className="space-y-2 text-xs">
              {TIET_CATEGORIES.filter(c => c !== 'All Categories').slice(0, 7).map(category => (
                <li key={category}>
                  <Link
                    to={`/societies?category=${encodeURIComponent(category)}`}
                    className="hover:text-white transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Administration & Official Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">TIET Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://studentsocieties.thapar.edu/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-brand-cyan"
                >
                  Official Societies Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://thapar.edu/aboutus/pages/societies"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-slate-300"
                >
                  Dean Student Affairs (DoSA) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors text-brand-violet-light font-medium">
                  Society Lead Admin Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Demo Sign-In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 mt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SocietySphere — TIET Student Communities. Patiala, Punjab.</p>
          <div className="flex items-center gap-1 text-slate-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5 inline" /> for Thapar Institute of Engineering & Technology
          </div>
        </div>
      </div>
    </footer>
  );
}
