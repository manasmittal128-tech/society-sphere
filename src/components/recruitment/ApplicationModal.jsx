import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Send, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export function ApplicationModal({ recruitment, isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { submitApplication, applications } = useData();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    applicantBranch: currentUser?.branch || 'Computer Engineering (COE)',
    applicantYear: currentUser?.academicYear || '2nd Year (Sophomore)',
    studentId: currentUser?.studentId || '102403142',
    phone: currentUser?.phone || '+91 98765 43210',
    gpa: currentUser?.gpa || '8.5',
    selectedDepartmentId: recruitment?.departments?.[0]?.id || '',
    selectedDepartment: recruitment?.departments?.[0]?.name || '',
    resumeUrl: currentUser?.portfolio || 'https://drive.google.com/sample-resume.pdf',
    githubOrPortfolio: currentUser?.github || 'https://github.com/aman-tiet',
    linkedin: currentUser?.linkedin || 'https://linkedin.com/in/aman-tiet',
    whyJoin: '',
    relevantExperience: '',
    hoursPerWeek: '10 hours',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen || !recruitment) return null;

  // Check if student has already applied
  const existingApplication = applications.find(
    a => a.recruitmentId === recruitment.id && a.applicantId === currentUser?.id
  );

  const selectedDeptObj = recruitment.departments.find(
    d => d.id === formData.selectedDepartmentId || d.name === formData.selectedDepartment
  );

  const handleDeptChange = (deptId) => {
    const dept = recruitment.departments.find(d => d.id === deptId);
    setFormData(prev => ({
      ...prev,
      selectedDepartmentId: deptId,
      selectedDepartment: dept?.name || ''
    }));
  };

  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!formData.applicantBranch) errs.applicantBranch = 'Branch is required';
      if (!formData.phone) errs.phone = 'Phone number is required';
    } else if (step === 2) {
      if (!formData.selectedDepartment) errs.selectedDepartment = 'Please select a department';
    } else if (step === 3) {
      if (!formData.whyJoin || formData.whyJoin.length < 20) {
        errs.whyJoin = 'Please provide at least 20 characters explaining why you want to join.';
      }
      if (!formData.relevantExperience || formData.relevantExperience.length < 20) {
        errs.relevantExperience = 'Please describe your relevant skills or past projects (at least 20 characters).';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const result = submitApplication({
      recruitmentId: recruitment.id,
      societyId: recruitment.societyId,
      societyName: recruitment.societyName,
      societyLogo: recruitment.societyLogo,
      ...formData
    });

    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-dark-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-dark-950/60">
          <div className="flex items-center gap-3">
            <img
              src={recruitment.societyLogo}
              alt={recruitment.societyName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-800"
            />
            <div>
              <span className="text-xs font-semibold text-brand-violet-light uppercase tracking-wider">
                Recruitment Application
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white truncate max-w-sm">
                {recruitment.societyName}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Application Banner */}
        {existingApplication ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-brand-violet/20 text-brand-violet border border-brand-violet/40 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Application Already Submitted</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              You applied for <strong className="text-white">{existingApplication.selectedDepartment}</strong> on {new Date(existingApplication.submittedAt).toLocaleDateString()}.
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-violet/20 border border-brand-violet/30 text-brand-violet-light font-bold text-xs">
              Current Status: {existingApplication.status}
            </div>
            <p className="text-xs text-slate-400">
              You can track your recruitment stages or withdraw your application in the "My Communities" portal.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-white border border-slate-700 text-xs font-semibold"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Step Stepper Header */}
            <div className="px-6 py-3 bg-dark-950/40 border-b border-slate-800/80 flex items-center justify-between text-xs">
              {[
                { num: 1, label: 'Profile' },
                { num: 2, label: 'Department' },
                { num: 3, label: 'Questions' },
                { num: 4, label: 'Review' },
              ].map(s => (
                <div
                  key={s.num}
                  className={`flex items-center gap-2 ${
                    currentStep === s.num
                      ? 'text-brand-violet-light font-bold'
                      : currentStep > s.num
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentStep === s.num
                        ? 'bg-brand-violet text-white'
                        : currentStep > s.num
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-dark-800 text-slate-400'
                    }`}
                  >
                    {currentStep > s.num ? '✓' : s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Form Steps */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* STEP 1: Personal & Academic Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Student Information</h3>
                    <p className="text-xs text-slate-400">Confirm your academic and contact details for the society leads.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        disabled
                        value={currentUser?.name || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-slate-400 text-sm cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Email</label>
                      <input
                        type="email"
                        disabled
                        value={currentUser?.email || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-slate-400 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Branch</label>
                      <input
                        type="text"
                        value={formData.applicantBranch}
                        onChange={e => setFormData({ ...formData, applicantBranch: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                        placeholder="e.g. Computer Science & Eng"
                      />
                      {errors.applicantBranch && (
                        <span className="text-[11px] text-rose-400">{errors.applicantBranch}</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Year of Study</label>
                      <select
                        value={formData.applicantYear}
                        onChange={e => setFormData({ ...formData, applicantYear: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                        placeholder="+1 (555) 000-0000"
                      />
                      {errors.phone && (
                        <span className="text-[11px] text-rose-400">{errors.phone}</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Current GPA (Optional)</label>
                      <input
                        type="text"
                        value={formData.gpa}
                        onChange={e => setFormData({ ...formData, gpa: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                        placeholder="3.85"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Department Selection & Links */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Select Department & Preference</h3>
                    <p className="text-xs text-slate-400">Choose the core team you wish to join.</p>
                  </div>

                  <div className="space-y-2.5">
                    {recruitment.departments.map(dept => {
                      const isSelected =
                        formData.selectedDepartmentId === dept.id || formData.selectedDepartment === dept.name;
                      return (
                        <div
                          key={dept.id || dept.name}
                          onClick={() => handleDeptChange(dept.id || dept.name)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-brand-violet/20 border-brand-violet shadow-glow-violet'
                              : 'bg-dark-850 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-white">{dept.name}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-dark-800 text-brand-cyan-light font-semibold border border-slate-700">
                              {dept.seats || 3} seats open
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{dept.description}</p>
                          {dept.requirements && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {dept.requirements.map((req, rIdx) => (
                                <span key={rIdx} className="text-[10px] px-2 py-0.5 rounded bg-dark-900 text-slate-400">
                                  • {req}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Portfolio Links</h4>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Resume / CV Link</label>
                      <input
                        type="url"
                        value={formData.resumeUrl}
                        onChange={e => setFormData({ ...formData, resumeUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                        placeholder="https://drive.google.com/file/..."
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub / Portfolio</label>
                        <input
                          type="url"
                          value={formData.githubOrPortfolio}
                          onChange={e => setFormData({ ...formData, githubOrPortfolio: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile</label>
                        <input
                          type="url"
                          value={formData.linkedin}
                          onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Screening Questions */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Screening Questions</h3>
                    <p className="text-xs text-slate-400">Help the executive council understand your motivation and past experience.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Why do you want to join {recruitment.societyName}? <span className="text-brand-violet">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.whyJoin}
                      onChange={e => setFormData({ ...formData, whyJoin: e.target.value })}
                      className="w-full p-3 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                      placeholder="Share what excites you about the society's mission and what you hope to achieve as a member..."
                    />
                    {errors.whyJoin && (
                      <span className="text-[11px] text-rose-400">{errors.whyJoin}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Relevant Projects or Leadership Experience <span className="text-brand-violet">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.relevantExperience}
                      onChange={e => setFormData({ ...formData, relevantExperience: e.target.value })}
                      className="w-full p-3 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                      placeholder="Briefly describe 1 or 2 projects, technical skills, or initiatives you've worked on..."
                    />
                    {errors.relevantExperience && (
                      <span className="text-[11px] text-rose-400">{errors.relevantExperience}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Weekly Commitment
                    </label>
                    <select
                      value={formData.hoursPerWeek}
                      onChange={e => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-sm"
                    >
                      <option value="6-8 hours">6-8 hours / week</option>
                      <option value="10-12 hours">10-12 hours / week (Recommended)</option>
                      <option value="15+ hours">15+ hours / week (Lead roles)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-brand-violet/15 border border-brand-violet/30 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-bold text-white">Ready to Submit!</div>
                      <p className="text-slate-300 mt-0.5">
                        Your application will be sent directly to the executive council of {recruitment.societyName}. You can track progress in real-time.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-dark-850 p-4 rounded-2xl border border-slate-800 text-xs">
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Target Society:</span>
                      <span className="font-bold text-white">{recruitment.societyName}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Chosen Department:</span>
                      <span className="font-bold text-brand-cyan-light">{formData.selectedDepartment}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Applicant:</span>
                      <span className="font-bold text-white">{currentUser?.name} ({formData.applicantBranch}, {formData.applicantYear})</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Weekly Commitment:</span>
                      <span className="font-bold text-white">{formData.hoursPerWeek}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Statement of Interest:</span>
                      <p className="text-slate-200 bg-dark-900 p-2.5 rounded-lg border border-slate-800 line-clamp-3">
                        {formData.whyJoin}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Navigation Buttons */}
            <div className="p-4 sm:p-5 bg-dark-950 border-t border-slate-800 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-dark-850 hover:bg-dark-800 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-violet hover:bg-brand-violet-dark transition-all flex items-center gap-1.5 shadow-sm"
                >
                  Continue
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-violet to-brand-cyan hover:from-brand-violet-dark hover:to-brand-cyan-dark shadow-glow-violet transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Application
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
