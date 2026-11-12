import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Briefcase,
  Radio,
  Search,
  Bell,
  ChevronDown,
  User,
  Shield,
  Layers,
  LogOut,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export function Navbar({ onOpenSearch }) {
  const { currentUser, isStudent, isAdmin, switchAccount, logout, students, admins } = useAuth();
  const { announcements } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSwitchOpen, setIsSwitchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);
  const switchRef = useRef(null);
  const notifRef = useRef(null);

  // Close popups on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (switchRef.current && !switchRef.current.contains(e.target)) {
        setIsSwitchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Explore Societies', path: '/societies', icon: Compass },
    { label: 'Events Hub', path: '/events', icon: Calendar },
    { label: 'Recruitment', path: '/recruitment', icon: Briefcase },
    { label: 'Campus Feed', path: '/feed', icon: Radio },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-dark-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-cyan p-[1px] shadow-glow-violet transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-dark-950 rounded-[11px] flex items-center justify-center">
                  <span className="text-xl font-black bg-gradient-to-r from-brand-violet-light to-brand-cyan-light bg-clip-text text-transparent">
                    S
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-white group-hover:text-brand-violet-light transition-colors">
                    SocietySphere
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                    TIET
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Thapar Institute • Patiala Campus
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'text-white bg-dark-800/90 shadow-sm border border-slate-700/60'
                        : 'text-slate-300 hover:text-white hover:bg-dark-850'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-brand-violet-light' : 'text-slate-400'}`} />
                    {link.label}
                  </Link>
                );
              })}

              {currentUser && isStudent && (
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/dashboard')
                      ? 'text-white bg-dark-800/90 shadow-sm border border-slate-700/60'
                      : 'text-slate-300 hover:text-white hover:bg-dark-850'
                  }`}
                >
                  <Layers className={`w-4 h-4 ${isActive('/dashboard') ? 'text-brand-cyan' : 'text-slate-400'}`} />
                  Dashboard
                </Link>
              )}

              {currentUser && isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/admin')
                      ? 'text-white bg-brand-violet/20 shadow-sm border border-brand-violet/40'
                      : 'text-brand-violet-light hover:text-white hover:bg-brand-violet/10'
                  }`}
                >
                  <Shield className="w-4 h-4 text-brand-violet" />
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          {/* Right Header Area */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Search Button */}
            <button
              onClick={() => onOpenSearch(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-850 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs"
              title="Search campus (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-dark-800 text-slate-400 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Quick Demo Switcher Pill */}
            <div className="relative" ref={switchRef}>
              <button
                onClick={() => setIsSwitchOpen(!isSwitchOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-dark-800/90 border border-brand-violet/30 hover:border-brand-violet/60 text-xs font-medium text-slate-200 transition-all shadow-sm"
                title="Switch demo persona"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline text-slate-400">Demo Role:</span>
                <span className="font-semibold text-brand-violet-light truncate max-w-[110px]">
                  {isAdmin ? 'Admin' : 'Student'} ({currentUser?.name.split(' ')[0]})
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Demo Account Switcher Dropdown */}
              {isSwitchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-dark-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-2.5 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>1-Click Persona Switch</span>
                    <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
                  </div>

                  <div className="mt-1 space-y-1">
                    <div className="px-2.5 py-1 text-[11px] font-semibold text-brand-blue uppercase">
                      Student Profiles
                    </div>
                    {students.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          switchAccount(s.id);
                          setIsSwitchOpen(false);
                          navigate('/dashboard');
                        }}
                        className={`w-full text-left flex items-center gap-2.5 p-2 rounded-xl text-xs transition-colors ${
                          currentUser?.id === s.id
                            ? 'bg-brand-violet/20 border border-brand-violet/40 text-white font-medium'
                            : 'hover:bg-dark-800 text-slate-300'
                        }`}
                      >
                        <img src={s.avatar} alt={s.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{s.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{s.branch} • {s.academicYear}</div>
                        </div>
                        {currentUser?.id === s.id && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-violet text-white">Active</span>
                        )}
                      </button>
                    ))}

                    <div className="px-2.5 pt-2 pb-1 text-[11px] font-semibold text-brand-violet uppercase">
                      Society Admin Profiles
                    </div>
                    {admins.map(a => (
                      <button
                        key={a.id}
                        onClick={() => {
                          switchAccount(a.id);
                          setIsSwitchOpen(false);
                          navigate('/admin');
                        }}
                        className={`w-full text-left flex items-center gap-2.5 p-2 rounded-xl text-xs transition-colors ${
                          currentUser?.id === a.id
                            ? 'bg-brand-violet/20 border border-brand-violet/40 text-white font-medium'
                            : 'hover:bg-dark-800 text-slate-300'
                        }`}
                      >
                        <img src={a.avatar} alt={a.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{a.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{a.position} ({a.societyName})</div>
                        </div>
                        {currentUser?.id === a.id && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-violet text-white">Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
                aria-label="Campus notifications"
              >
                <Bell className="w-4 h-4" />
                {announcements.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-cyan ring-2 ring-dark-950" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-2">
                    <span className="text-sm font-semibold text-white">Campus Notices</span>
                    <Link
                      to="/feed"
                      onClick={() => setIsNotifOpen(false)}
                      className="text-xs text-brand-violet-light hover:underline font-medium"
                    >
                      View all feed
                    </Link>
                  </div>
                  <div className="max-h-72 overflow-y-auto mt-2 space-y-2">
                    {announcements.slice(0, 4).map(ann => (
                      <div
                        key={ann.id}
                        className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 transition-colors border border-slate-800/80"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <img src={ann.societyLogo} alt={ann.societyName} className="w-4 h-4 rounded-full" />
                          <span className="text-xs font-semibold text-slate-300 truncate">{ann.societyName}</span>
                          <span className="text-[10px] text-slate-400 ml-auto">{ann.date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{ann.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Auth actions */}
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-dark-800 transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-violet/40"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30 capitalize">
                        {currentUser.role}
                      </span>
                    </div>

                    <div className="mt-1 space-y-0.5">
                      {isStudent && (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-dark-800 rounded-lg transition-colors"
                          >
                            <Layers className="w-4 h-4 text-brand-cyan" />
                            Student Dashboard
                          </Link>
                          <Link
                            to="/my-communities"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-dark-800 rounded-lg transition-colors"
                          >
                            <BookmarkCheck className="w-4 h-4 text-brand-violet" />
                            My Communities
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-dark-800 rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4 text-brand-blue" />
                            My Profile
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <>
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-dark-800 rounded-lg transition-colors"
                          >
                            <Shield className="w-4 h-4 text-brand-violet" />
                            Admin Overview
                          </Link>
                          <Link
                            to="/admin/applications"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-dark-800 rounded-lg transition-colors"
                          >
                            <Briefcase className="w-4 h-4 text-brand-cyan" />
                            Review Applicants
                          </Link>
                        </>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-brand-violet to-brand-blue hover:from-brand-violet-dark hover:to-brand-blue-dark rounded-lg shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-dark-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-dark-800"
                >
                  <Icon className="w-4 h-4 text-brand-violet" />
                  {link.label}
                </Link>
              );
            })}

            {currentUser && isStudent && (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-dark-800"
                >
                  <Layers className="w-4 h-4 text-brand-cyan" />
                  Student Dashboard
                </Link>
                <Link
                  to="/my-communities"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-dark-800"
                >
                  <BookmarkCheck className="w-4 h-4 text-brand-violet" />
                  My Communities
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-dark-800"
                >
                  <User className="w-4 h-4 text-brand-blue" />
                  Student Profile
                </Link>
              </>
            )}

            {currentUser && isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-violet-light bg-brand-violet/10 border border-brand-violet/20"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard ({currentUser.societyName})
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
