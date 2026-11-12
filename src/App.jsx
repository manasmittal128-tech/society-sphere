import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { ExploreSocieties } from './pages/ExploreSocieties';
import { SocietyDetailsPage } from './pages/SocietyDetailsPage';
import { EventsHub } from './pages/EventsHub';
import { RecruitmentPortal } from './pages/RecruitmentPortal';
import { MyCommunities } from './pages/MyCommunities';
import { StudentProfile } from './pages/StudentProfile';
import { ActivityFeedPage } from './pages/ActivityFeedPage';
import { AdminDashboard } from './pages/AdminDashboard';

// Scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected Route for Admin
function AdminRoute({ children }) {
  const { currentUser, isAdmin } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function MainLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100 selection:bg-brand-violet/30 selection:text-brand-violet-light font-sans antialiased">
      <ScrollToTop />
      <Navbar onOpenSearch={setIsSearchOpen} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/societies" element={<ExploreSocieties />} />
          <Route path="/societies/:id" element={<SocietyDetailsPage />} />
          <Route path="/events" element={<EventsHub />} />
          <Route path="/recruitment" element={<RecruitmentPortal />} />
          <Route path="/my-communities" element={<MyCommunities />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/feed" element={<ActivityFeedPage />} />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <MainLayout />
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
