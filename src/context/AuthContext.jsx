import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STUDENTS, INITIAL_ADMINS } from '../data/mockData';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'societysphere_current_user';
const STORAGE_KEY_STUDENTS = 'societysphere_students_db';
const STORAGE_KEY_ADMINS = 'societysphere_admins_db';

export function AuthProvider({ children }) {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure data is TIET-specific
        if (Array.isArray(parsed) && parsed.some(s => s.college?.includes('Thapar') || s.email?.includes('thapar.edu'))) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved students', e);
      }
    }
    return INITIAL_STUDENTS;
  });

  const [admins, setAdmins] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ADMINS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(a => a.college?.includes('Thapar') || a.email?.includes('thapar.edu'))) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved admins', e);
      }
    }
    return INITIAL_ADMINS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.college?.includes('Thapar') || parsed?.email?.includes('thapar.edu')) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    // Default to Aman Sharma (COE, 2nd Year) for TIET test drive
    return INITIAL_STUDENTS[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADMINS, JSON.stringify(admins));
  }, [admins]);

  const login = (email, password, role = 'student') => {
    if (role === 'student') {
      const student = students.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (student) {
        setCurrentUser(student);
        return { success: true, user: student };
      }
      // Demo fallback: create user if not found
      const newStudent = {
        id: `student-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        college: 'Thapar Institute of Engineering & Technology, Patiala',
        branch: 'Computer Engineering (COE)',
        academicYear: '2nd Year (Sophomore)',
        studentId: `102403${Math.floor(Math.random() * 900 + 100)}`,
        bio: 'Enthusiastic TIET student exploring campus societies, hackathons, and cultural events.',
        interests: ['Web & App Dev', 'Machine Learning', 'Competitive Programming'],
        skills: ['C++', 'Python', 'React'],
        followedSocieties: ['ccs-tiet', 'mlsc-tiet'],
        registeredEvents: []
      };
      setStudents(prev => [...prev, newStudent]);
      setCurrentUser(newStudent);
      return { success: true, user: newStudent };
    } else {
      const admin = admins.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (admin) {
        setCurrentUser(admin);
        return { success: true, user: admin };
      }
      return { success: false, error: 'Admin account not found. Try the demo admin login.' };
    }
  };

  const signup = (userData) => {
    if (userData.role === 'society-admin') {
      const newAdmin = {
        id: `admin-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: 'society-admin',
        societyId: userData.societyId || 'ccs-tiet',
        societyName: userData.societyName || 'Creative Computing Society',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        position: userData.position || 'Core Coordinator',
        branch: userData.branch || 'Computer Engineering (COE)',
        academicYear: '3rd Year (Junior)',
        college: 'Thapar Institute of Engineering & Technology, Patiala',
        bio: userData.bio || 'Society administrator at TIET Patiala.',
        managedSocieties: [userData.societyId || 'ccs-tiet']
      };
      setAdmins(prev => [...prev, newAdmin]);
      setCurrentUser(newAdmin);
      return { success: true, user: newAdmin };
    } else {
      const newStudent = {
        id: `student-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: 'student',
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        college: userData.college || 'Thapar Institute of Engineering & Technology, Patiala',
        branch: userData.branch || 'Computer Engineering (COE)',
        academicYear: userData.academicYear || '2nd Year (Sophomore)',
        studentId: userData.studentId || `102403${Math.floor(Math.random() * 900 + 100)}`,
        bio: userData.bio || 'Curious TIETian eager to collaborate in campus communities.',
        phone: userData.phone || '',
        gpa: userData.gpa || '8.5',
        interests: userData.interests || ['Web & App Dev', 'AI/ML', 'Hackathons'],
        skills: userData.skills || ['React', 'Python', 'C++'],
        github: userData.github || '',
        linkedin: userData.linkedin || '',
        portfolio: userData.portfolio || '',
        followedSocieties: userData.followedSocieties || ['ccs-tiet'],
        registeredEvents: []
      };
      setStudents(prev => [...prev, newStudent]);
      setCurrentUser(newStudent);
      return { success: true, user: newStudent };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchAccount = (accountId) => {
    const student = students.find(s => s.id === accountId);
    if (student) {
      setCurrentUser(student);
      return;
    }
    const admin = admins.find(a => a.id === accountId);
    if (admin) {
      setCurrentUser(admin);
    }
  };

  const updateProfile = (updatedData) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);

    if (currentUser.role === 'student') {
      setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    } else {
      setAdmins(prev => prev.map(a => a.id === updated.id ? updated : a));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        students,
        admins,
        login,
        signup,
        logout,
        switchAccount,
        updateProfile,
        isStudent: currentUser?.role === 'student',
        isAdmin: currentUser?.role === 'society-admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
