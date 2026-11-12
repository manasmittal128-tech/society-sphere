import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Briefcase,
  Users,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  Clock,
  Ticket,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getSmartRecommendations, getRecruitmentUrgency } from '../utils/recommendations';
import { SocietyCard } from '../components/society/SocietyCard';
import { EventCard } from '../components/event/EventCard';
import { RecruitmentCard } from '../components/recruitment/RecruitmentCard';

export function StudentDashboard() {
  const { currentUser } = useAuth();
  const { societies, events, recruitments, announcements, applications, followedSocieties, registeredEvents } = useData();

  // Smart Recommendations tailored to this student
  const recommendedSocieties = getSmartRecommendations(currentUser, societies, 4);

  // Filter student's followed societies
  const myFollowed = societies.filter(s => followedSocieties.includes(s.id));

  // Filter student's upcoming registered events
  const myEvents = events.filter(e => registeredEvents.includes(e.id));

  // Filter active recruitments
  const openRecruitments = recruitments.filter(r => r.isOpen).slice(0, 3);

  // My submitted applications
  const myApplications = applications.filter(a => a.applicantId === currentUser?.id);

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Personalized Welcome Banner */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-violet/20 via-dark-900 to-brand-blue/15 border border-brand-violet/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-brand-violet/50 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-extrabold text-white">
                  Welcome back, {currentUser?.name?.split(' ')[0]}! 👋
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                  TIET Patiala
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {currentUser?.branch} • {currentUser?.academicYear} • {currentUser?.college || 'Thapar Institute of Engineering & Technology, Patiala'}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {(currentUser?.interests || []).slice(0, 4).map(i => (
                  <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-dark-950/80 text-brand-violet-light border border-slate-700">
                    #{i}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Link
              to="/societies"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-violet hover:bg-brand-violet-dark transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Compass className="w-3.5 h-3.5" />
              Discover Societies
            </Link>
            <Link
              to="/my-communities"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-brand-cyan" />
              My Communities
            </Link>
          </div>
        </div>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-dark-950/60 border border-slate-800/80">
            <div className="text-xl font-black text-white">{followedSocieties.length}</div>
            <div className="text-[11px] text-slate-400 font-medium">Followed Societies</div>
          </div>
          <div className="p-3 rounded-2xl bg-dark-950/60 border border-slate-800/80">
            <div className="text-xl font-black text-brand-cyan-light">{registeredEvents.length}</div>
            <div className="text-[11px] text-slate-400 font-medium">Event RSVPs</div>
          </div>
          <div className="p-3 rounded-2xl bg-dark-950/60 border border-slate-800/80">
            <div className="text-xl font-black text-brand-violet-light">{myApplications.length}</div>
            <div className="text-[11px] text-slate-400 font-medium">Active Applications</div>
          </div>
          <div className="p-3 rounded-2xl bg-dark-950/60 border border-slate-800/80">
            <div className="text-xl font-black text-emerald-400">
              {myApplications.filter(a => a.status === 'Selected' || a.status === 'Shortlisted').length}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Interviews & Shortlists</div>
          </div>
        </div>
      </section>

      {/* SMART RECOMMENDATIONS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-violet-light uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
              <span>Smart Recommendation Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Recommended for You
            </h2>
          </div>
          <Link
            to="/profile"
            className="text-xs text-brand-cyan-light hover:underline font-medium"
          >
            Edit your interests & skills →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedSocieties.map(society => (
            <SocietyCard
              key={society.id}
              society={society}
              isRecommended={true}
              matchScore={society.matchScore}
              matchReason={society.primaryReason}
            />
          ))}
        </div>
      </section>

      {/* TWO COLUMNS: Followed Societies + Registered Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Followed Societies (Col 1 & 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-brand-violet" />
              Followed Societies ({myFollowed.length})
            </h2>
            <Link to="/societies" className="text-xs text-brand-violet-light hover:underline font-medium">
              Explore more
            </Link>
          </div>

          {myFollowed.length === 0 ? (
            <div className="p-8 rounded-3xl bg-dark-900 border border-slate-800 text-center text-slate-400">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium text-white">You haven't followed any societies yet</p>
              <p className="text-xs text-slate-400 mt-1">Follow societies to see their latest announcements here.</p>
              <Link
                to="/societies"
                className="mt-4 inline-block px-4 py-2 rounded-xl text-xs font-semibold bg-brand-violet text-white"
              >
                Explore Society Directory
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myFollowed.map(soc => (
                <div
                  key={soc.id}
                  className="p-4 rounded-2xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group"
                >
                  <Link to={`/societies/${soc.id}`} className="flex items-center gap-3 min-w-0">
                    <img
                      src={soc.logo}
                      alt={soc.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white group-hover:text-brand-violet-light transition-colors truncate">
                        {soc.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">{soc.category} • {soc.memberCount} members</p>
                    </div>
                  </Link>

                  <Link
                    to={`/societies/${soc.id}`}
                    className="p-2 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-white transition-colors shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Active Application Status Strip */}
          {myApplications.length > 0 && (
            <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800 mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-brand-cyan" />
                  Your Active Applications ({myApplications.length})
                </span>
                <Link to="/my-communities" className="text-xs text-brand-cyan-light hover:underline font-medium">
                  View tracker →
                </Link>
              </div>

              <div className="space-y-2">
                {myApplications.map(app => (
                  <div
                    key={app.id}
                    className="p-3 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={app.societyLogo} alt={app.societyName} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{app.societyName}</div>
                        <div className="text-[11px] text-slate-400 truncate">{app.selectedDepartment}</div>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border shrink-0 ${
                        app.status === 'Selected'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : app.status === 'Shortlisted' || app.status === 'Interview Scheduled'
                          ? 'bg-brand-cyan/20 text-brand-cyan-light border-brand-cyan/40'
                          : 'bg-dark-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: My Event RSVPs & Announcements */}
        <div className="space-y-6">
          {/* Upcoming Registered Events */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-brand-cyan" />
                Your Event Passes ({myEvents.length})
              </h3>
              <Link to="/events" className="text-xs text-brand-cyan-light hover:underline font-medium">
                Browse events
              </Link>
            </div>

            {myEvents.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                <p>No registered events.</p>
                <Link to="/events" className="text-brand-violet-light font-semibold hover:underline block mt-1">
                  Discover hackathons & workshops →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myEvents.map(evt => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-2xl bg-dark-850 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-brand-violet-light">{evt.date}</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Confirmed
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{evt.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{evt.venue}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Campus Announcements */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-brand-violet" />
                Latest Announcements
              </h3>
              <Link to="/feed" className="text-xs text-brand-violet-light hover:underline font-medium">
                Full feed
              </Link>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map(ann => (
                <div key={ann.id} className="p-3 rounded-xl bg-dark-850 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white line-clamp-1">{ann.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{ann.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* OPEN RECRUITMENT OPPORTUNITIES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Recruitment Opportunities Currently Open
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Apply before deadlines expire.</p>
          </div>
          <Link to="/recruitment" className="text-xs font-semibold text-brand-violet-light hover:underline">
            View all recruitment drives →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {openRecruitments.map(rec => (
            <RecruitmentCard key={rec.id} recruitment={rec} />
          ))}
        </div>
      </section>
    </div>
  );
}
