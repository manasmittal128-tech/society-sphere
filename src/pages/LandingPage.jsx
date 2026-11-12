import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Briefcase,
  Users,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  TrendingUp,
  Shield,
  Layers,
  Award,
  Zap,
  Globe,
  Building2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { SocietyCard } from '../components/society/SocietyCard';
import { EventCard } from '../components/event/EventCard';
import { RecruitmentCard } from '../components/recruitment/RecruitmentCard';
import { TIET_CATEGORIES } from '../data/mockData';

export function LandingPage() {
  const { societies, events, recruitments } = useData();
  const { currentUser, isStudent } = useAuth();
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');

  const featuredSocieties = societies.filter(s => s.featured).slice(0, 4);
  const upcomingEvents = events.slice(0, 3);
  const urgentRecruitments = recruitments.filter(r => r.isOpen).slice(0, 3);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/societies?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/societies');
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle background glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-violet/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-brand-cyan/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900 border border-brand-violet/30 shadow-glow-violet backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-brand-violet-light animate-pulse" />
            <span className="text-xs font-semibold text-brand-violet-light">
              Thapar Institute of Engineering & Technology • Patiala Campus
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Your Campus.{' '}
              <span className="bg-gradient-to-r from-brand-violet-light via-brand-blue-light to-brand-cyan bg-clip-text text-transparent">
                Your Communities.
              </span>{' '}
              <br className="hidden sm:inline" />
              Your Opportunities.
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover official student societies, clubs, student chapters & cells at TIET Patiala. RSVP for HackTU, Makeathon & Saturnalia, and submit induction applications in one unified platform.
            </p>
          </div>

          {/* Hero Search Bar */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto">
            <div className="relative flex items-center p-2 rounded-2xl bg-dark-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl focus-within:border-brand-violet transition-all">
              <Search className="w-5 h-5 text-brand-violet shrink-0 ml-3 mr-2" />
              <input
                type="text"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                placeholder="Search TIET bodies (CCS, MLSC, EDC, NOX) or fields (AI, Robotics, Music)..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none px-2"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-violet to-brand-blue hover:from-brand-violet-dark hover:to-brand-blue-dark shadow-glow-violet transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick category pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
              <span className="font-semibold text-slate-400">Popular Domains:</span>
              {['Technical / Academic', 'Cultural / Visual Arts', 'Entrepreneurship', 'Debate / Literary', 'Social Impact'].map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => navigate(`/societies?category=${encodeURIComponent(cat)}`)}
                  className="px-3 py-1 rounded-full bg-dark-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </form>

          {/* Key Metric Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-dark-900/70 border border-slate-800/80">
              <div className="text-2xl sm:text-3xl font-black text-white">{societies.length}+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">TIET Student Bodies</div>
            </div>
            <div className="p-4 rounded-2xl bg-dark-900/70 border border-slate-800/80">
              <div className="text-2xl sm:text-3xl font-black text-brand-cyan-light">{events.length}</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Flagship Fests & Workshops</div>
            </div>
            <div className="p-4 rounded-2xl bg-dark-900/70 border border-slate-800/80">
              <div className="text-2xl sm:text-3xl font-black text-brand-violet-light">{recruitments.filter(r => r.isOpen).length}</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Active Induction Drives</div>
            </div>
            <div className="p-4 rounded-2xl bg-dark-900/70 border border-slate-800/80">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">10,000+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Patiala Campus Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SOCIETIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-violet-light uppercase tracking-wider mb-2">
              <Award className="w-4 h-4 text-brand-violet" />
              <span>Campus Spotlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Featured TIET Organizations
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Top student bodies recognized under the TIET Student Activities Directory.
            </p>
          </div>

          <Link
            to="/societies"
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-violet-light hover:text-white transition-colors"
          >
            <span>Browse all {societies.length} organizations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSocieties.map(society => (
            <SocietyCard key={society.id} society={society} />
          ))}
        </div>
      </section>

      {/* UPCOMING EVENTS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-cyan-light uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4 text-brand-cyan" />
              <span>Campus Calendar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Flagship Events & Workshops
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              HackTU 6.0, Mudra Night, HackOWASP, TEDxTIET, and RoboClash across Patiala campus venues.
            </p>
          </div>

          <Link
            to="/events"
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-cyan-light hover:text-white transition-colors"
          >
            <span>View Events Hub & Calendar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* ACTIVE RECRUITMENT DRIVES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-brand-violet/15 via-dark-900 to-dark-950 border border-brand-violet/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                <Briefcase className="w-4 h-4" />
                <span>Induction Drive Active</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                TIET Society Recruitment Season
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Leading organizations like CCS, MLSC, MUDRA, and OWASP are screening freshmen and sophomores for technical, creative, and managerial wings.
              </p>
            </div>

            <Link
              to="/recruitment"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-violet hover:bg-brand-violet-dark transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Explore All Induction Drives</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {urgentRecruitments.map(rec => (
              <RecruitmentCard key={rec.id} recruitment={rec} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY SOCIETYSPHERE / BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-block text-xs font-bold text-brand-violet-light uppercase tracking-wider">
            Engineered For Thapar Campus Life
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why TIETians Choose SocietySphere
          </h2>
          <p className="text-sm text-slate-400">
            No more buried WhatsApp messages, conflicting hall bookings, or confusing Google Forms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-violet/15 text-brand-violet border border-brand-violet/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Branch-Smart Recommendations</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Curated for COE, CSBS, ECE, ME, and biotech students. Discover societies aligned with your engineering discipline and personal passions.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/15 text-brand-blue border border-brand-blue/30 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Campus Venue Passports</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Events scheduled at COS Complex, TAN Building, Main Auditorium, and Central Library with 1-click registration and QR admission tickets.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Status Stepper Recruitment</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Submit your answers and track screening, interview invites, and acceptance stages with zero ambiguity.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-dark-900/60 border border-slate-800">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-brand-cyan-light uppercase tracking-wider">
              Step-by-Step Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How SocietySphere Works for Thapar Students
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Set Your TIET Profile',
                desc: 'Select your engineering branch (COE, ECE, ME, etc.) and interests in your student profile.'
              },
              {
                step: '02',
                title: 'Explore Organizations',
                desc: 'Filter 40+ official bodies by Society, Club, Student Chapter, or Cell.'
              },
              {
                step: '03',
                title: 'Attend Campus Fests',
                desc: 'RSVP for HackTU, Mudra Nights, or E-Summit with instant QR admission.'
              },
              {
                step: '04',
                title: 'Induct & Lead',
                desc: 'Apply for core wings, clear interview rounds, and build leadership credentials.'
              }
            ].map(item => (
              <div key={item.step} className="p-5 rounded-2xl bg-dark-850/80 border border-slate-800 space-y-2">
                <span className="text-2xl font-black bg-gradient-to-r from-brand-violet to-brand-cyan bg-clip-text text-transparent">
                  {item.step}
                </span>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-brand-violet/20 via-dark-900 to-brand-blue/20 border border-brand-violet/40 shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Discover your people. Find your community at TIET.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join fellow Thaparites who explore campus societies, attend premier events, and build lifelong friendships.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/societies"
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-violet to-brand-blue hover:from-brand-violet-dark hover:to-brand-blue-dark shadow-glow-violet transition-all flex items-center gap-2"
            >
              <span>Explore All TIET Organizations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-dark-800 hover:bg-dark-750 text-slate-200 border border-slate-700 transition-colors"
            >
              Open Student Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
