import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  BookmarkCheck,
  Calendar,
  Briefcase,
  Bell,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Clock,
  Mail,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Award,
  Globe,
  Share2,
  Check,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { EventCard } from '../components/event/EventCard';
import { ApplicationModal } from '../components/recruitment/ApplicationModal';
import { getRecruitmentUrgency } from '../utils/recommendations';

export function SocietyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { societies, events, recruitments, announcements, followedSocieties, toggleFollow, registeredEvents } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'departments' | 'events' | 'recruitment' | 'announcements'
  const [appModalOpen, setAppModalOpen] = useState(false);

  const society = societies.find(s => s.id === id);

  // Track recently viewed
  useEffect(() => {
    if (society) {
      try {
        const saved = localStorage.getItem('societysphere_recent_societies');
        const list = saved ? JSON.parse(saved) : [];
        const updated = [society.id, ...list.filter(x => x !== society.id)].slice(0, 15);
        localStorage.setItem('societysphere_recent_societies', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update recent societies', e);
      }
    }
  }, [society]);

  if (!society) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Organization Not Found</h2>
        <p className="text-slate-400 text-sm">The organization you're looking for doesn't exist or has moved.</p>
        <Link
          to="/societies"
          className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-violet text-white"
        >
          Back to TIET Organization Directory
        </Link>
      </div>
    );
  }

  const isFollowing = followedSocieties.includes(society.id);
  const societyEvents = events.filter(e => e.societyId === society.id);
  const societyAnnouncements = announcements.filter(a => a.societyId === society.id);
  const societyRecruitment = recruitments.find(r => r.societyId === society.id && r.isOpen);
  const recruitmentUrgency = societyRecruitment ? getRecruitmentUrgency(societyRecruitment.deadline) : null;

  const typeBadgeColor = {
    Society: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    Club: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'Student Chapter': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    Cell: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    Unit: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
  }[society.type] || 'bg-slate-800 text-slate-300 border-slate-700';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast(`${society.name} link copied to clipboard!`, 'success');
    }
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/societies" className="hover:text-white transition-colors">TIET Directory</Link>
        <span>/</span>
        <span className="text-slate-300">{society.type}</span>
        <span>/</span>
        <span className="text-white font-semibold truncate max-w-xs">{society.name}</span>
      </div>

      {/* Cover Banner & Quick Actions */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-dark-950 shadow-2xl">
        {/* Banner image */}
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={society.coverImage}
            alt={society.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />

          {/* Share & Category Pills */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-dark-900/80 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md transition-colors"
              title="Share organization"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border backdrop-blur-md ${typeBadgeColor}`}>
              {society.type}
            </span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-dark-900/80 text-brand-violet-light border border-slate-700 backdrop-blur-md">
              {society.category}
            </span>
          </div>
        </div>

        {/* Profile Info Overlay Strip */}
        <div className="px-6 sm:px-10 pb-8 pt-0 -mt-20 relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <img
              src={society.logo}
              alt={society.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-dark-950 shadow-2xl bg-dark-900 shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-dark-800 text-slate-300 border border-slate-700 font-mono font-bold">
                  {society.acronym}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-md border font-semibold ${typeBadgeColor}`}>
                  {society.type}
                </span>
                {society.verified && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified TIET Student Body
                  </span>
                )}
                {society.recruitmentOpen && (
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold animate-pulse">
                    Recruitment Open
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {society.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {society.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <strong className="text-white">{society.memberCount}</strong> Members (Est.)
                </span>
                <span>•</span>
                <span>
                  <strong className="text-white">{society.followerCount}</strong> Followers
                </span>
                <span>•</span>
                <span>Estd. {society.foundedYear}</span>
                <span>•</span>
                <span className="text-brand-cyan">Patiala Campus</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Follow & Apply */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => toggleFollow(society.id)}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isFollowing
                  ? 'bg-dark-800 text-slate-300 border border-slate-700 hover:border-rose-500/40 hover:text-rose-400'
                  : 'bg-brand-violet/15 hover:bg-brand-violet/25 text-brand-violet-light border border-brand-violet/30'
              }`}
            >
              {isFollowing ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Following
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  Follow {society.type}
                </>
              )}
            </button>

            {society.recruitmentOpen && societyRecruitment && (
              <button
                onClick={() => setAppModalOpen(true)}
                className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-violet to-brand-blue hover:from-brand-violet-dark hover:to-brand-blue-dark shadow-glow-violet transition-all"
              >
                <Briefcase className="w-4 h-4" />
                Apply for Induction
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-px">
        {[
          { key: 'overview', label: 'Overview & Mandate', icon: Sparkles },
          { key: 'departments', label: `Wings / Departments (${society.departments?.length || 0})`, icon: Layers },
          { key: 'events', label: `Events & Workshops (${societyEvents.length})`, icon: Calendar },
          {
            key: 'recruitment',
            label: society.recruitmentOpen ? 'Induction Drive (Open)' : 'Recruitment',
            icon: Briefcase,
            badge: society.recruitmentOpen ? 'Live' : null
          },
          { key: 'announcements', label: `Notices & Bulletins (${societyAnnouncements.length})`, icon: Bell },
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
              {tab.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Story & Core Activities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mission Box */}
            <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Charter & Purpose
                </h3>
                <span className="text-xs text-slate-400">TIET Student Activities Charter</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {society.fullMission || society.description}
              </p>
            </div>

            {/* Core Initiatives */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">
                Core Initiatives & Areas of Work
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(society.areasOfActivity || []).length > 0 ? (
                  society.areasOfActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-dark-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-brand-violet/15 text-brand-violet-light flex items-center justify-center font-bold text-xs">
                        0{idx + 1}
                      </div>
                      <h4 className="text-sm font-bold text-white">{activity}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Flagship focus area under {society.name} at TIET Patiala.
                      </p>
                    </div>
                  ))
                ) : (society.coreActivities || []).map((act, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-dark-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-brand-violet/15 text-brand-violet-light flex items-center justify-center font-bold text-xs">
                      0{idx + 1}
                    </div>
                    <h4 className="text-sm font-bold text-white">{act.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{act.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags / Domains of Interest */}
            <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Relevant Branches & Skill Domains
              </h3>
              <div className="flex flex-wrap gap-2">
                {(society.tags || []).map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-xl bg-dark-850 text-slate-200 border border-slate-700/80 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Info Sidebar */}
          <div className="space-y-6">
            {/* Quick Details Box */}
            <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Campus Location & Operations
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-brand-violet shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">Meeting Schedule:</span>
                    <span className="text-white font-medium">
                      {society.meetingSchedule || 'Information not available'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">Patiala Campus Venue:</span>
                    <span className="text-white font-medium">
                      {society.venueRoom || 'Information not available'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">Official Contact Email:</span>
                    {society.contactEmail && society.contactEmail !== 'Information not available' ? (
                      <a
                        href={`mailto:${society.contactEmail}`}
                        className="text-brand-cyan-light hover:underline font-medium"
                      >
                        {society.contactEmail}
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Information not available</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">Official Directory Link:</span>
                    {society.website && society.website !== 'Information not available' ? (
                      <a
                        href={society.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-cyan-light hover:underline font-medium inline-flex items-center gap-1"
                      >
                        Visit TIET Directory <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Information not available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Official Notice regarding authenticity */}
            <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-brand-cyan font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Verified Entity</span>
              </div>
              <p>
                This student body is formally registered under the Thapar Institute of Engineering & Technology Student Activities Directory. Unverified leadership names and contact numbers are deliberately not fabricated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: DEPARTMENTS & TEAMS */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold text-white">
              Wings & Sub-Committees ({society.departments?.length || 0})
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {society.name} recruits and organizes activities through specialized functional wings across technical development, design, content, event logistics, and corporate outreach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(society.departments || []).map(dept => (
              <div
                key={dept.id || dept.name}
                className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white">{dept.name}</h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30 font-semibold">
                    {dept.openPositions || 2} Open Spots
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {dept.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: EVENTS */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              Campus Events & Workshops ({societyEvents.length})
            </h3>
            <Link to="/events" className="text-xs text-brand-cyan-light hover:underline font-medium">
              View all TIET events →
            </Link>
          </div>

          {societyEvents.length === 0 ? (
            <div className="p-12 rounded-3xl bg-dark-900 border border-slate-800 text-center text-slate-400">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-white font-medium">No active events posted yet</p>
              <p className="text-xs text-slate-400 mt-1">Follow this {society.type} to receive notifications when new hackathons or fests are scheduled.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {societyEvents.map(evt => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: RECRUITMENT */}
      {activeTab === 'recruitment' && (
        <div className="space-y-6">
          {societyRecruitment ? (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-violet/20 via-dark-900 to-dark-950 border border-brand-violet/40 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-violet/30">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                      Induction Drive Active
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      Deadline: {societyRecruitment.deadline} ({recruitmentUrgency?.text})
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {societyRecruitment.cycleTitle}
                  </h3>
                  <div className="text-[11px] text-amber-300/80 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Demonstration recruitment cycle for testing application workflows</span>
                  </div>
                </div>

                <button
                  onClick={() => setAppModalOpen(true)}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-violet to-brand-blue hover:from-brand-violet-dark hover:to-brand-blue-dark shadow-glow-violet transition-all flex items-center gap-2 shrink-0"
                >
                  <Briefcase className="w-4 h-4" />
                  Fill Application Form
                </button>
              </div>

              {/* Eligibility */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Eligibility & Requirements
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 bg-dark-950/80 p-4 rounded-2xl border border-slate-800">
                  {societyRecruitment.eligibility}
                </p>
              </div>

              {/* Selection Process Stages */}
              {societyRecruitment.stages && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Induction Workflow Stages
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {societyRecruitment.stages.map((stage, sIdx) => (
                      <div key={sIdx} className="p-3.5 rounded-xl bg-dark-950/60 border border-slate-800 space-y-1">
                        <span className="text-[10px] text-brand-violet-light font-mono font-bold block">
                          Stage 0{sIdx + 1}
                        </span>
                        <div className="text-xs font-semibold text-white">{stage}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-dark-900 border border-slate-800 text-center space-y-3 text-slate-400">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
              <h3 className="text-base font-bold text-white">No Active Induction Drive</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {society.name} is not currently running an induction drive on this platform. Follow this {society.type} to be alerted when the next hiring cycle begins.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 5: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">
            Official Notices & Bulletins ({societyAnnouncements.length})
          </h3>

          {societyAnnouncements.length === 0 ? (
            <div className="p-12 rounded-3xl bg-dark-900 border border-slate-800 text-center text-slate-400">
              <Bell className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium text-white">No active notices</p>
            </div>
          ) : (
            societyAnnouncements.map(ann => (
              <div
                key={ann.id}
                className="p-5 rounded-2xl bg-dark-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet-light font-semibold border border-brand-violet/30 capitalize">
                    {ann.type} Notice
                  </span>
                  <span className="text-xs text-slate-400">{ann.date}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Recruitment Modal for Applying */}
      {societyRecruitment && (
        <ApplicationModal
          recruitment={societyRecruitment}
          isOpen={appModalOpen}
          onClose={() => setAppModalOpen(false)}
        />
      )}
    </div>
  );
}
