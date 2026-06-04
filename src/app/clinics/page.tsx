'use client';

import { useState } from 'react';

export default function Clinics() {
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string[]>(['Neurology']);
  const [ratingFilter, setRatingFilter] = useState(4);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const clinicsData = [
    {
      id: 1,
      name: "St. Meridian Medical Center",
      location: "450 Park Avenue, Manhattan, NY",
      rating: 4.9,
      specialists: ["Dr. Sarah Chen (Cardiology)", "Dr. James Miller (Oncology)"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTV95zsMxiQqI9MCneUe9QyWwwfCEuel8CqAKd2YOqTEjAVP_JSNBBmhWgApdd5uriuNfiah8nmbvma79dO2s4tro1Ze_fJAEnPMmExEVzPeG7Yak1o2sHcb3Qqai85jJdxWN6rIDMnUVxk3IH1hZV5WEbTUuKMdWv7r1iy6Pft4RQdapenPk30MlwRt2AftKQ_lJkK_uEx728uT_FEC_bfpVWuUXREbEDcFZMG0-mCYV2WcZv1aPYAhkZXyp4QpkVWHFvS10uNuY",
      reviewsCount: 12,
      specialties: ["Cardiology", "Oncology"]
    },
    {
      id: 2,
      name: "Apex Neurology & Spine",
      location: "122 Lexington Circle, Brooklyn, NY",
      rating: 4.7,
      specialists: ["Dr. Elena Rodriguez (Spine)", "Dr. Kevin Wu (Radiology)"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-BOuieE5v9Tkrbkfu_xGtLk2s_bwzFtBUPrrvNc9nF5AzQyC3EzX1g80Wp1tP3rB_q0WjUJsj9Es5GhS_frNxyOofI8mqNK0bGTPZaowwiVX3kMjFeA3XUMEZV8JXe7aKuW5rorMJwnLt1pnaRcZ1sxafj0BAuWdmUhy4ULiNdKv4IFmRMRDC4OzaFR5kYiJgnjUhK3GD--w0gO8DQkAm2a0O-ONSflHcNappB469ddUgbcxnRTIznr7TQET6jRKmj5tUherMhEU",
      reviewsCount: 8,
      specialties: ["Neurology", "Radiology"]
    },
    {
      id: 3,
      name: "Bloom Pediatrics Group",
      location: "88 West Street, Soho, NY",
      rating: 4.8,
      specialists: ["Dr. Susan Hart (Pediatrics)", "Dr. Liam O'Neill (ENT)"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXOeRg7mtEP6ZYxWqsHCajn50zM7atiJGEKdUA5SE59e2Vlv3caWj6PEm-7ugfyiyiK3yZwxGlAmm6_qVmfmzqPFHInlDJdcOz2clRMice75KxvEuEG3T1RiQnZDixlWP4BHVhAUhQTFtoicLgSwudMC8QS85q-w1sSjRvtb_XH5g-2PBbwdgNXMHMubBPAK-IB6v7xJsG8pVtcRKQZ9jewuADmN9ukURlSUWqRGAvrdrOUzxY7Xj_WgrFiUzJiejSjhTal2ewpeQ",
      reviewsCount: 5,
      specialties: ["Pediatrics", "ENT"]
    },
    {
      id: 4,
      name: "Unity Health & Pharmacy",
      location: "312 Broadway, New York, NY",
      rating: 4.6,
      specialists: ["Dr. Robert Vance (Internal Medicine)", "Emily Rogers (Pharmacist)"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNqdj1vHECXFyDiFsqE5NL-5vEWgGORUqDtkTACRvceKK5n7PTIqkytHqBuzc_Lq5BVg-YS0GxtMUkKrnhTm2iRFFlPVB4_0bWHVNi5pjiyh65gN9iQymLbhXnketr1vC_RS6ZNKfRSGudFgJDIv5prGmOUvXumqMG2FIlAV5kSWWOPmjhzBiiq2C9YdxGXAbYCSp2qTPGTu-LRLzl7MrD-HTQgrsLzPktoF_z_zBsLNU00P5CvZZ6-XDB7RQml8DNXdam3JPqfts",
      reviewsCount: 20,
      specialties: ["General", "Pharmacy"]
    }
  ];

  const handleSpecialtyToggle = (spec: string) => {
    if (specialtyFilter.includes(spec)) {
      setSpecialtyFilter(specialtyFilter.filter(s => s !== spec));
    } else {
      setSpecialtyFilter([...specialtyFilter, spec]);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSpecialtyFilter([]);
    setRatingFilter(0);
  };

  const filteredClinics = clinicsData.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(search.toLowerCase()) || 
                          clinic.location.toLowerCase().includes(search.toLowerCase());
    const matchesRating = clinic.rating >= ratingFilter;
    const matchesSpecialties = specialtyFilter.length === 0 || 
                               clinic.specialties.some(s => specialtyFilter.includes(s));
    
    return matchesSearch && matchesRating && matchesSpecialties;
  });

  return (
    <main className="max-w-7xl mx-auto px-margin-desktop py-xl min-h-screen space-y-lg">
      {/* Search Header Section */}
      <section>
        <div className="max-w-3xl mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">Premium Healthcare Clinics</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Access top-rated medical facilities with specialized departments and world-class professionals.</p>
        </div>

        {/* Large Premium Search Bar */}
        <div className="relative bg-surface-container-lowest shadow-sm rounded-xl p-xs border border-outline-variant/30 flex items-center">
          <div className="flex-1 flex items-center px-md">
            <span className="material-symbols-outlined text-outline mr-sm">search</span>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 py-md font-body-md text-body-md text-on-surface outline-none" 
              placeholder="Search clinics by name, specialty, or location..." 
              type="text"
            />
          </div>
          <div className="h-10 w-[1px] bg-outline-variant/30 hidden md:block"></div>
          <div className="hidden md:flex items-center px-md gap-xs">
            <span className="material-symbols-outlined text-outline">location_on</span>
            <input className="w-40 bg-transparent border-none focus:ring-0 py-md font-body-md text-body-md text-on-surface outline-none" placeholder="New York, NY" type="text" />
          </div>
          <button className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-md text-label-md hover:bg-primary-container active:scale-95 transition-all">
            Search
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        {/* Filter Sidebar */}
        <aside className="md:col-span-3 space-y-lg">
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface">Filters</h2>
              <button onClick={handleResetFilters} className="text-primary font-label-sm text-label-sm hover:underline">Reset All</button>
            </div>

            {/* Specialties Checklist */}
            <div className="mb-lg">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md font-semibold">Specialties</h3>
              <div className="space-y-sm">
                {["Cardiology", "Neurology", "Pediatrics", "Oncology"].map((spec) => (
                  <label key={spec} className="flex items-center gap-sm cursor-pointer group select-none">
                    <input 
                      checked={specialtyFilter.includes(spec)}
                      onChange={() => handleSpecialtyToggle(spec)}
                      className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5 cursor-pointer" 
                      type="checkbox"
                    />
                    <span className={`font-body-sm text-body-sm transition-colors group-hover:text-primary ${
                      specialtyFilter.includes(spec) ? 'text-primary font-bold' : 'text-on-surface'
                    }`}>
                      {spec}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Rating Selector */}
            <div className="mb-lg">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md font-semibold">Min. Rating</h3>
              <div className="flex gap-xs">
                {[3, 4, 4.5].map((rate) => (
                  <button 
                    key={rate}
                    onClick={() => setRatingFilter(rate)}
                    className={`flex-1 py-sm rounded-lg border font-label-sm text-label-sm transition-all scale-active ${
                      ratingFilter === rate 
                        ? 'bg-primary text-on-primary border-transparent' 
                        : 'border-outline-variant/30 hover:bg-surface-container hover:text-primary'
                    }`}
                  >
                    {rate}+
                  </button>
                ))}
              </div>
            </div>

            {/* Accessibility Checkbox */}
            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md font-semibold">Accessibility</h3>
              <div className="space-y-sm">
                <label className="flex items-center gap-sm cursor-pointer group select-none">
                  <input className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5 cursor-pointer" type="checkbox" />
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Wheelchair Access</span>
                </label>
                <label className="flex items-center gap-sm cursor-pointer group select-none">
                  <input className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5 cursor-pointer" type="checkbox" />
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Emergency Unit (24/7)</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Explorer Area */}
        <div className="md:col-span-9 space-y-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-sm bg-surface-container-lowest p-sm rounded-xl border border-outline-variant/30 shadow-sm">
            <span className="font-body-md text-body-md text-on-surface-variant">
              Showing <strong>{filteredClinics.length}</strong> premium clinics in New York
            </span>
            <div className="flex items-center gap-sm">
              <span className="font-label-md text-label-md text-on-surface-variant">Sort by:</span>
              <select className="bg-transparent border-none font-label-md text-label-md text-primary font-bold focus:ring-0 cursor-pointer">
                <option>Highest Rated</option>
                <option>Distance</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            {filteredClinics.map((clinic) => (
              <article 
                key={clinic.id} 
                className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm card-hover transition-all flex flex-col justify-between"
              >
                <div className="h-56 relative overflow-hidden bg-surface-dim">
                  <img className="w-full h-full object-cover" src={clinic.image} alt={clinic.name} />
                  <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md px-sm py-xs rounded-full flex items-center gap-xs shadow-sm">
                    <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-md text-label-md text-on-surface font-bold">{clinic.rating}</span>
                  </div>
                </div>
                <div className="p-md flex flex-col flex-1 justify-between">
                  <div className="mb-md">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-xs font-bold leading-tight">{clinic.name}</h3>
                    <div className="flex items-center gap-xs text-on-surface-variant mb-md font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      <span>{clinic.location}</span>
                    </div>
                    
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block mb-sm">Key Specialists</span>
                    <div className="flex flex-wrap gap-xs">
                      {clinic.specialists.map((spec, i) => (
                        <span key={i} className="px-sm py-xs bg-surface-container-low text-primary rounded-full font-label-sm text-label-sm border border-surface-variant/10">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-md border-t border-outline-variant/10">
                    <div className="flex items-center -space-x-2 select-none">
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-fixed-dim"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary-fixed-dim"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-tertiary-fixed-dim"></div>
                      <span className="ml-4 font-label-sm text-label-sm text-on-surface-variant">+{clinic.reviewsCount} doctors</span>
                    </div>
                    <button 
                      onClick={() => alert(`${clinic.name} details are premium under subscription.`)}
                      className="bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all scale-active shadow-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filteredClinics.length === 0 && (
              <div className="col-span-full py-xl text-center">
                <span className="material-symbols-outlined text-[48px] text-outline mb-sm">error</span>
                <p className="font-headline-md text-headline-md text-on-surface">No clinics found matching criteria</p>
                <button onClick={handleResetFilters} className="mt-md bg-primary text-on-primary px-md py-sm rounded-lg font-label-md">
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
