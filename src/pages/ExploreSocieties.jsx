import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  Users,
  Compass,
  X,
  SlidersHorizontal,
  Clock,
  BookmarkCheck,
  Star,
  Building2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { SocietyCard } from '../components/society/SocietyCard';
import { TIET_CATEGORIES, TIET_ORG_TYPES } from '../data/mockData';

export function ExploreSocieties() {
  const { societies, followedSocieties } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All Types');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'members' | 'name' | 'recruiting'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filterRecruitingOnly, setFilterRecruitingOnly] = useState(false);
  const [filterFollowedOnly, setFilterFollowedOnly] = useState(false);
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false);
  const [filterRecentlyViewed, setFilterRecentlyViewed] = useState(false);

  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('societysphere_recent_societies');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync url param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && TIET_CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
    }
    const type = searchParams.get('type');
    if (type && TIET_ORG_TYPES.includes(type)) {
      setSelectedType(type);
    }
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const filteredSocieties = useMemo(() => {
    return societies
      .filter(s => {
        // Organization Type filter
        if (selectedType !== 'All Types' && s.type !== selectedType) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'All Categories' && s.category !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = s.name.toLowerCase().includes(q);
          const matchAcronym = (s.acronym || '').toLowerCase().includes(q);
          const matchTag = s.tags && s.tags.some(t => t.toLowerCase().includes(q));
          const matchDesc = (s.description || '').toLowerCase().includes(q);
          const matchType = (s.type || '').toLowerCase().includes(q);
          if (!matchName && !matchAcronym && !matchTag && !matchDesc && !matchType) {
            return false;
          }
        }

        // Special toggle filters
        if (filterRecruitingOnly && !s.recruitmentOpen) return false;
        if (filterFollowedOnly && !followedSocieties.includes(s.id)) return false;
        if (filterFeaturedOnly && !s.featured) return false;
        if (filterRecentlyViewed && !recentlyViewedIds.includes(s.id)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.followerCount || 0) - (a.followerCount || 0);
        if (sortBy === 'members') return (b.memberCount || 0) - (a.memberCount || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'recruiting') {
          if (a.recruitmentOpen === b.recruitmentOpen) {
            return (b.followerCount || 0) - (a.followerCount || 0);
          }
          return a.recruitmentOpen ? -1 : 1;
        }
        return 0;
      });
  }, [
    societies,
    selectedCategory,
    selectedType,
    searchQuery,
    sortBy,
    filterRecruitingOnly,
    filterFollowedOnly,
    filterFeaturedOnly,
    filterRecentlyViewed,
    recentlyViewedIds,
    followedSocieties
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedType('All Types');
    setSortBy('popular');
    setFilterRecruitingOnly(false);
    setFilterFollowedOnly(false);
    setFilterFeaturedOnly(false);
    setFilterRecentlyViewed(false);
    setSearchParams({});
  };

  // Group counts for types
  const typeCounts = useMemo(() => {
    const counts = { 'All Types': societies.length };
    TIET_ORG_TYPES.forEach(t => {
      if (t !== 'All Types') {
        counts[t] = societies.filter(s => s.type === t).length;
      }
    });
    return counts;
  }, [societies]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-violet/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-950/80 border border-brand-violet/30 text-xs font-semibold text-brand-violet-light">
            <Compass className="w-3.5 h-3.5 text-brand-violet" />
            Official TIET Student Bodies • Dean of Student Affairs (DoSA)
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Thapar Student Organizations
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Discover official societies, clubs, student chapters, and administrative cells across engineering, computing, performing arts, entrepreneurship, literature, social service, and sports at TIET Patiala.
          </p>
        </div>
      </div>

      {/* Organization Type Selector (Society, Club, Student Chapter, Cell, Unit) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-brand-cyan" />
            <span>Organization Type</span>
          </div>
          <span className="text-xs text-slate-400">Preserving official TIET charter designations</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TIET_ORG_TYPES.map(type => {
            const isSelected = selectedType === type;
            const count = typeCounts[type] || 0;
            return (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  if (type === 'All Types') {
                    searchParams.delete('type');
                  } else {
                    searchParams.set('type', type);
                  }
                  setSearchParams(searchParams);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-brand-blue text-white shadow-glow-cyan border border-brand-blue/50'
                    : 'bg-dark-900 hover:bg-dark-850 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{type}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-dark-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-brand-violet-light" />
          <span>Domain & Focus Area</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TIET_CATEGORIES.map(category => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  if (category === 'All Categories') {
                    searchParams.delete('category');
                  } else {
                    searchParams.set('category', category);
                  }
                  setSearchParams(searchParams);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-violet text-white shadow-glow-violet border border-brand-violet/40'
                    : 'bg-dark-900 hover:bg-dark-850 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls Bar: Search, Quick Filters, Sort, View toggle */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, acronym (CCS, MLSC, MUDRA), domain, or tags (AI, Robotics)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-dark-850 border border-slate-800 focus:border-brand-violet text-white text-xs sm:text-sm"
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

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick toggle check buttons */}
          <button
            onClick={() => setFilterRecruitingOnly(!filterRecruitingOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              filterRecruitingOnly
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-dark-850 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Recruiting Drives
          </button>

          <button
            onClick={() => setFilterFeaturedOnly(!filterFeaturedOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              filterFeaturedOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-dark-850 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            Featured
          </button>

          <button
            onClick={() => setFilterFollowedOnly(!filterFollowedOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              filterFollowedOnly
                ? 'bg-brand-violet/20 text-brand-violet-light border-brand-violet/40'
                : 'bg-dark-850 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-brand-violet-light" />
            Following ({followedSocieties.length})
          </button>

          {recentlyViewedIds.length > 0 && (
            <button
              onClick={() => setFilterRecentlyViewed(!filterRecentlyViewed)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                filterRecentlyViewed
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-dark-850 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Recently Viewed
            </button>
          )}

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-dark-850 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-400 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="popular" className="bg-dark-900">Campus Following</option>
              <option value="members" className="bg-dark-900">Member Strength</option>
              <option value="recruiting" className="bg-dark-900">Active Recruitment First</option>
              <option value="name" className="bg-dark-900">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-dark-850 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-dark-750 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-dark-750 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white font-bold">{filteredSocieties.length}</strong> of {societies.length} TIET student organizations
        </span>
        {(searchQuery || selectedCategory !== 'All Categories' || selectedType !== 'All Types' || filterRecruitingOnly || filterFollowedOnly || filterFeaturedOnly || filterRecentlyViewed) && (
          <button
            onClick={handleResetFilters}
            className="text-brand-violet-light font-semibold hover:underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Societies Display Grid / List */}
      {filteredSocieties.length === 0 ? (
        <div className="p-16 rounded-3xl bg-dark-900 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-dark-850 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-lg font-bold text-white">No TIET organizations match your current filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your search query, selecting "All Types" or "All Categories", or removing the active recruitment filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-violet text-white shadow-sm hover:bg-brand-violet-dark transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSocieties.map(society => (
            <SocietyCard key={society.id} society={society} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSocieties.map(society => (
            <SocietyCard key={society.id} society={society} viewMode="list" />
          ))}
        </div>
      )}
    </div>
  );
}
