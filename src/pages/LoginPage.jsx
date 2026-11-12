import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield, User, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function LoginPage() {
  const { login, switchAccount, students, admins } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('student'); // 'student' | 'society-admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const res = login(email, password, role);
    if (res.success) {
      addToast(`Logged in as ${res.user.name}`, 'success');
      if (res.user.role === 'society-admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleDemoLogin = (accountId, userRole) => {
    switchAccount(accountId);
    addToast('Logged in with TIET Demo Account', 'success');
    if (userRole === 'society-admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-brand-violet/30 text-xs font-semibold text-brand-violet-light mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            TIET Campus Portal • SocietySphere
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to access your TIET student dashboard or society admin panel.
          </p>
        </div>

        {/* 1-Click Fast Demo Login Strip */}
        <div className="p-4 rounded-2xl bg-dark-900 border border-brand-violet/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
              1-Click TIET Demo Profiles
            </span>
            <span className="text-[10px] text-brand-cyan-light font-medium">Instant Test Drive</span>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students</div>
            <div className="grid grid-cols-2 gap-2">
              {students.slice(0, 2).map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleDemoLogin(s.id, 'student')}
                  className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-800 hover:border-brand-violet/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={s.avatar}
                      alt={s.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-white group-hover:text-brand-violet-light truncate">
                      {s.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-brand-cyan-light font-medium mt-1 truncate">
                    {s.branch.split('(')[1]?.replace(')', '') || 'COE'} • {s.academicYear.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>

            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1">Society Leads</div>
            <div className="grid grid-cols-2 gap-2">
              {admins.slice(0, 2).map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleDemoLogin(a.id, 'society-admin')}
                  className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-800 hover:border-brand-violet/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={a.avatar}
                      alt={a.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-white group-hover:text-brand-violet-light truncate">
                      {a.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-brand-violet-light font-medium mt-1 truncate">
                    {a.societyName.split(' ')[0]} Lead
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Regular Login Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-slate-800 shadow-2xl space-y-6">
          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-dark-950 border border-slate-800">
            <button
              type="button"
              onClick={() => { setRole('student'); setError(''); }}
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
              onClick={() => { setRole('society-admin'); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                role === 'society-admin'
                  ? 'bg-brand-violet/20 text-brand-violet-light shadow-sm border border-brand-violet/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-brand-violet" />
              Society Admin
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                TIET Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={role === 'student' ? 'aman.sharma@thapar.edu' : 'arjun.gill@thapar.edu'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-violet to-brand-blue hover:from-brand-violet-dark hover:to-brand-blue-dark shadow-glow-violet transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to TIET Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-brand-violet-light font-semibold hover:underline">
              Register as TIET Student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
