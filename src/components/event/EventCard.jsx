import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Share2,
  Mail,
  Ticket,
  QrCode
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export function EventModal({ event, isOpen, onClose }) {
  const { registeredEvents, registerForEvent, unregisterForEvent } = useData();
  const [showPass, setShowPass] = useState(false);

  if (!isOpen || !event) return null;

  const isRegistered = registeredEvents.includes(event.id);
  const capacityPercent = Math.min(100, Math.round(((event.registeredCount || 0) / (event.capacity || 100)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-dark-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Banner with close button */}
        <div className="relative h-48 sm:h-56 w-full bg-dark-950 shrink-0">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-dark-900/80 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-violet/80 text-white border border-brand-violet backdrop-blur-md shadow-sm">
              {event.category}
            </span>
            {event.isVirtual && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan-light border border-brand-cyan/40 backdrop-blur-md">
                Virtual Access
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Organizer Header */}
          <div className="flex items-center gap-3">
            <img
              src={event.societyLogo}
              alt={event.societyName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-800"
            />
            <div>
              <div className="text-xs text-slate-400 font-medium">Organized by</div>
              <div className="text-sm font-bold text-white">{event.societyName}</div>
            </div>
          </div>

          {/* Event Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {event.title}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Logistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-400">Date & Schedule</div>
                <div className="text-sm font-semibold text-white">{event.date}</div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {event.time}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-400">Campus Venue</div>
                <div className="text-sm font-semibold text-white">{event.venue}</div>
                {event.isVirtual && (
                  <span className="text-[11px] text-brand-cyan font-medium">Link available upon registration</span>
                )}
              </div>
            </div>
          </div>

          {/* Capacity Bar */}
          <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-brand-violet" />
                Registrations
              </span>
              <span>
                <strong className="text-white font-bold">{event.registeredCount || 0}</strong> / {event.capacity} seats filled ({capacityPercent}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-dark-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-violet to-brand-cyan rounded-full transition-all duration-500"
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
          </div>

          {/* Agenda / Timeline */}
          {event.scheduleTimeline && event.scheduleTimeline.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Event Agenda
              </h3>
              <div className="space-y-3 pl-2 border-l border-brand-violet/30">
                {event.scheduleTimeline.map((item, idx) => (
                  <div key={idx} className="relative pl-5">
                    <span className="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 rounded-full bg-brand-violet ring-4 ring-dark-900" />
                    <div className="text-xs font-mono font-semibold text-brand-cyan-light">{item.time}</div>
                    <div className="text-sm font-semibold text-white">{item.title}</div>
                    {item.speaker && (
                      <div className="text-xs text-slate-400 mt-0.5">Host/Speaker: {item.speaker}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {(event.tags || []).map(t => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-lg bg-dark-800 text-slate-300 border border-slate-700/60 font-medium"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* Digital Ticket Modal view */}
          {showPass && isRegistered && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-violet/20 via-dark-800 to-brand-cyan/10 border border-brand-violet/40 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-brand-violet/20 mb-3">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-brand-violet-light" />
                  <span className="text-sm font-bold text-white">Digital Campus Pass</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  CONFIRMED
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-slate-900 mx-auto" />
                    <span className="text-[8px] text-slate-700 font-mono font-bold block">
                      TKT-{event.id.slice(-5).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-xs space-y-1 text-center sm:text-left">
                  <p className="font-bold text-white text-sm">{event.title}</p>
                  <p className="text-slate-300">{event.date} • {event.time}</p>
                  <p className="text-slate-400">{event.venue}</p>
                  <p className="text-[11px] text-brand-cyan">Present this pass or QR code at entry desk.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-5 bg-dark-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 hidden sm:block">
            <span>Deadline: </span>
            <strong className="text-slate-200">{event.registrationDeadline}</strong>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {isRegistered && (
              <button
                onClick={() => setShowPass(!showPass)}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-brand-violet-light border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Ticket className="w-4 h-4" />
                {showPass ? 'Hide Pass' : 'View Pass'}
              </button>
            )}

            {isRegistered ? (
              <button
                onClick={() => unregisterForEvent(event.id)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors"
              >
                Cancel RSVP
              </button>
            ) : (
              <button
                onClick={() => registerForEvent(event.id)}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-violet to-brand-blue hover:from-brand-violet-dark hover:to-brand-blue-dark shadow-glow-violet transition-all"
              >
                Register for Free
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventCard({ event, onSelect }) {
  const { registeredEvents, registerForEvent } = useData();
  const [modalOpen, setModalOpen] = useState(false);

  const isRegistered = registeredEvents.includes(event.id);
  const capacityPercent = Math.min(100, Math.round(((event.registeredCount || 0) / (event.capacity || 100)) * 100));

  const handleOpen = () => {
    if (onSelect) {
      onSelect(event);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <div className="group relative bg-dark-900 border border-slate-800/80 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-hover-card hover:-translate-y-1">
        {/* Banner with date badge */}
        <div className="relative h-44 w-full overflow-hidden bg-dark-950 cursor-pointer" onClick={handleOpen}>
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />

          {/* Date Stamp Badge */}
          <div className="absolute top-3 left-3 bg-dark-950/90 border border-slate-700/80 rounded-xl px-2.5 py-1 backdrop-blur-md shadow-md text-center">
            <span className="block text-[10px] font-bold text-brand-violet uppercase">
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
            </span>
            <span className="block text-base font-extrabold text-white leading-tight">
              {new Date(event.date).getDate()}
            </span>
          </div>

          {/* Category Chip */}
          <div className="absolute top-3 right-3">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-dark-950/80 text-brand-cyan-light border border-slate-700 backdrop-blur-md">
              {event.category}
            </span>
          </div>

          {isRegistered && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              RSVP Confirmed
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Organizer */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={event.societyLogo}
              alt={event.societyName}
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="text-xs font-medium text-slate-400 truncate">
              {event.societyName}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={handleOpen}
            className="text-base font-bold text-white group-hover:text-brand-violet-light transition-colors line-clamp-2 cursor-pointer mb-2"
          >
            {event.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>

          {/* Venue & Time */}
          <div className="space-y-1.5 text-xs text-slate-300 mb-4 mt-auto">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="pt-3 border-t border-slate-800/80 mb-4">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span>{event.registeredCount || 0} registered</span>
              <span>{event.capacity} total seats</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-dark-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-violet to-brand-cyan rounded-full transition-all duration-300"
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleOpen}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-white border border-slate-700 transition-colors"
            >
              Details
            </button>

            {isRegistered ? (
              <button
                onClick={handleOpen}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1.5"
              >
                <Ticket className="w-3.5 h-3.5" />
                Pass
              </button>
            ) : (
              <button
                onClick={() => registerForEvent(event.id)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-brand-violet hover:bg-brand-violet-dark shadow-sm transition-all text-center"
              >
                RSVP
              </button>
            )}
          </div>
        </div>
      </div>

      <EventModal
        event={event}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
