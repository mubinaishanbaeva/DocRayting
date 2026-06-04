'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Mock Data
const MOCK_PHARMACIES = [
  {
    id: 1,
    name: "Walgreens Pharmacy",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
    rating: 4.8,
    reviews: 1240,
    address: "145 4th Ave, New York, NY 10003",
    lat: 80, // percentage for mock map
    lng: 40,
    openNow: true,
    phone: "(212) 677-0214",
    deliveryAvailable: true,
    vaccinationAvailable: true,
    insuranceAccepted: true,
    workingHours: "Open 24 Hours",
    distance: 0.4,
    estimatedDeliveryTime: "45-60 min",
    emergency24h: true
  },
  {
    id: 2,
    name: "Capsule - Free Delivery",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    rating: 4.9,
    reviews: 3450,
    address: "122 W 146th St, New York, NY 10039",
    lat: 40,
    lng: 60,
    openNow: true,
    phone: "(212) 555-8901",
    deliveryAvailable: true,
    vaccinationAvailable: false,
    insuranceAccepted: true,
    workingHours: "8:00 AM - 10:00 PM",
    distance: 1.2,
    estimatedDeliveryTime: "20-30 min",
    emergency24h: false
  },
  {
    id: 3,
    name: "CVS Health Center",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400",
    rating: 4.5,
    reviews: 890,
    address: "2182 Broadway, New York, NY 10024",
    lat: 60,
    lng: 20,
    openNow: false,
    phone: "(212) 799-0102",
    deliveryAvailable: false,
    vaccinationAvailable: true,
    insuranceAccepted: true,
    workingHours: "9:00 AM - 8:00 PM",
    distance: 2.5,
    estimatedDeliveryTime: "N/A",
    emergency24h: false
  },
  {
    id: 4,
    name: "CityCare Compounding",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400",
    rating: 4.7,
    reviews: 420,
    address: "452 5th Ave, New York, NY 10018",
    lat: 25,
    lng: 80,
    openNow: true,
    phone: "(212) 555-3444",
    deliveryAvailable: true,
    vaccinationAvailable: true,
    insuranceAccepted: false,
    workingHours: "8:00 AM - 11:00 PM",
    distance: 3.1,
    estimatedDeliveryTime: "1-2 hours",
    emergency24h: false
  }
];

export default function PharmaciesFinder() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    openNow: false,
    delivery: false,
    emergency: false,
    vaccination: false,
    insurance: false,
    maxDistance: 10
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const toggleFilter = (key: keyof typeof filters) => {
    if (key === 'maxDistance') return;
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setFilters({
      openNow: false,
      delivery: false,
      emergency: false,
      vaccination: false,
      insurance: false,
      maxDistance: 10
    });
  };

  const filteredPharmacies = useMemo(() => {
    return MOCK_PHARMACIES.filter(pharma => {
      const matchSearch = pharma.name.toLowerCase().includes(search.toLowerCase());
      const matchOpen = !filters.openNow || pharma.openNow;
      const matchDelivery = !filters.delivery || pharma.deliveryAvailable;
      const matchEmergency = !filters.emergency || pharma.emergency24h;
      const matchVaccination = !filters.vaccination || pharma.vaccinationAvailable;
      const matchInsurance = !filters.insurance || pharma.insuranceAccepted;
      const matchDistance = pharma.distance <= filters.maxDistance;

      return matchSearch && matchOpen && matchDelivery && matchEmergency && matchVaccination && matchInsurance && matchDistance;
    });
  }, [search, filters]);

  const selectedPharmacy = MOCK_PHARMACIES.find(p => p.id === selectedPharmacyId);

  return (
    <div className="bg-background min-h-screen text-on-background font-body-md pb-xl">
      {/* 1. TOP SEARCH SECTION */}
      <section className="bg-surface-container-lowest border-b border-surface-variant/20 sticky top-0 z-40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-md mb-md">
            <h1 className="text-3xl font-bold text-primary">Find a Pharmacy</h1>
            
            {/* View Toggle */}
            <div className="flex p-1 bg-surface-container rounded-xl border border-outline-variant/20 w-full md:w-auto">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-md' : 'text-on-surface-variant hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-[20px]">list</span>
                List
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-white text-primary shadow-md' : 'text-on-surface-variant hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-[20px]">map</span>
                Map
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="relative flex-1 group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">search</span>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pharmacy name, services, or medication..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-outline-variant/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none bg-surface-bright text-base transition-all shadow-sm"
              />
            </div>
            <div className="relative flex-1 group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">location_on</span>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, neighborhood, or Zip code" 
                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-outline-variant/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none bg-surface-bright text-base transition-all shadow-sm"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-surface-container rounded-full text-primary transition-colors" title="Use my location">
                <span className="material-symbols-outlined text-[20px]">my_location</span>
              </button>
            </div>
            <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-container active:scale-95 transition-all shadow-lg shadow-primary/20 whitespace-nowrap hidden md:block">
              Search
            </button>
            
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center justify-center gap-2 bg-surface-container px-6 py-4 rounded-2xl font-bold text-on-surface hover:bg-surface-container-high transition-all"
            >
              <span className="material-symbols-outlined">tune</span>
              Filters
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* 2. FILTER SIDEBAR */}
        <aside className={`lg:col-span-3 ${isMobileFilterOpen ? 'fixed inset-0 z-50 bg-black/50 flex flex-col justify-end' : 'hidden lg:block'}`}>
          <div className={`bg-surface-container-lowest p-6 rounded-t-[2rem] lg:rounded-3xl border-t lg:border border-outline-variant/20 shadow-2xl lg:shadow-md sticky top-48 w-full ${isMobileFilterOpen ? 'h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-300' : ''}`}>
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-on-surface">Filters</h2>
              <button onClick={handleResetFilters} className="text-sm font-bold text-primary hover:underline">Reset All</button>
            </div>

            {isMobileFilterOpen && (
              <button onClick={() => setIsMobileFilterOpen(false)} className="absolute top-6 right-6 p-2 bg-surface-container rounded-full lg:hidden">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}

            <div className="space-y-6">
              {/* Distance Slider */}
              <div className="border-b border-outline-variant/10 pb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-sm text-on-surface">Distance</span>
                  <span className="text-sm font-semibold text-primary">{filters.maxDistance} miles</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="50" 
                  value={filters.maxDistance}
                  onChange={(e) => setFilters({...filters, maxDistance: Number(e.target.value)})}
                  className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4 border-b border-outline-variant/10 pb-6">
                <h3 className="font-bold text-sm text-on-surface mb-2">Availability</h3>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">Open Now</span>
                  <div className={`w-12 h-6 rounded-full transition-colors relative ${filters.openNow ? 'bg-primary' : 'bg-surface-container-high'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${filters.openNow ? 'left-6' : 'left-0.5'}`}></div>
                  </div>
                  <input type="checkbox" className="hidden" checked={filters.openNow} onChange={() => toggleFilter('openNow')} />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">24/7 Pharmacy</span>
                  <div className={`w-12 h-6 rounded-full transition-colors relative ${filters.emergency ? 'bg-primary' : 'bg-surface-container-high'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${filters.emergency ? 'left-6' : 'left-0.5'}`}></div>
                  </div>
                  <input type="checkbox" className="hidden" checked={filters.emergency} onChange={() => toggleFilter('emergency')} />
                </label>
              </div>

              <div className="space-y-4 pb-6">
                <h3 className="font-bold text-sm text-on-surface mb-2">Services</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${filters.delivery ? 'bg-primary border-primary' : 'border-2 border-outline-variant group-hover:border-primary'}`}>
                    {filters.delivery && <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>}
                  </div>
                  <span className="text-sm font-medium text-on-surface-variant">Home Delivery</span>
                  <input type="checkbox" className="hidden" checked={filters.delivery} onChange={() => toggleFilter('delivery')} />
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${filters.vaccination ? 'bg-primary border-primary' : 'border-2 border-outline-variant group-hover:border-primary'}`}>
                    {filters.vaccination && <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>}
                  </div>
                  <span className="text-sm font-medium text-on-surface-variant">Vaccinations</span>
                  <input type="checkbox" className="hidden" checked={filters.vaccination} onChange={() => toggleFilter('vaccination')} />
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${filters.insurance ? 'bg-primary border-primary' : 'border-2 border-outline-variant group-hover:border-primary'}`}>
                    {filters.insurance && <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>}
                  </div>
                  <span className="text-sm font-medium text-on-surface-variant">Accepts Most Insurance</span>
                  <input type="checkbox" className="hidden" checked={filters.insurance} onChange={() => toggleFilter('insurance')} />
                </label>
              </div>

              {isMobileFilterOpen && (
                <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-primary text-white py-4 rounded-xl font-bold mt-4">
                  Show {filteredPharmacies.length} Results
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-9">
          
          {/* 6. EMPTY STATE */}
          {filteredPharmacies.length === 0 && (
            <div className="bg-surface-container-lowest rounded-3xl p-12 text-center shadow-sm border border-outline-variant/20 animate-in fade-in zoom-in-95">
              <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[64px] text-primary/40">search_off</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-2">No pharmacies found</h2>
              <p className="text-on-surface-variant max-w-md mx-auto mb-8">We couldn't find any pharmacies matching your current filters in this area. Try expanding your search radius or removing some filters.</p>
              <button onClick={handleResetFilters} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-container transition-all">
                Clear All Filters
              </button>
            </div>
          )}

          {filteredPharmacies.length > 0 && (
            <>
              <p className="font-bold text-on-surface mb-6">{filteredPharmacies.length} pharmacies found near you</p>

              {/* 3. MAP VIEW */}
              {viewMode === 'map' && (
                <div className="w-full h-[600px] bg-[#e5e3df] rounded-3xl overflow-hidden relative shadow-inner animate-in fade-in duration-500 border border-outline-variant/20">
                  {/* Mock Map Texture Background */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0b1c30 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                  
                  {/* Map Controls */}
                  <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-20">
                    <button className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-primary hover:bg-surface-container transition-all"><span className="material-symbols-outlined">add</span></button>
                    <button className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-primary hover:bg-surface-container transition-all"><span className="material-symbols-outlined">remove</span></button>
                    <button className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-primary mt-4 hover:bg-surface-container transition-all"><span className="material-symbols-outlined">my_location</span></button>
                  </div>

                  {/* Pins */}
                  {filteredPharmacies.map(pharma => (
                    <div 
                      key={pharma.id}
                      onClick={() => setSelectedPharmacyId(pharma.id)}
                      className={`absolute -translate-x-1/2 -translate-y-full cursor-pointer group transition-all duration-300 z-10 ${selectedPharmacyId === pharma.id ? 'z-30 scale-125' : 'hover:scale-110 hover:z-20'}`}
                      style={{ top: `${pharma.lat}%`, left: `${pharma.lng}%` }}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-4 border-white ${pharma.openNow ? (pharma.emergency24h ? 'bg-blue-500' : 'bg-green-500') : 'bg-red-500'}`}>
                        <span className="material-symbols-outlined text-white text-[20px]">{pharma.emergency24h ? 'local_hospital' : 'local_pharmacy'}</span>
                      </div>
                      {/* Pin Needle */}
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                    </div>
                  ))}

                  {/* 4. PHARMACY POPUP CARD */}
                  {selectedPharmacy && (
                    <div className="absolute top-6 left-6 w-[calc(100%-48px)] max-w-sm bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-2xl z-40 border border-white/50 animate-in slide-in-from-top-4 fade-in duration-300">
                      <button onClick={() => setSelectedPharmacyId(null)} className="absolute top-4 right-4 p-1.5 bg-surface-container rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                      <div className="flex gap-4 mb-4">
                        <img src={selectedPharmacy.image} alt="Pharmacy" className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`w-2 h-2 rounded-full ${selectedPharmacy.openNow ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{selectedPharmacy.openNow ? 'Open Now' : 'Closed'}</span>
                          </div>
                          <h3 className="font-bold text-lg leading-tight text-on-surface mb-1">{selectedPharmacy.name}</h3>
                          <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                            <span className="material-symbols-outlined text-[16px]">star</span>
                            {selectedPharmacy.rating} <span className="text-on-surface-variant font-medium">({selectedPharmacy.reviews})</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-5">
                        <div className="flex items-start gap-2 text-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px] shrink-0">location_on</span>
                          <span className="leading-snug">{selectedPharmacy.address} <br/> <span className="font-bold text-primary">{selectedPharmacy.distance} miles away</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">schedule</span>
                          <span>{selectedPharmacy.workingHours}</span>
                        </div>
                        {selectedPharmacy.deliveryAvailable && (
                          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                            <span>Delivery: <span className="font-bold">{selectedPharmacy.estimatedDeliveryTime}</span></span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-primary-container transition-all">Directions</button>
                        <a href={`tel:${selectedPharmacy.phone}`} className="flex-1 bg-surface-container text-primary py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1 border border-outline-variant/20 hover:bg-surface-container-high transition-all">
                          <span className="material-symbols-outlined text-[18px]">call</span> Call
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. LIST VIEW CARDS */}
              {viewMode === 'list' && (
                <div className="space-y-6">
                  {filteredPharmacies.map(pharma => (
                    <div key={pharma.id} className="bg-surface-container-lowest rounded-3xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/15 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row gap-6">
                      
                      <div className="w-full md:w-64 h-56 rounded-2xl overflow-hidden shrink-0 relative bg-surface-dim">
                        <img src={pharma.image} alt={pharma.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-sm border border-white/20 ${pharma.openNow ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            {pharma.openNow ? 'Open Now' : 'Closed'}
                          </div>
                          {pharma.emergency24h && (
                            <div className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 bg-blue-500/90 text-white backdrop-blur-md shadow-sm border border-white/20">
                              <span className="material-symbols-outlined text-[14px]">bolt</span>
                              24/7
                            </div>
                          )}
                        </div>
                        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-on-surface hover:text-red-500 hover:bg-white transition-all shadow-sm">
                          <span className="material-symbols-outlined text-[20px]">favorite_border</span>
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-2xl font-bold text-on-surface group-hover:text-primary transition-colors">{pharma.name}</h2>
                          <div className="hidden md:flex bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 items-center gap-1 text-primary font-bold text-sm">
                            <span className="material-symbols-outlined text-[18px]">route</span>
                            {pharma.distance} mi
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center text-orange-500">
                            {[1, 2, 3, 4, 5].map(star => (
                              <span key={star} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {star <= Math.round(pharma.rating) ? 'star' : 'star_border'}
                              </span>
                            ))}
                          </div>
                          <span className="font-bold text-sm">{pharma.rating}</span>
                          <span className="text-on-surface-variant text-sm underline decoration-outline-variant/30 hover:text-primary cursor-pointer transition-colors">({pharma.reviews} reviews)</span>
                        </div>

                        <div className="space-y-2 mb-6">
                          <p className="flex items-start gap-2 text-on-surface-variant text-sm">
                            <span className="material-symbols-outlined text-[18px] text-outline">location_on</span>
                            {pharma.address}
                          </p>
                          <p className="flex items-start gap-2 text-on-surface-variant text-sm">
                            <span className="material-symbols-outlined text-[18px] text-outline">schedule</span>
                            Hours: <span className="font-medium text-on-surface">{pharma.workingHours}</span>
                          </p>
                        </div>

                        {/* Services Badges */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {pharma.deliveryAvailable && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-lg text-xs font-bold text-on-surface-variant border border-outline-variant/20">
                              <span className="material-symbols-outlined text-[14px] text-primary">local_shipping</span> Fast Delivery
                            </span>
                          )}
                          {pharma.vaccinationAvailable && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-lg text-xs font-bold text-on-surface-variant border border-outline-variant/20">
                              <span className="material-symbols-outlined text-[14px] text-primary">vaccines</span> Vaccinations
                            </span>
                          )}
                          {pharma.insuranceAccepted && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-lg text-xs font-bold text-on-surface-variant border border-outline-variant/20">
                              <span className="material-symbols-outlined text-[14px] text-primary">verified_user</span> Accepts Insurance
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="mt-auto flex flex-wrap gap-3 pt-4 border-t border-outline-variant/10">
                          <button className="flex-1 min-w-[140px] bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary-container shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                            View Details
                          </button>
                          <button className="flex-1 min-w-[140px] bg-surface-container-highest text-primary py-3 rounded-xl font-bold text-sm border border-primary/10 hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">directions</span>
                            Directions
                          </button>
                          <a href={`tel:${pharma.phone}`} className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center border border-green-200 hover:bg-green-100 transition-all shrink-0">
                            <span className="material-symbols-outlined">call</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
