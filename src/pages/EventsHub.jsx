import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Filter,
  LayoutGrid,
  CalendarDays,
  Ticket,
  Clock,
  MapPin,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { EventCard } from '../components/event/EventCard';
import { EventCalendar } from '../components/event/EventCalendar';
import { TIET_CATEGORIES } from '../data/mockData';

export function EventsHub() {
  const { events, registeredEvents } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [filterRegisteredOnly, setFilterRegisteredOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'calendar'

  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      // Category
      if (selectedCategory !== 'All Categories' && evt.category !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = evt.title.toLowerCase().includes(q);
        const matchSociety = evt.societyName.toLowerCase().includes(q);
        const matchTag = evt.tags && evt.tags.some(t => t.toLowerCase().includes(q));
        const matchVenue = (evt.venue || '').toLowerCase().includes(q);
        if (!matchTitle && !matchSociety && !matchTag && !matchVenue) {
          return false;
        }
      }

      // Registered only
      if (filterRegisteredOnly && !registeredEvents.includes(evt.id)) {
        return false;
      }

      return true;
    });
  }, [events, selectedCategory, searchQuery, filterRegisteredOnly, registeredEvents]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setFilterRegisteredOnly(false);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-950/80 border border-brand-blue/30 text-xs font-semibold text-brand-blue-light">
            <Calendar className="w-3.5 h-3.5 text-brand-blue" />
            TIET Campus Events & Hackathons Hub • Patiala
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Discover TIET Events & Workshops
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Reserve your seats for HackTU 6.0, Mudra Acoustic Night, HackOWASP, TEDxTIET, RoboClash, and Thapar E-Summit across campus venues like COS Complex, TAN Building, and Main Auditorium.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-300/80 pt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Sample dates and schedule times are for platform prototype demonstration.</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TIET_CATEGORIES.map(category => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-brand-blue text-white shadow-glow-cyan border border-brand-blue/40'
                  : 'bg-dark-900 hover:bg-dark-850 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* View Mode Toggle & Filter Controls */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search events by title, organizer (CCS, MUDRA), or venue (COS, TAN)..."
            className="w-full pl-10 pr-10 py-2 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-xs sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterRegisteredOnly(!filterRegisteredOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              filterRegisteredOnly
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-dark-850 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>My Registered ({registeredEvents.length})</span>
          </button>

          {/* Grid vs Calendar toggle */}
          <div className="flex items-center p-1 rounded-xl bg-dark-850 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold px-2.5 ${
                viewMode === 'grid' ? 'bg-dark-750 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold px-2.5 ${
                viewMode === 'calendar' ? 'bg-dark-750 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white font-bold">{filteredEvents.length}</strong> campus events
        </span>
        {(searchQuery || selectedCategory !== 'All Categories' || filterRegisteredOnly) && (
          <button
            onClick={handleResetFilters}
            className="text-brand-violet-light font-semibold hover:underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {/* Main Display: Grid or Interactive Calendar */}
      {viewMode === 'calendar' ? (
        <EventCalendar events={filteredEvents} />
      ) : filteredEvents.length === 0 ? (
        <div className="p-16 rounded-3xl bg-dark-900 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-dark-850 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Calendar className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-lg font-bold text-white">No campus events match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or selecting "All Categories".
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-violet text-white shadow-sm hover:bg-brand-violet-dark transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
