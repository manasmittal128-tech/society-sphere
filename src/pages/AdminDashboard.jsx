import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Calendar,
  Briefcase,
  Bell,
  Users,
  TrendingUp,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Save,
  Search,
  Filter,
  BarChart3,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export function AdminDashboard() {
  const { currentUser, switchAccount } = useAuth();
  const {
    societies,
    events,
    recruitments,
    announcements,
    applications,
    updateSociety,
    createEvent,
    updateEvent,
    deleteEvent,
    createAnnouncement,
    deleteAnnouncement,
    updateRecruitment,
    updateApplicationStatus
  } = useData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'profile' | 'events' | 'announcements' | 'recruitment' | 'applications' | 'analytics'

  // Determine current administered society (default to 'ccs-tiet' if Arjun, or first available)
  const targetSocietyId = currentUser?.societyId || 'ccs-tiet';
  const society = societies.find(s => s.id === targetSocietyId) || societies[0];

  // Scoped data for this society
  const societyEvents = events.filter(e => e.societyId === society.id);
  const societyAnnouncements = announcements.filter(a => a.societyId === society.id);
  const societyRecruitment = recruitments.find(r => r.societyId === society.id);
  const societyApplications = applications.filter(a => a.societyId === society.id);

  // Profile Editor Form State
  const [profileForm, setProfileForm] = useState({
    tagline: society?.tagline || '',
    description: society?.description || '',
    fullMission: society?.fullMission || '',
    meetingSchedule: society?.meetingSchedule || '',
    venueRoom: society?.venueRoom || '',
    contactEmail: society?.contactEmail || '',
  });

  // Event Creation Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Technical / Academic',
    date: '2026-11-25',
    time: '02:00 PM - 05:00 PM',
    venue: 'COS Complex Lab 102',
    capacity: 100,
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    description: '',
    isVirtual: false,
    registrationDeadline: '2026-11-24',
    organizerContact: society?.contactEmail || 'ccs@thapar.edu'
  });

  // Announcement Creation Modal State
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [annForm, setAnnForm] = useState({
    title: '',
    content: '',
    type: 'general',
    pinned: false
  });

  // Application Review State
  const [applicantFilterStatus, setApplicantFilterStatus] = useState('All');
  const [applicantFilterDept, setApplicantFilterDept] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [statusUpdateForm, setStatusUpdateForm] = useState({
    status: 'Shortlisted',
    adminNotes: '',
    interviewDate: '2026-11-18T15:30:00',
    interviewVenue: 'COS Complex Lab 102 / TAN Building'
  });

  // Recruitment Settings State
  const [recruitmentForm, setRecruitmentForm] = useState({
    isOpen: societyRecruitment ? societyRecruitment.isOpen : true,
    deadline: societyRecruitment?.deadline || '2026-11-25',
    cycleTitle: societyRecruitment?.cycleTitle || 'Spring 2026 Induction Drive',
    eligibility: societyRecruitment?.eligibility || 'Open to all students.'
  });

  // Calculate high-level KPIs
  const totalRSVPs = societyEvents.reduce((acc, ev) => acc + (ev.registeredCount || 0), 0);
  const totalApps = societyApplications.length;
  const selectedCount = societyApplications.filter(a => a.status === 'Selected').length;
  const acceptanceRate = totalApps > 0 ? Math.round((selectedCount / totalApps) * 100) : 18;

  // Analytics datasets
  const registrationsByEventData = societyEvents.map(e => ({
    name: e.title.length > 18 ? e.title.slice(0, 16) + '...' : e.title,
    registered: e.registeredCount || 0,
    capacity: e.capacity || 100
  }));

  const appsByDepartmentData = (society.departments || []).map(dept => ({
    name: dept.name.split(' ')[0],
    fullName: dept.name,
    applications: societyApplications.filter(
      a => a.selectedDepartmentId === dept.id || a.selectedDepartment === dept.name
    ).length || Math.floor(Math.random() * 8 + 3)
  }));

  const weeklyEngagementData = [
    { week: 'W1 Oct', views: 820, followers: society.followerCount - 140 },
    { week: 'W2 Oct', views: 980, followers: society.followerCount - 100 },
    { week: 'W3 Oct', views: 1250, followers: society.followerCount - 65 },
    { week: 'W4 Oct', views: 1620, followers: society.followerCount - 30 },
    { week: 'W1 Nov', views: 2180, followers: society.followerCount },
  ];

  const statusPieData = [
    { name: 'Submitted', value: societyApplications.filter(a => a.status === 'Submitted').length || 2, color: '#64748b' },
    { name: 'Under Review', value: societyApplications.filter(a => a.status === 'Under Review').length || 3, color: '#3b82f6' },
    { name: 'Shortlisted', value: societyApplications.filter(a => a.status === 'Shortlisted').length || 4, color: '#8b5cf6' },
    { name: 'Interviewing', value: societyApplications.filter(a => a.status === 'Interview Scheduled').length || 2, color: '#06b6d4' },
    { name: 'Selected', value: societyApplications.filter(a => a.status === 'Selected').length || 2, color: '#10b981' },
  ];

  // Handlers
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateSociety(society.id, profileForm);
  };

  const handleOpenEventModal = (event = null) => {
    if (event) {
      setEditingEventId(event.id);
      setEventForm({ ...event });
    } else {
      setEditingEventId(null);
      setEventForm({
        title: '',
        category: 'Technical / Academic',
        date: '2026-11-25',
        time: '02:00 PM - 05:00 PM',
        venue: 'COS Complex Lab 102',
        capacity: 100,
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
        description: '',
        isVirtual: false,
        registrationDeadline: '2026-11-24',
        organizerContact: society?.contactEmail || 'ccs@thapar.edu'
      });
    }
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (editingEventId) {
      updateEvent(editingEventId, eventForm);
    } else {
      createEvent({
        ...eventForm,
        societyId: society.id,
        societyName: society.name,
        societyLogo: society.logo
      });
    }
    setIsEventModalOpen(false);
  };

  const handleSaveAnnouncement = (e) => {
    e.preventDefault();
    createAnnouncement({
      ...annForm,
      societyId: society.id,
      societyName: society.name,
      societyLogo: society.logo
    });
    setAnnForm({ title: '', content: '', type: 'general', pinned: false });
    setIsAnnModalOpen(false);
  };

  const handleSaveRecruitmentSettings = (e) => {
    e.preventDefault();
    if (societyRecruitment) {
      updateRecruitment(societyRecruitment.id, recruitmentForm);
    }
  };

  const handleOpenApplicantReview = (applicant) => {
    setSelectedApplicant(applicant);
    setStatusUpdateForm({
      status: applicant.status,
      adminNotes: applicant.adminNotes || '',
      interviewDate: applicant.interviewDate || '2026-11-18T15:30:00',
      interviewVenue: applicant.interviewVenue || 'COS Complex Lab 102 / TAN Building'
    });
  };

  const handleSaveApplicantStatus = (e) => {
    e.preventDefault();
    if (!selectedApplicant) return;

    updateApplicationStatus(
      selectedApplicant.id,
      statusUpdateForm.status,
      statusUpdateForm.adminNotes,
      {
        date: statusUpdateForm.interviewDate,
        venue: statusUpdateForm.interviewVenue
      }
    );

    setSelectedApplicant(prev => ({
      ...prev,
      status: statusUpdateForm.status,
      adminNotes: statusUpdateForm.adminNotes
    }));
  };

  // Filtered applicants
  const filteredApplicants = societyApplications.filter(app => {
    if (applicantFilterStatus !== 'All' && app.status !== applicantFilterStatus) return false;
    if (applicantFilterDept !== 'All' && app.selectedDepartment !== applicantFilterDept) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Admin Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-violet/25 via-dark-900 to-brand-blue/20 border border-brand-violet/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={society.logo}
              alt={society.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-brand-violet/50 shadow-2xl bg-dark-950"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-violet/30 text-brand-violet-light border border-brand-violet/40 font-bold uppercase">
                  Executive Admin Portal
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {society.acronym}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {society.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Logged in as <strong className="text-white">{currentUser?.name}</strong> ({currentUser?.position || 'Lead Organizer'})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Link
              to={`/societies/${society.id}`}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-dark-850 hover:bg-dark-800 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => handleOpenEventModal()}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-violet hover:bg-brand-violet-dark shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-px">
        {[
          { key: 'overview', label: 'Overview & KPIs', icon: Shield },
          { key: 'applications', label: `Review Applicants (${societyApplications.length})`, icon: Briefcase, badge: societyApplications.length },
          { key: 'events', label: `Manage Events (${societyEvents.length})`, icon: Calendar },
          { key: 'announcements', label: `Announcements (${societyAnnouncements.length})`, icon: Bell },
          { key: 'recruitment', label: 'Recruitment Settings', icon: Users },
          { key: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
          { key: 'profile', label: 'Edit Society Profile', icon: Edit3 },
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

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Society Followers</span>
              <div className="text-2xl sm:text-3xl font-black text-white">{society.followerCount}</div>
              <span className="text-[11px] text-emerald-400 font-medium">+18% this month</span>
            </div>

            <div className="p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Event RSVPs</span>
              <div className="text-2xl sm:text-3xl font-black text-brand-cyan-light">{totalRSVPs}</div>
              <span className="text-[11px] text-brand-cyan font-medium">Across {societyEvents.length} events</span>
            </div>

            <div className="p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Applications Received</span>
              <div className="text-2xl sm:text-3xl font-black text-brand-violet-light">{totalApps}</div>
              <span className="text-[11px] text-brand-violet-light font-medium">Active induction cycle</span>
            </div>

            <div className="p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Acceptance Ratio</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{acceptanceRate}%</div>
              <span className="text-[11px] text-slate-400 font-medium">{selectedCount} candidates selected</span>
            </div>
          </div>

          {/* Quick Chart Strip: Event RSVPs & Weekly Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Event Registrations by Session</span>
                <Calendar className="w-4 h-4 text-brand-cyan" />
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={registrationsByEventData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="registered" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="RSVP Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Weekly Follower Growth</span>
                <TrendingUp className="w-4 h-4 text-brand-violet" />
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyEngagementData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="followers" stroke="#06b6d4" fillOpacity={1} fill="url(#colorFollowers)" name="Followers" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Review Applicants Strip */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Recent Recruitment Applicants ({societyApplications.length})
              </h3>
              <button
                onClick={() => setActiveTab('applications')}
                className="text-xs font-semibold text-brand-violet-light hover:underline"
              >
                Open Applicant Review Board →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 font-semibold">Applicant</th>
                    <th className="py-2.5 font-semibold">Department</th>
                    <th className="py-2.5 font-semibold">Year & Branch</th>
                    <th className="py-2.5 font-semibold">Status</th>
                    <th className="py-2.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {societyApplications.slice(0, 4).map(app => (
                    <tr key={app.id} className="hover:bg-dark-850/50">
                      <td className="py-3 font-semibold text-white">{app.applicantName}</td>
                      <td className="py-3 text-slate-300">{app.selectedDepartment}</td>
                      <td className="py-3 text-slate-400">{app.applicantBranch} ({app.applicantYear})</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-dark-800 border border-slate-700 text-brand-violet-light">
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setActiveTab('applications');
                            handleOpenApplicantReview(app);
                          }}
                          className="text-brand-cyan hover:underline font-semibold"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPLICATIONS REVIEW (Core Requirement!) */}
      {activeTab === 'applications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Applicant List & Filters */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters Row */}
            <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Status:</span>
                <select
                  value={applicantFilterStatus}
                  onChange={e => setApplicantFilterStatus(e.target.value)}
                  className="bg-dark-850 border border-slate-800 text-white rounded-lg px-2.5 py-1 font-semibold"
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Selected">Selected</option>
                  <option value="Not Selected">Not Selected</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Department:</span>
                <select
                  value={applicantFilterDept}
                  onChange={e => setApplicantFilterDept(e.target.value)}
                  className="bg-dark-850 border border-slate-800 text-white rounded-lg px-2.5 py-1 font-semibold"
                >
                  <option value="All">All Departments</option>
                  {society.departments.map(d => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Applicant Cards List */}
            {filteredApplicants.length === 0 ? (
              <div className="p-12 rounded-3xl bg-dark-900 border border-slate-800 text-center text-slate-400 text-xs">
                No applicants match the current filter selection.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApplicants.map(app => {
                  const isSelected = selectedApplicant?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => handleOpenApplicantReview(app)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-brand-violet/15 border-brand-violet shadow-glow-violet'
                          : 'bg-dark-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-white">{app.applicantName}</h4>
                          <span className="text-xs text-brand-cyan-light font-medium">{app.selectedDepartment}</span>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-dark-800 border border-slate-700 text-brand-violet-light">
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {app.whyJoin}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                        <span>{app.applicantBranch} • {app.applicantYear}</span>
                        <span>GPA: {app.gpa || '3.80'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Col: Applicant Details & Status Updater Form */}
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            {selectedApplicant ? (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-brand-violet-light uppercase tracking-wider block mb-1">
                    Candidate Evaluation
                  </span>
                  <h3 className="text-xl font-bold text-white">{selectedApplicant.applicantName}</h3>
                  <p className="text-xs text-slate-400">{selectedApplicant.applicantEmail} • {selectedApplicant.phone}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Dept:</span>
                    <strong className="text-white">{selectedApplicant.selectedDepartment}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Branch & Year:</span>
                    <span className="text-white">{selectedApplicant.applicantBranch} ({selectedApplicant.applicantYear})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Weekly Hours:</span>
                    <span className="text-white">{selectedApplicant.hoursPerWeek}</span>
                  </div>
                  {selectedApplicant.resumeUrl && (
                    <div className="pt-1">
                      <a
                        href={selectedApplicant.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-cyan-light hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>View Portfolio / Resume</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Candidate answers */}
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-300 block mb-1">Why do they want to join?</span>
                    <p className="p-3 rounded-xl bg-dark-950 border border-slate-800 text-slate-300 leading-relaxed">
                      {selectedApplicant.whyJoin}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-300 block mb-1">Relevant Experience & Projects:</span>
                    <p className="p-3 rounded-xl bg-dark-950 border border-slate-800 text-slate-300 leading-relaxed">
                      {selectedApplicant.relevantExperience || 'None stated'}
                    </p>
                  </div>
                </div>

                {/* Update Status Form */}
                <form onSubmit={handleSaveApplicantStatus} className="pt-4 border-t border-slate-800 space-y-4 text-xs">
                  <span className="font-bold text-white block uppercase tracking-wider">
                    Update Application Status
                  </span>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Select Stage / Decision</label>
                    <select
                      value={statusUpdateForm.status}
                      onChange={e => setStatusUpdateForm({ ...statusUpdateForm, status: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 font-bold text-white"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Selected">Selected (Accept)</option>
                      <option value="Not Selected">Not Selected (Reject)</option>
                    </select>
                  </div>

                  {statusUpdateForm.status === 'Interview Scheduled' && (
                    <div className="space-y-3 p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Interview Date & Time</label>
                        <input
                          type="datetime-local"
                          value={statusUpdateForm.interviewDate}
                          onChange={e => setStatusUpdateForm({ ...statusUpdateForm, interviewDate: e.target.value })}
                          className="w-full p-2 rounded-lg bg-dark-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Venue / Meeting Link</label>
                        <input
                          type="text"
                          value={statusUpdateForm.interviewVenue}
                          onChange={e => setStatusUpdateForm({ ...statusUpdateForm, interviewVenue: e.target.value })}
                          className="w-full p-2 rounded-lg bg-dark-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Admin Feedback / Notes (Visible to Student)</label>
                    <textarea
                      rows={2}
                      value={statusUpdateForm.adminNotes}
                      onChange={e => setStatusUpdateForm({ ...statusUpdateForm, adminNotes: e.target.value })}
                      placeholder="e.g. Great code samples, shortlisted for round 2."
                      className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold text-white bg-brand-violet hover:bg-brand-violet-dark shadow-sm transition-all"
                  >
                    Save Status Decision
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs">
                <Briefcase className="w-10 h-10 mx-auto opacity-40 mb-2" />
                <p>Select an applicant from the list to inspect their portfolio and update their recruitment stage.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: EVENTS MANAGEMENT */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              Society Events Management ({societyEvents.length})
            </h3>
            <button
              onClick={() => handleOpenEventModal()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-violet hover:bg-brand-violet-dark flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add New Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {societyEvents.map(evt => (
              <div
                key={evt.id}
                className="p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-dark-800 text-brand-cyan-light">
                      {evt.category}
                    </span>
                    <span className="text-xs text-slate-400">{evt.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-white line-clamp-1">{evt.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{evt.description}</p>
                  <div className="mt-3 text-xs text-slate-300">
                    RSVPs: <strong className="text-white font-bold">{evt.registeredCount || 0}</strong> / {evt.capacity}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => handleOpenEventModal(evt)}
                    className="flex-1 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-200 border border-slate-800 flex items-center justify-center gap-1 font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete event "${evt.title}"?`)) {
                        deleteEvent(evt.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ANNOUNCEMENTS MANAGEMENT */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              Announcements & Circulars ({societyAnnouncements.length})
            </h3>
            <button
              onClick={() => setIsAnnModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-violet hover:bg-brand-violet-dark flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Publish Announcement
            </button>
          </div>

          <div className="space-y-4">
            {societyAnnouncements.map(ann => (
              <div
                key={ann.id}
                className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-2 flex items-start justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                      {ann.type}
                    </span>
                    <span className="text-xs text-slate-400">{ann.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{ann.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{ann.content}</p>
                </div>

                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 shrink-0"
                  title="Delete Notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RECRUITMENT SETTINGS */}
      {activeTab === 'recruitment' && (
        <div className="max-w-2xl bg-dark-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Recruitment Drive Settings</h3>
            <p className="text-xs text-slate-400 mt-1">
              Control your society's application window and deadlines.
            </p>
          </div>

          <form onSubmit={handleSaveRecruitmentSettings} className="space-y-4 text-xs">
            {/* Open / Close toggle */}
            <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-sm block">Recruitment Active Status</span>
                <span className="text-slate-400">When enabled, students can apply via the portal.</span>
              </div>
              <button
                type="button"
                onClick={() => setRecruitmentForm({ ...recruitmentForm, isOpen: !recruitmentForm.isOpen })}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  recruitmentForm.isOpen
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-dark-800 text-slate-400 border border-slate-700'
                }`}
              >
                {recruitmentForm.isOpen ? 'Recruiting (Open)' : 'Closed'}
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Recruitment Cycle Headline</label>
              <input
                type="text"
                value={recruitmentForm.cycleTitle}
                onChange={e => setRecruitmentForm({ ...recruitmentForm, cycleTitle: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Application Deadline Date</label>
              <input
                type="date"
                value={recruitmentForm.deadline}
                onChange={e => setRecruitmentForm({ ...recruitmentForm, deadline: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Eligibility Criteria</label>
              <textarea
                rows={3}
                value={recruitmentForm.eligibility}
                onChange={e => setRecruitmentForm({ ...recruitmentForm, eligibility: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-violet hover:bg-brand-violet-dark shadow-sm"
            >
              Save Recruitment Settings
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: ANALYTICS & INSIGHTS (Recharts) */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Breakdown BarChart */}
            <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Applications by Department
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appsByDepartmentData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    />
                    <Bar dataKey="applications" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Applicants" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Applicant Status Distribution PieChart */}
            <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Applicant Status Breakdown
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: EDIT SOCIETY PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-dark-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Edit Society Profile</h3>
            <p className="text-xs text-slate-400 mt-1">
              Changes reflect immediately on the public society page and explore directory.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Tagline</label>
              <input
                type="text"
                value={profileForm.tagline}
                onChange={e => setProfileForm({ ...profileForm, tagline: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Short Description</label>
              <textarea
                rows={3}
                value={profileForm.description}
                onChange={e => setProfileForm({ ...profileForm, description: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Mission Statement</label>
              <textarea
                rows={4}
                value={profileForm.fullMission}
                onChange={e => setProfileForm({ ...profileForm, fullMission: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Meeting Schedule</label>
                <input
                  type="text"
                  value={profileForm.meetingSchedule}
                  onChange={e => setProfileForm({ ...profileForm, meetingSchedule: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Primary Campus Venue / Room</label>
                <input
                  type="text"
                  value={profileForm.venueRoom}
                  onChange={e => setProfileForm({ ...profileForm, venueRoom: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Contact Email</label>
              <input
                type="email"
                value={profileForm.contactEmail}
                onChange={e => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-violet hover:bg-brand-violet-dark shadow-sm"
            >
              Save Society Profile
            </button>
          </form>
        </div>
      )}

      {/* EVENT MODAL (Create / Edit) */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-dark-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingEventId ? 'Edit Event' : 'Create New Campus Event'}
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. HackGrid 2026: 36h Hackathon"
                  className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={e => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Media and Design">Media and Design</option>
                    <option value="Social Impact">Social Impact</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Max Capacity (Seats)</label>
                  <input
                    type="number"
                    value={eventForm.capacity}
                    onChange={e => setEventForm({ ...eventForm, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Time Range</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    placeholder="10:00 AM - 04:00 PM"
                    className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Venue / Auditorium</label>
                <input
                  type="text"
                  value={eventForm.venue}
                  onChange={e => setEventForm({ ...eventForm, venue: e.target.value })}
                  placeholder="Auditorium Hall B / Virtual"
                  className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={eventForm.description}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Event details, schedule, food/swag info..."
                  className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-brand-violet hover:bg-brand-violet-dark"
                >
                  {editingEventId ? 'Update Event' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-dark-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Publish Society Announcement</h3>
              <button onClick={() => setIsAnnModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={annForm.title}
                  onChange={e => setAnnForm({ ...annForm, title: e.target.value })}
                  placeholder="e.g. Workshop Materials Released"
                  className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notice Type</label>
                <select
                  value={annForm.type}
                  onChange={e => setAnnForm({ ...annForm, type: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
                >
                  <option value="general">General Notice</option>
                  <option value="urgent">Urgent Announcement</option>
                  <option value="event">Event Update</option>
                  <option value="recruitment">Recruitment Bulletin</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Announcement Body</label>
                <textarea
                  rows={4}
                  required
                  value={annForm.content}
                  onChange={e => setAnnForm({ ...annForm, content: e.target.value })}
                  placeholder="Type the message for student members..."
                  className="w-full p-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-brand-violet hover:bg-brand-violet-dark"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
