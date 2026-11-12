import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, User, Shield, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ALL_INTERESTS_TAGS, TIET_BRANCHES, TIET_YEARS } from '../data/mockData';

export function SignUpPage() {
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: TIET_BRANCHES[0] || 'Computer Engineering (COE)',
    academicYear: TIET_YEARS[1] || '2nd Year (Sophomore)',
    studentId: '',
    societyName: '',
    position: '',
  });

  const [selectedInterests, setSelectedInterests] = useState(['Web & App Dev', 'Machine Learning', 'Competitive Programming']);
  const [error, setError] = useState('');

  const toggleInterest = (tag) => {
    setSelectedInterests(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    const res = signup({
      ...formData,
      college: 'Thapar Institute of Engineering & Technology, Patiala',
      role,
      interests: selectedInterests,
      skills: selectedInterests.slice(0, 3),
      studentId: formData.studentId || `102403${Math.floor(Math.random() * 900 + 100)}`
    });

    if (res.success) {
      addToast(`Welcome to SocietySphere TIET, ${res.user.name}!`, 'success');
      if (role === 'society-admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-brand-violet/30 text-xs font-semibold text-brand-violet-light mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Thapar Institute of Engineering & Technology, Patiala
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Create Your Campus Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Connect with 40+ official TIET student organizations, RSVP for fests, and apply for induction drives.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-slate-800 shadow-2xl space-y-6">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-dark-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                role === 'student'
                  ? 'bg-dark-800 text-white shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5 text-brand-cyan" />
              TIET Student
            </button>

            <button
              type="button"
              onClick={() => setRole('society-admin')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                role === 'society-admin'
                  ? 'bg-brand-violet/20 text-brand-violet-light shadow-sm border border-brand-violet/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-brand-violet" />
              Society Core Lead
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aman Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">TIET Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@thapar.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">TIET Roll Number</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="e.g. 102403142"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Branch</label>
                <select
                  value={formData.branch}
                  onChange={e => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm cursor-pointer"
                >
                  {TIET_BRANCHES.map(branch => (
                    <option key={branch} value={branch} className="bg-dark-900 text-white">
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Year of Study</label>
                <select
                  value={formData.academicYear}
                  onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm cursor-pointer"
                >
                  {TIET_YEARS.map(yr => (
                    <option key={yr} value={yr} className="bg-dark-900 text-white">
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {role === 'society-admin' && (
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <span className="text-xs font-bold text-brand-violet-light uppercase tracking-wider block">
                  TIET Organization Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Organization Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Creative Computing Society (CCS)"
                      value={formData.societyName}
                      onChange={e => setFormData({ ...formData, societyName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-dark-850 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Core Position</label>
                    <input
                      type="text"
                      placeholder="e.g. General Secretary / Technical Lead"
                      value={formData.position}
                      onChange={e => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-dark-850 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Interest Tags Selector for Students */}
            {role === 'student' && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Select Interests for Smart Matching
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl bg-dark-950/60 border border-slate-800">
                  {ALL_INTERESTS_TAGS.map(tag => {
                    const isSelected = selectedInterests.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-brand-violet text-white shadow-sm'
                            : 'bg-dark-850 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                        <span>#{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-violet to-brand-blue hover:from-brand-violet-dark hover:to-brand-blue-dark shadow-glow-violet transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Complete TIET Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-violet-light font-semibold hover:underline">
              Log in with demo credentials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
