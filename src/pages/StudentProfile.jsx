import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  Sparkles,
  Edit3,
  Check,
  Globe,
  Plus,
  X,
  BookmarkCheck,
  Ticket,
  Briefcase
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/common/BrandIcons';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { ALL_INTERESTS_TAGS, TIET_BRANCHES, TIET_YEARS } from '../data/mockData';

export function StudentProfile() {
  const { currentUser, updateProfile } = useAuth();
  const { societies, events, applications, followedSocieties, registeredEvents } = useData();
  const { addToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    college: currentUser?.college || 'Thapar Institute of Engineering & Technology, Patiala',
    branch: currentUser?.branch || 'Computer Engineering (COE)',
    academicYear: currentUser?.academicYear || '2nd Year (Sophomore)',
    phone: currentUser?.phone || '',
    gpa: currentUser?.gpa || '8.5',
    bio: currentUser?.bio || '',
    github: currentUser?.github || '',
    linkedin: currentUser?.linkedin || '',
    portfolio: currentUser?.portfolio || '',
    avatar: currentUser?.avatar || '',
  });

  const [interests, setInterests] = useState(currentUser?.interests || []);
  const [newTagInput, setNewTagInput] = useState('');

  const toggleInterest = (tag) => {
    const updated = interests.includes(tag)
      ? interests.filter(t => t !== tag)
      : [...interests, tag];
    setInterests(updated);
    updateProfile({ interests: updated });
    addToast('Preferences saved! Smart recommendations updated.', 'success');
  };

  const handleAddNewTag = (e) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    if (!interests.includes(tag)) {
      const updated = [...interests, tag];
      setInterests(updated);
      updateProfile({ interests: updated });
      addToast(`Added interest: ${tag}`, 'success');
    }
    setNewTagInput('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ ...formData, interests });
    setIsEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const myFollowed = societies.filter(s => followedSocieties.includes(s.id));
  const myEvents = events.filter(e => registeredEvents.includes(e.id));
  const myApplications = applications.filter(a => a.applicantId === currentUser?.id);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Profile Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-dark-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-brand-violet/40 shadow-2xl"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {currentUser?.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30 font-semibold uppercase">
                  {currentUser?.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                {currentUser?.branch} • {currentUser?.academicYear}
              </p>
              <p className="text-xs text-slate-400">
                {currentUser?.college} • ID: <span className="font-mono">{currentUser?.studentId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-dark-850 hover:bg-dark-800 text-white border border-slate-700 transition-colors flex items-center gap-2"
          >
            <Edit3 className="w-3.5 h-3.5 text-brand-violet-light" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Bio */}
        {currentUser?.bio && !isEditing && (
          <p className="text-sm text-slate-300 leading-relaxed bg-dark-950/60 p-4 rounded-2xl border border-slate-800/80">
            {currentUser.bio}
          </p>
        )}

        {/* Social / Portfolio links */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
          {currentUser?.github && (
            <a
              href={currentUser.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <GithubIcon className="w-4 h-4 text-slate-400" />
              <span>GitHub</span>
            </a>
          )}
          {currentUser?.linkedin && (
            <a
              href={currentUser.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <LinkedinIcon className="w-4 h-4 text-slate-400" />
              <span>LinkedIn</span>
            </a>
          )}
          {currentUser?.portfolio && (
            <a
              href={currentUser.portfolio}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Portfolio</span>
            </a>
          )}
          {currentUser?.phone && (
            <span className="flex items-center gap-1.5 text-slate-400">
              <Phone className="w-4 h-4" />
              <span>{currentUser.phone}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5 text-slate-400">
            <Mail className="w-4 h-4" />
            <span>{currentUser?.email}</span>
          </span>
        </div>
      </div>

      {/* EDIT PROFILE FORM */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="p-8 rounded-3xl bg-dark-900 border border-brand-violet/40 space-y-6 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Edit Student Profile Information</h3>
            <span className="text-xs text-slate-400">Changes persist in LocalStorage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image URL</label>
              <input
                type="url"
                value={formData.avatar}
                onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Branch</label>
              <select
                value={formData.branch}
                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white text-sm cursor-pointer"
              >
                {TIET_BRANCHES.map(b => (
                  <option key={b} value={b} className="bg-dark-900 text-white">
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Year</label>
              <select
                value={formData.academicYear}
                onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white text-sm cursor-pointer"
              >
                {TIET_YEARS.map(y => (
                  <option key={y} value={y} className="bg-dark-900 text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">About Me / Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-3 rounded-xl bg-dark-850 border border-slate-800 text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Profile</label>
              <input
                type="url"
                value={formData.github}
                onChange={e => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Portfolio Website</label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 text-white text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-violet hover:bg-brand-violet-dark shadow-sm"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* INTERESTS & SKILLS SELECTOR (Powers Recommendations!) */}
      <div className="p-8 rounded-3xl bg-dark-900 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-violet-light uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
              <span>Smart Recommendation Engine Preferences</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              My Interests & Skills
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select or deselect tags. SocietySphere uses these to calculate compatibility match percentages.
            </p>
          </div>

          {/* Add custom tag input */}
          <form onSubmit={handleAddNewTag} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={newTagInput}
              onChange={e => setNewTagInput(e.target.value)}
              placeholder="Add skill (e.g. Flutter)..."
              className="px-3 py-1.5 rounded-xl bg-dark-850 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-violet"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-brand-violet text-white text-xs hover:bg-brand-violet-dark transition-colors"
              title="Add Tag"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Selected Interests Strip */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
            Active Preferences ({interests.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {interests.map(tag => (
              <button
                key={tag}
                onClick={() => toggleInterest(tag)}
                className="group px-3 py-1.5 rounded-xl bg-brand-violet/25 text-brand-violet-light border border-brand-violet/50 text-xs font-semibold flex items-center gap-1.5 transition-all hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300"
                title="Click to remove"
              >
                <span>{tag}</span>
                <X className="w-3 h-3 group-hover:block" />
              </button>
            ))}
          </div>
        </div>

        {/* Available Suggested Tags */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">
            Suggested Campus Skills & Hobbies:
          </span>
          <div className="flex flex-wrap gap-2">
            {ALL_INTERESTS_TAGS.filter(t => !interests.includes(t)).map(tag => (
              <button
                key={tag}
                onClick={() => toggleInterest(tag)}
                className="px-3 py-1 rounded-xl bg-dark-850 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 text-xs transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-2">
          <BookmarkCheck className="w-6 h-6 text-brand-violet" />
          <h4 className="text-lg font-bold text-white">{myFollowed.length} Followed Societies</h4>
          <p className="text-xs text-slate-400">Chapters receiving your engagement and attendance.</p>
        </div>

        <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-2">
          <Ticket className="w-6 h-6 text-brand-cyan" />
          <h4 className="text-lg font-bold text-white">{myEvents.length} Event RSVPs</h4>
          <p className="text-xs text-slate-400">Hackathons, summits, and workshops registered.</p>
        </div>

        <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-2">
          <Briefcase className="w-6 h-6 text-emerald-400" />
          <h4 className="text-lg font-bold text-white">{myApplications.length} Applications</h4>
          <p className="text-xs text-slate-400">Submissions undergoing review or interview.</p>
        </div>
      </div>
    </div>
  );
}
