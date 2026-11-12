import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Ticket,
  Bell,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { StatusStepper } from '../components/recruitment/StatusStepper';

export function MyCommunities() {
  const { currentUser } = useAuth();
  const {
    societies,
    events,
    applications,
    announcements,
    followedSocieties,
    registeredEvents,
    toggleFollow,
    unregisterForEvent,
    withdrawApplication
  } = useData();

  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'societies' | 'events' | 'announcements'
  const [selectedTicketEvent, setSelectedTicketEvent] = useState(null);

  const myFollowed = societies.filter(s => followedSocieties.includes(s.id));
  const myApplications = applications.filter(a => a.applicantId === currentUser?.id);
  const myEvents = events.filter(e => registeredEvents.includes(e.id));
  const myAnnouncements = announcements.filter(a => followedSocieties.includes(a.societyId));

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
            TIET Student Space • Patiala
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            My Communities & Applications
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Manage your followed TIET organizations, track induction progress in real time through the Status Stepper, and access your event admission passes.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-px">
        {[
          { key: 'applications', label: `My Applications (${myApplications.length})`, icon: Briefcase },
          { key: 'societies', label: `Followed Societies (${myFollowed.length})`, icon: Users },
          { key: 'events', label: `Registered Events (${myEvents.length})`, icon: Ticket },
          { key: 'announcements', label: `Society Feed (${myAnnouncements.length})`, icon: Bell },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isSelected
                  ? 'border-brand-violet text-brand-violet-light'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: APPLICATIONS & TRACKER */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {myApplications.length === 0 ? (
            <div className="p-16 rounded-3xl bg-dark-900 border border-slate-800 text-center space-y-3 text-slate-400">
              <Briefcase className="w-12 h-12 mx-auto opacity-40 text-slate-400" />
              <h3 className="text-lg font-bold text-white">No active recruitment applications</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Discover collegiate societies currently inducting students into technical, cultural, and leadership positions.
              </p>
              <Link
                to="/recruitment"
                className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-violet text-white mt-2"
              >
                Browse Open Recruitments
              </Link>
            </div>
          ) : (
            myApplications.map(app => (
              <div
                key={app.id}
                className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-slate-800 space-y-6 shadow-xl"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={app.societyLogo}
                      alt={app.societyName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-800"
                    />
                    <div>
                      <Link
                        to={`/societies/${app.societyId}`}
                        className="text-base font-bold text-white hover:text-brand-violet-light transition-colors"
                      >
                        {app.societyName}
                      </Link>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Applied for <strong className="text-brand-cyan-light">{app.selectedDepartment}</strong> on {new Date(app.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => {
                        if (window.confirm(`Withdraw application to ${app.societyName}?`)) {
                          withdrawApplication(app.id);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* Status Stepper Progression */}
                <div className="py-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
                    Induction Pipeline Progress
                  </span>
                  <StatusStepper
                    status={app.status}
                    interviewDate={app.interviewDate}
                    interviewVenue={app.interviewVenue}
                  />
                </div>

                {/* Admin notes if any */}
                {app.adminNotes && (
                  <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-brand-violet-light block">Review Feedback from Society Admin:</span>
                    <p className="text-slate-300 italic">"{app.adminNotes}"</p>
                  </div>
                )}

                {/* Submitted details preview */}
                <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
                  <div>
                    <span className="block text-slate-400">Target Department:</span>
                    <span className="font-semibold text-white">{app.selectedDepartment}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Weekly Commitment:</span>
                    <span className="font-semibold text-white">{app.hoursPerWeek}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Resume / Portfolio:</span>
                    <a
                      href={app.resumeUrl || app.githubOrPortfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-cyan-light hover:underline font-semibold flex items-center gap-1 mt-0.5"
                    >
                      <span>View Submitted Document</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: FOLLOWED SOCIETIES */}
      {activeTab === 'societies' && (
        <div className="space-y-6">
          {myFollowed.length === 0 ? (
            <div className="p-16 rounded-3xl bg-dark-900 border border-slate-800 text-center space-y-3 text-slate-400">
              <Users className="w-12 h-12 mx-auto opacity-40 text-slate-400" />
              <h3 className="text-lg font-bold text-white">No followed societies yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore campus clubs and societies to follow their announcements and recruitment updates.
              </p>
              <Link
                to="/societies"
                className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-violet text-white mt-2"
              >
                Explore Societies
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myFollowed.map(society => (
                <div
                  key={society.id}
                  className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={society.logo}
                        alt={society.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-800"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/societies/${society.id}`}
                          className="text-base font-bold text-white hover:text-brand-violet-light transition-colors line-clamp-1"
                        >
                          {society.name}
                        </Link>
                        <span className="text-xs text-brand-violet-light font-medium">
                          {society.category} • {society.acronym}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {society.tagline}
                    </p>

                    <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                      <span>{society.memberCount} members</span>
                      <span>{society.followerCount} followers</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => toggleFollow(society.id)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-dark-850 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-800 transition-colors"
                    >
                      Unfollow
                    </button>
                    <Link
                      to={`/societies/${society.id}`}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-white border border-slate-700 transition-colors text-center"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REGISTERED EVENTS & TICKETS */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {myEvents.length === 0 ? (
            <div className="p-16 rounded-3xl bg-dark-900 border border-slate-800 text-center space-y-3 text-slate-400">
              <Ticket className="w-12 h-12 mx-auto opacity-40 text-slate-400" />
              <h3 className="text-lg font-bold text-white">No registered events</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                RSVP for upcoming hackathons, music concerts, and technical workshops in the Events Hub.
              </p>
              <Link
                to="/events"
                className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-violet text-white mt-2"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myEvents.map(evt => (
                <div
                  key={evt.id}
                  className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        RSVP Confirmed
                      </span>
                      <h4 className="text-base font-bold text-white mt-2 line-clamp-1">{evt.title}</h4>
                      <p className="text-xs text-slate-400">{evt.societyName}</p>
                    </div>

                    <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
                      <QrCode className="w-14 h-14 text-slate-900" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 bg-dark-850 p-3.5 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-brand-violet shrink-0" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                      <span>{evt.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <button
                      onClick={() => unregisterForEvent(evt.id)}
                      className="text-rose-400 hover:underline font-semibold"
                    >
                      Cancel Registration
                    </button>
                    <span className="text-slate-400 font-mono text-[11px]">
                      PASS-ID: #{evt.id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SOCIETY FEED & NOTICES */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {myAnnouncements.length === 0 ? (
            <div className="p-16 rounded-3xl bg-dark-900 border border-slate-800 text-center space-y-3 text-slate-400">
              <Bell className="w-12 h-12 mx-auto opacity-40 text-slate-400" />
              <h3 className="text-lg font-bold text-white">No notices from your followed societies</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                When societies you follow publish circulars or updates, they will appear here.
              </p>
            </div>
          ) : (
            myAnnouncements.map(ann => (
              <div
                key={ann.id}
                className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={ann.societyLogo} alt={ann.societyName} className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-bold text-white">{ann.societyName}</span>
                  </div>
                  <span className="text-xs text-slate-400">{ann.date}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{ann.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
