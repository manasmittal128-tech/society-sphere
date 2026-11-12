import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { EventModal } from './EventCard';

export function EventCalendar({ events }) {
  // Default to November 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // 0-indexed month 10 = Nov
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [activeDateString, setActiveDateString] = useState('2026-11-21');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Group events by YYYY-MM-DD
  const eventsByDate = {};
  events.forEach(evt => {
    if (!eventsByDate[evt.date]) {
      eventsByDate[evt.date] = [];
    }
    eventsByDate[evt.date].push(evt);
  });

  const handleDayClick = (dayStr, dayEvents) => {
    setActiveDateString(dayStr);
    setSelectedDayEvents(dayEvents);
  };

  // Days array for calendar grid
  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dayPadded = d < 10 ? `0${d}` : `${d}`;
    const monthPadded = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${monthPadded}-${dayPadded}`;
    days.push({
      dayNumber: d,
      dateString: dateStr,
      dayEvents: eventsByDate[dateStr] || []
    });
  }

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
      {/* Month Navigation */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-violet/15 text-brand-violet border border-brand-violet/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {monthNames[month]} {year}
            </h3>
            <p className="text-xs text-slate-400">
              Interactive Campus Calendar • {events.length} Scheduled Events
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (col-span-2) */}
        <div className="lg:col-span-2">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-400 uppercase">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid of days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((dayItem, idx) => {
              if (!dayItem) {
                return <div key={`empty-${idx}`} className="h-20 rounded-xl bg-dark-950/40 opacity-20" />;
              }

              const hasEvents = dayItem.dayEvents.length > 0;
              const isSelected = activeDateString === dayItem.dateString;

              return (
                <div
                  key={dayItem.dateString}
                  onClick={() => handleDayClick(dayItem.dateString, dayItem.dayEvents)}
                  className={`h-20 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-brand-violet/20 border-brand-violet shadow-glow-violet'
                      : hasEvents
                      ? 'bg-dark-850/90 border-slate-700/80 hover:border-brand-violet/50'
                      : 'bg-dark-950/70 border-slate-800/60 hover:bg-dark-850/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-brand-violet-light' : hasEvents ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {dayItem.dayNumber}
                    </span>
                    {hasEvents && (
                      <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                    )}
                  </div>

                  {hasEvents && (
                    <div className="space-y-1 overflow-hidden">
                      {dayItem.dayEvents.slice(0, 1).map(ev => (
                        <div
                          key={ev.id}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-brand-violet/30 text-brand-violet-light font-medium truncate border border-brand-violet/40"
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayItem.dayEvents.length > 1 && (
                        <span className="text-[9px] text-brand-cyan font-bold block truncate">
                          +{dayItem.dayEvents.length - 1} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Sidebar */}
        <div className="bg-dark-950 rounded-2xl p-5 border border-slate-800/80 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {activeDateString ? `Date: ${activeDateString}` : 'Select a date'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-dark-800 text-slate-300">
              {selectedDayEvents.length} events
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 max-h-96">
            {selectedDayEvents.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <p>No events scheduled on this day.</p>
                <p className="mt-1 text-slate-400">Click highlighted days (with cyan dots) to view scheduled events.</p>
              </div>
            ) : (
              selectedDayEvents.map(evt => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="p-3.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-800 hover:border-brand-violet/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <img src={evt.societyLogo} alt={evt.societyName} className="w-4 h-4 rounded-full" />
                    <span className="text-[11px] text-slate-400 truncate">{evt.societyName}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-brand-violet-light transition-colors line-clamp-1">
                    {evt.title}
                  </h4>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brand-cyan" />
                      {evt.time.split('-')[0]}
                    </span>
                    <span className="text-brand-violet-light font-medium group-hover:underline">
                      View details →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
