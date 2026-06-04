'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getDoctors } from '@/app/actions';

function FindDoctorsContent() {
  const searchParams = useSearchParams();

  // Doctors list from database
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All Specializations');
  const [minRating, setMinRating] = useState('0');
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [experienceFilter, setExperienceFilter] = useState('All');
  
  // UI View state
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Load search params
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlSpecialty = searchParams.get('specialty') || '';
    
    if (urlSearch) setSearch(urlSearch);
    
    if (urlSpecialty) {
      // Handle slight name variance
      if (urlSpecialty === 'Eye Care') {
        setSpecialty('Ophthalmology');
      } else {
        setSpecialty(urlSpecialty);
      }
    }
  }, [searchParams]);

  // Load doctors from Prisma database
  useEffect(() => {
    getDoctors()
      .then((data) => {
        // Map some additional fields just in case they are missing in SQLite
        const processed = data.map((doc) => ({
          ...doc,
          experience: doc.id === 1 ? 12 : doc.id === 2 ? 6 : doc.id === 3 ? 15 : 8,
          clinicName: doc.specialty === 'Cardiology' ? "St. Mary's Heart Center" 
                    : doc.specialty === 'Dermatology' ? "SkinCare Innovations"
                    : doc.specialty === 'Pediatrics' ? "Happy Kids Clinic"
                    : "City Health Partners",
          price: doc.specialty === 'Cardiology' ? 120 
               : doc.specialty === 'Dermatology' ? 150 
               : doc.specialty === 'Pediatrics' ? 95 
               : 80,
        }));
        setDoctors(processed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load doctors", err);
        setLoading(false);
      });
  }, []);

  const handleResetFilters = () => {
    setSearch('');
    setSpecialty('All Specializations');
    setMinRating('0');
    setAvailableTodayOnly(false);
    setExperienceFilter('All');
  };

  // Perform client-side filtering on live database items
  const filteredDoctors = doctors.filter((doc) => {
    const matchesNameOrSpecialty = 
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase());
      
    const matchesSpecialty = 
      specialty === 'All Specializations' || 
      doc.specialty.toLowerCase() === specialty.toLowerCase() ||
      (specialty === 'Eye Care' && doc.specialty.toLowerCase() === 'ophthalmology');
      
    const matchesRating = doc.rating >= parseFloat(minRating);
    
    const matchesAvailability = !availableTodayOnly || doc.availableToday;
    
    let matchesExperience = true;
    if (experienceFilter === '5') {
      matchesExperience = doc.experience >= 5;
    } else if (experienceFilter === '10') {
      matchesExperience = doc.experience >= 10;
    }

    return matchesNameOrSpecialty && matchesSpecialty && matchesRating && matchesAvailability && matchesExperience;
  });

  return (
    <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full px-margin-desktop py-md gap-md min-h-screen">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-[280px] shrink-0 space-y-md">
        <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/30">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">Filters</h2>
            <button 
              onClick={handleResetFilters} 
              className="text-primary font-label-sm text-label-sm hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Specialization Select */}
          <div className="mb-lg">
            <label className="font-label-md text-label-md text-on-surface-variant mb-base block">Specialization</label>
            <select 
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-lg p-sm font-body-sm text-body-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
            >
              <option>All Specializations</option>
              <option>Cardiology</option>
              <option>Dermatology</option>
              <option>Pediatrics</option>
              <option>Neurology</option>
            </select>
          </div>

          {/* Price Range Filter (Decorative) */}
          <div className="mb-lg">
            <label className="font-label-md text-label-md text-on-surface-variant mb-base block">Price Preference</label>
            <div className="flex gap-xs">
              <button className="flex-1 py-xs border border-outline-variant rounded-lg font-label-sm text-label-sm hover:bg-primary-container hover:text-on-primary-container transition-colors">$</button>
              <button className="flex-1 py-xs border border-outline-variant rounded-lg font-label-sm text-label-sm bg-primary text-on-primary transition-colors">$$</button>
              <button className="flex-1 py-xs border border-outline-variant rounded-lg font-label-sm text-label-sm hover:bg-primary-container hover:text-on-primary-container transition-colors">$$$</button>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="mb-lg">
            <label className="font-label-md text-label-md text-on-surface-variant mb-base block">Minimum Rating</label>
            <div className="space-y-sm">
              <label className="flex items-center gap-sm cursor-pointer group">
                <input 
                  checked={minRating === '0'}
                  onChange={() => setMinRating('0')}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant" 
                  name="rating" 
                  type="radio"
                />
                <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">All Ratings</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group">
                <input 
                  checked={minRating === '4.8'}
                  onChange={() => setMinRating('4.8')}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant" 
                  name="rating" 
                  type="radio"
                />
                <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">4.8+ Stars</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group">
                <input 
                  checked={minRating === '4.9'}
                  onChange={() => setMinRating('4.9')}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant" 
                  name="rating" 
                  type="radio"
                />
                <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">4.9+ Stars</span>
              </label>
            </div>
          </div>

          {/* Experience Filter */}
          <div className="mb-lg">
            <label className="font-label-md text-label-md text-on-surface-variant mb-base block">Experience</label>
            <div className="space-y-sm">
              <label className="flex items-center gap-sm cursor-pointer group">
                <input 
                  checked={experienceFilter === 'All'}
                  onChange={() => setExperienceFilter('All')}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant" 
                  name="experience" 
                  type="radio"
                />
                <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">All Years</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group">
                <input 
                  checked={experienceFilter === '5'}
                  onChange={() => setExperienceFilter('5')}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant" 
                  name="experience" 
                  type="radio"
                />
                <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">5+ Years Experience</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group">
                <input 
                  checked={experienceFilter === '10'}
                  onChange={() => setExperienceFilter('10')}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant" 
                  name="experience" 
                  type="radio"
                />
                <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">10+ Years Experience</span>
              </label>
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant mb-base block">Availability</label>
            <label className="flex items-center gap-sm cursor-pointer group select-none">
              <input 
                checked={availableTodayOnly}
                onChange={(e) => setAvailableTodayOnly(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary cursor-pointer" 
                type="checkbox"
              />
              <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Available Today</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-grow space-y-md">
        {/* Search & Toggle Bar */}
        <div className="flex flex-col sm:flex-row gap-sm items-center justify-between bg-surface-container-lowest p-sm rounded-xl border border-outline-variant/30 shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-lg pr-sm py-sm bg-surface-container-low border border-transparent rounded-lg font-body-sm focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest outline-none transition-all" 
              placeholder="Search by name or specialty..." 
              type="text"
            />
          </div>
          <div className="flex items-center bg-surface-container-low rounded-lg p-xs w-full sm:w-auto border border-surface-variant/20">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex-1 sm:flex-none flex items-center gap-xs px-md py-xs font-label-sm text-label-sm rounded-md transition-all ${
                viewMode === 'list' 
                  ? 'bg-white text-primary shadow-sm font-bold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span> List
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex-1 sm:flex-none flex items-center gap-xs px-md py-xs font-label-sm text-label-sm rounded-md transition-all ${
                viewMode === 'map' 
                  ? 'bg-white text-primary shadow-sm font-bold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">map</span> Map
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-xl text-center">
            <span className="material-symbols-outlined animate-spin text-[48px] text-primary">progress_activity</span>
            <p className="font-label-md text-label-md text-on-surface-variant mt-sm">Loading doctors database...</p>
          </div>
        ) : viewMode === 'map' ? (
          /* Map View Container */
          <div className="h-[600px] w-full rounded-xl overflow-hidden relative border border-outline-variant/30 shadow-sm animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-surface-container-low flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-[48px] text-primary mb-sm animate-bounce">map</span>
                <p className="font-headline-md text-headline-md text-on-surface">Interactive Medical Map</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Showing {filteredDoctors.length} doctors near your area</p>
              </div>
            </div>
            <div className="absolute top-md left-md z-10">
              <div className="bg-white p-sm rounded-lg shadow-lg flex items-center gap-sm border border-surface-variant/20">
                <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">my_location</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Current Location</p>
                  <p className="font-body-sm text-body-sm text-outline">Boston, MA</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* List View Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-md animate-in fade-in duration-300" id="results-grid">
            {filteredDoctors.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/20 hover:shadow-md transition-all flex flex-col sm:flex-row gap-md relative group hover:border-primary/20"
              >
                <div className="absolute top-md right-md">
                  {doc.availableToday && (
                    <div className="bg-secondary-container/30 text-secondary px-sm py-xs rounded-full flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      <span className="font-label-sm text-[10px] uppercase tracking-wider">Available Today</span>
                    </div>
                  )}
                </div>
                <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-dim">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={doc.image} 
                    alt={doc.name} 
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                      {doc.name}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                      {doc.specialty} • {doc.experience} Years Experience
                    </p>
                    <div className="flex items-center gap-xs mt-xs">
                      <div className="flex text-tertiary">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span 
                            key={i} 
                            className="material-symbols-outlined text-[18px]"
                            style={{ fontVariationSettings: i < Math.floor(doc.rating) ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">({doc.rating})</span>
                    </div>
                  </div>
                  <div className="mt-md flex items-end justify-between">
                    <div>
                      <p className="font-label-sm text-label-sm text-outline mb-xs">{doc.clinicName}</p>
                      <p className="font-headline-md text-headline-md text-primary font-bold">
                        ${doc.price}<span className="text-body-sm font-normal text-on-surface-variant">/session</span>
                      </p>
                    </div>
                    <Link 
                      href={`/booking?doctorId=${doc.id}`}
                      className="bg-primary text-on-primary px-md py-sm rounded-lg font-label-md text-label-md hover:bg-primary-container active:scale-95 transition-all shadow-sm"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredDoctors.length === 0 && (
              <div className="col-span-full py-xl text-center">
                <span className="material-symbols-outlined text-[48px] text-outline mb-sm">error</span>
                <p className="font-headline-md text-headline-md text-on-surface">No specialists found</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Try resetting or adjusting your filter constraints.</p>
                <button 
                  onClick={handleResetFilters}
                  className="mt-md bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-label-md"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default function FindDoctors() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[48px] text-primary">progress_activity</span>
      </div>
    }>
      <FindDoctorsContent />
    </Suspense>
  );
}
