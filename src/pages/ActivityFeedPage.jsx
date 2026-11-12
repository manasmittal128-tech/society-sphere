import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  Calendar,
  Briefcase,
  Bell,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useData } from '../context/DataContext';

export function ActivityFeedPage() {
  const { announcements, events, recruitments, societies } = useData();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'announcement' | 'event' | 'recruitment'

  // Combine multiple data streams into a unified chronological activity feed
  const feedItems = useMemo(() => {
    const items = [];

    // Announcements
    announcements.forEach(ann => {
      items.push({
        id: ann.id,
        type: 'announcement',
        title: ann.title,
        content: ann.content,
        timestamp: ann.date,
        societyId: ann.societyId,
        societyName: ann.societyName,
        societyLogo: ann.societyLogo,
        priority: ann.type
      });
    });

    // Events
    events.forEach(evt => {
      items.push({
        id: `feed-evt-${evt.id}`,
        type: 'event',
        title: `Upcoming: ${evt.title}`,
        content: `${evt.description.slice(0, 160)}... Venue: ${evt.venue} on ${evt.date}. Free registration open.`,
        timestamp: evt.date,
        societyId: evt.societyId,
        societyName: evt.societyName,
        societyLogo: evt.societyLogo,
        eventData: evt
      });
    });

    // Recruitments
    recruitments.filter(r => r.isOpen).forEach(rec => {
      items.push({
        id: `feed-rec-${rec.id}`,
        type: 'recruitment',
        title: `Recruitment Open: ${rec.cycleTitle}`,
        content: `${rec.societyName} is hiring across ${rec.departments.length} departments. Deadline: ${rec.deadline}.`,
        timestamp: '2026-11-11',
        societyId: rec.societyId,
        societyName: rec.societyName,
        societyLogo: rec.societyLogo,
        recruitmentData: rec
      });
    });

    // Sort descending by date
    items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return items;
  }, [announcements, events, recruitments]);

  const filteredFeed = useMemo(() => {
    if (filterType === 'all') return feedItems;
    return feedItems.filter(item => item.type === filterType);
  }, [feedItems, filterType]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-950/80 border border-brand-cyan/30 text-xs font-semibold text-brand-cyan-light">
            <Radio className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
            Live TIET Campus Pulse • Patiala
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Campus Activity Feed
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Real-time chronological updates across all TIET student bodies: HackTU problem tracks, Mudra stage auditions, campus tech workshops, and recruitment deadlines.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All Campus Activity', count: feedItems.length },
          { key: 'announcement', label: 'Announcements', count: feedItems.filter(i => i.type === 'announcement').length },
          { key: 'event', label: 'Event Launches', count: feedItems.filter(i => i.type === 'event').length },
          { key: 'recruitment', label: 'Recruitment Drives', count: feedItems.filter(i => i.type === 'recruitment').length },
        ].map(tab => {
          const isSelected = filterType === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-brand-violet text-white shadow-glow-violet'
                  : 'bg-dark-900 hover:bg-dark-850 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      {/* Feed Stream */}
      <div className="space-y-4">
        {filteredFeed.map(item => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-md"
          >
            {/* Header: Society, Date, Type Badge */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Link to={`/societies/${item.societyId}`}>
                  <img
                    src={item.societyLogo}
                    alt={item.societyName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-800"
                  />
                </Link>
                <div>
                  <Link
                    to={`/societies/${item.societyId}`}
                    className="text-xs font-bold text-white hover:text-brand-violet-light transition-colors block"
                  >
                    {item.societyName}
                  </Link>
                  <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                </div>
              </div>

              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                  item.type === 'recruitment'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : item.type === 'event'
                    ? 'bg-brand-blue/15 text-brand-blue-light border-brand-blue/30'
                    : 'bg-brand-violet/15 text-brand-violet-light border-brand-violet/30'
                }`}
              >
                {item.type}
              </span>
            </div>

            {/* Title & Body */}
            <div>
              <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.content}</p>
            </div>

            {/* Quick action buttons depending on type */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <Link
                to={`/societies/${item.societyId}`}
                className="text-slate-400 hover:text-white font-medium flex items-center gap-1"
              >
                <span>Visit {item.societyName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {item.type === 'event' && (
                <Link
                  to="/events"
                  className="text-brand-blue-light font-bold hover:underline"
                >
                  View in Events Hub →
                </Link>
              )}

              {item.type === 'recruitment' && (
                <Link
                  to="/recruitment"
                  className="text-emerald-400 font-bold hover:underline"
                >
                  Apply in Recruitment Portal →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
