import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_SOCIETIES,
  INITIAL_EVENTS,
  INITIAL_RECRUITMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_APPLICATIONS
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { fireConfetti } from '../utils/confetti';

const DataContext = createContext(null);

const STORAGE_KEYS = {
  SOCIETIES: 'societysphere_societies_v1',
  EVENTS: 'societysphere_events_v1',
  RECRUITMENTS: 'societysphere_recruitments_v1',
  ANNOUNCEMENTS: 'societysphere_announcements_v1',
  APPLICATIONS: 'societysphere_applications_v1',
};

export function DataProvider({ children }) {
  const { currentUser, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [societies, setSocieties] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOCIETIES);
    return saved ? JSON.parse(saved) : INITIAL_SOCIETIES;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [recruitments, setRecruitments] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECRUITMENTS);
    return saved ? JSON.parse(saved) : INITIAL_RECRUITMENTS;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOCIETIES, JSON.stringify(societies));
  }, [societies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECRUITMENTS, JSON.stringify(recruitments));
  }, [recruitments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  // Derived user relationships
  const followedSocieties = currentUser?.followedSocieties || [];
  const registeredEvents = currentUser?.registeredEvents || [];

  // Toggle Follow / Unfollow Society
  const toggleFollow = useCallback((societyId) => {
    if (!currentUser) {
      addToast('Please log in to follow societies.', 'error');
      return;
    }

    const isFollowing = followedSocieties.includes(societyId);
    const newFollowed = isFollowing
      ? followedSocieties.filter(id => id !== societyId)
      : [...followedSocieties, societyId];

    updateProfile({ followedSocieties: newFollowed });

    // Update follower count in society
    setSocieties(prev =>
      prev.map(s => {
        if (s.id === societyId) {
          const delta = isFollowing ? -1 : 1;
          return { ...s, followerCount: Math.max(0, (s.followerCount || 0) + delta) };
        }
        return s;
      })
    );

    const targetSociety = societies.find(s => s.id === societyId);
    const sName = targetSociety?.acronym || targetSociety?.name || 'Society';

    if (isFollowing) {
      addToast(`Unfollowed ${sName}`, 'info');
    } else {
      addToast(`Following ${sName}! You will see their announcements on your dashboard.`, 'success');
    }
  }, [currentUser, followedSocieties, societies, updateProfile, addToast]);

  // Register for Event
  const registerForEvent = useCallback((eventId) => {
    if (!currentUser) {
      addToast('Please log in to register for events.', 'error');
      return;
    }

    if (registeredEvents.includes(eventId)) {
      addToast('You are already registered for this event.', 'info');
      return;
    }

    const event = events.find(e => e.id === eventId);
    if (event && (event.registeredCount || 0) >= (event.capacity || 9999)) {
      addToast('Sorry, this event has reached full capacity!', 'error');
      return;
    }

    const newRegistered = [...registeredEvents, eventId];
    updateProfile({ registeredEvents: newRegistered });

    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, registeredCount: (e.registeredCount || 0) + 1 } : e))
    );

    fireConfetti();
    addToast(`Registered for "${event?.title || 'Event'}"! Pass added to My Communities.`, 'success');
  }, [currentUser, registeredEvents, events, updateProfile, addToast]);

  // Unregister for Event
  const unregisterForEvent = useCallback((eventId) => {
    if (!currentUser) return;

    const newRegistered = registeredEvents.filter(id => id !== eventId);
    updateProfile({ registeredEvents: newRegistered });

    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, registeredCount: Math.max(0, (e.registeredCount || 0) - 1) } : e))
    );

    addToast('Registration cancelled. Seat freed up for other students.', 'info');
  }, [currentUser, registeredEvents, updateProfile, addToast]);

  // Submit Recruitment Application
  const submitApplication = useCallback((applicationData) => {
    if (!currentUser) {
      addToast('Please log in to submit recruitment applications.', 'error');
      return { success: false };
    }

    // Duplicate check
    const existing = applications.find(
      a => a.recruitmentId === applicationData.recruitmentId && a.applicantId === currentUser.id
    );

    if (existing) {
      addToast(`You have already applied for ${existing.societyName}. Status: ${existing.status}`, 'error');
      return { success: false, existing };
    }

    const newApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recruitmentId: applicationData.recruitmentId,
      societyId: applicationData.societyId,
      societyName: applicationData.societyName,
      societyLogo: applicationData.societyLogo,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantEmail: currentUser.email,
      applicantBranch: applicationData.applicantBranch || currentUser.branch,
      applicantYear: applicationData.applicantYear || currentUser.academicYear,
      studentId: applicationData.studentId || currentUser.studentId || 'CS24B042',
      phone: applicationData.phone || currentUser.phone || '',
      gpa: applicationData.gpa || currentUser.gpa || '3.80',
      selectedDepartment: applicationData.selectedDepartment,
      selectedDepartmentId: applicationData.selectedDepartmentId,
      resumeUrl: applicationData.resumeUrl || '',
      githubOrPortfolio: applicationData.githubOrPortfolio || '',
      linkedin: applicationData.linkedin || '',
      whyJoin: applicationData.whyJoin,
      relevantExperience: applicationData.relevantExperience || '',
      hoursPerWeek: applicationData.hoursPerWeek || '8-10 hours',
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      adminNotes: ''
    };

    setApplications(prev => [newApplication, ...prev]);

    // Update recruitment applicant count
    setRecruitments(prev =>
      prev.map(r =>
        r.id === applicationData.recruitmentId
          ? { ...r, totalApplicants: (r.totalApplicants || 0) + 1 }
          : r
      )
    );

    fireConfetti();
    addToast(`Application successfully submitted to ${applicationData.societyName}! Track progress in My Communities.`, 'success');
    return { success: true, application: newApplication };
  }, [currentUser, applications, addToast]);

  // Withdraw Application
  const withdrawApplication = useCallback((applicationId) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) return;

    setApplications(prev => prev.filter(a => a.id !== applicationId));

    if (app.recruitmentId) {
      setRecruitments(prev =>
        prev.map(r =>
          r.id === app.recruitmentId
            ? { ...r, totalApplicants: Math.max(0, (r.totalApplicants || 0) - 1) }
            : r
        )
      );
    }

    addToast(`Application for ${app.societyName} has been withdrawn.`, 'info');
  }, [applications, addToast]);

  // Update Application Status (Admin Action)
  const updateApplicationStatus = useCallback((applicationId, newStatus, adminNotes = '', interviewDetails = null) => {
    setApplications(prev =>
      prev.map(a => {
        if (a.id === applicationId) {
          const updated = {
            ...a,
            status: newStatus,
            adminNotes: adminNotes !== undefined ? adminNotes : a.adminNotes
          };
          if (interviewDetails?.date) {
            updated.interviewDate = interviewDetails.date;
          }
          if (interviewDetails?.venue) {
            updated.interviewVenue = interviewDetails.venue;
          }
          return updated;
        }
        return a;
      })
    );

    addToast(`Applicant status updated to "${newStatus}"`, 'success');
  }, [addToast]);

  // Admin Event Management
  const createEvent = useCallback((eventData) => {
    const newEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      registeredCount: 0,
      tags: eventData.tags || ['Campus', 'Event'],
      scheduleTimeline: eventData.scheduleTimeline || [
        { time: eventData.time?.split('-')[0]?.trim() || '10:00 AM', title: 'Opening & Welcome' },
        { time: eventData.time?.split('-')[1]?.trim() || '02:00 PM', title: 'Concluding Session' }
      ]
    };

    setEvents(prev => [newEvent, ...prev]);
    addToast(`Event "${newEvent.title}" published successfully!`, 'success');
    return newEvent;
  }, [addToast]);

  const updateEvent = useCallback((eventId, eventData) => {
    setEvents(prev => prev.map(e => (e.id === eventId ? { ...e, ...eventData } : e)));
    addToast('Event updated successfully', 'success');
  }, [addToast]);

  const deleteEvent = useCallback((eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    addToast('Event deleted', 'info');
  }, [addToast]);

  // Admin Announcement Management
  const createAnnouncement = useCallback((announcementData) => {
    const newAnn = {
      ...announcementData,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      pinned: announcementData.pinned || false
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    addToast('Announcement posted to campus feed!', 'success');
    return newAnn;
  }, [addToast]);

  const deleteAnnouncement = useCallback((announcementId) => {
    setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
    addToast('Announcement removed', 'info');
  }, [addToast]);

  // Admin Society Profile Update
  const updateSociety = useCallback((societyId, updatedData) => {
    setSocieties(prev => prev.map(s => (s.id === societyId ? { ...s, ...updatedData } : s)));
    addToast('Society profile updated successfully!', 'success');
  }, [addToast]);

  // Admin Recruitment Settings Update
  const updateRecruitment = useCallback((recruitmentId, updatedData) => {
    setRecruitments(prev => prev.map(r => (r.id === recruitmentId ? { ...r, ...updatedData } : r)));
    
    // Also sync the society's recruitmentOpen flag if modified
    if (updatedData.isOpen !== undefined) {
      const rec = recruitments.find(r => r.id === recruitmentId);
      if (rec?.societyId) {
        setSocieties(prev =>
          prev.map(s => (s.id === rec.societyId ? { ...s, recruitmentOpen: updatedData.isOpen } : s))
        );
      }
    }

    addToast('Recruitment drive settings updated', 'success');
  }, [recruitments, addToast]);

  // Reset to initial demo dataset
  const resetToDemoData = useCallback(() => {
    setSocieties(INITIAL_SOCIETIES);
    setEvents(INITIAL_EVENTS);
    setRecruitments(INITIAL_RECRUITMENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setApplications(INITIAL_APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.SOCIETIES);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.RECRUITMENTS);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    addToast('Reset to original demo dataset', 'info');
  }, [addToast]);

  return (
    <DataContext.Provider
      value={{
        societies,
        events,
        recruitments,
        announcements,
        applications,
        followedSocieties,
        registeredEvents,
        toggleFollow,
        registerForEvent,
        unregisterForEvent,
        submitApplication,
        withdrawApplication,
        updateApplicationStatus,
        createEvent,
        updateEvent,
        deleteEvent,
        createAnnouncement,
        deleteAnnouncement,
        updateSociety,
        updateRecruitment,
        resetToDemoData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
