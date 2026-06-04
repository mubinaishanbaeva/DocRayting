'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDoctors } from '@/app/actions';

function SurgeonsContent() {
  const router = useRouter();
  const [surgeons, setSurgeons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSpecialty, setFilterSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Load surgeons from database
  useEffect(() => {
    getDoctors()
      .then((data) => {
        // Filter only surgeons (specialties containing 'Surgery')
        const filtered = data.filter((doc) => 
          doc.specialty.toLowerCase().includes('surgery')
        ).map((doc) => ({
          ...doc,
          experience: doc.id === 4 ? 18 : doc.id === 5 ? 14 : 16,
          successRate: doc.id === 4 ? '99.2%' : doc.id === 5 ? '98.7%' : '97.9%',
          clinicName: "St. Mary's Advanced Surgical Suite",
          price: doc.id === 4 ? 250 : doc.id === 5 ? 220 : 190,
          biography: doc.id === 4 
            ? "Dr. Marcus Sterling is a world-class neurosurgeon specializing in complex spinal reconstructions and minimally invasive brain surgeries."
            : doc.id === 5 
            ? "Dr. Sophia Thorne is an acclaimed cardiothoracic surgeon, pioneer in robot-assisted heart bypasses and thoracic tumor resections."
            : "Dr. Kenji Sato is a leading orthopedic surgeon focused on joint replacements, advanced arthroscopies, and sports injury recovery.",
          education: doc.id === 4 ? "Harvard Medical School" : doc.id === 5 ? "Stanford University" : "Johns Hopkins University",
          proceduresCount: doc.id === 4 ? "1,200+" : doc.id === 5 ? "950+" : "1,100+"
        }));
        setSurgeons(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load surgeons", err);
        setLoading(false);
      });
  }, []);

  const filteredSurgeons = surgeons.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterSpecialty === 'All' || doc.specialty === filterSpecialty;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-background pb-xl">
      {/* Dynamic Header Hero */}
      <section className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-950 text-white py-xl px-margin-desktop relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent z-0 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-md">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-label-md font-semibold backdrop-blur-md border border-white/10">
            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"></span>
            DocRayting Premium Surgical Wing
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-200">
            Expert Surgical Solutions
          </h1>
          <p className="text-slate-300 font-body-lg text-body-lg max-w-2xl mx-auto">
            Access board-certified top-tier surgeons with unparalleled clinical outcomes. Providing world-class precision surgery and exceptional patient recovery systems.
          </p>

          {/* Quick Stats Bento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md max-w-5xl mx-auto pt-lg">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-md backdrop-blur-md">
              <div className="text-3xl font-extrabold text-cyan-300">99.2%</div>
              <div className="text-xs text-slate-400 font-semibold uppercase mt-xs tracking-wider">Success Rate</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-md backdrop-blur-md">
              <div className="text-3xl font-extrabold text-cyan-300">3,200+</div>
              <div className="text-xs text-slate-400 font-semibold uppercase mt-xs tracking-wider">Operations Done</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-md backdrop-blur-md">
              <div className="text-3xl font-extrabold text-cyan-300">15+ Yrs</div>
              <div className="text-xs text-slate-400 font-semibold uppercase mt-xs tracking-wider">Avg Experience</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-md backdrop-blur-md">
              <div className="text-3xl font-extrabold text-cyan-300">24/7</div>
              <div className="text-xs text-slate-400 font-semibold uppercase mt-xs tracking-wider">Trauma Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-margin-desktop mt-lg space-y-lg">
        
        {/* Controls Panel */}
        <div className="flex flex-col md:flex-row gap-md items-center justify-between bg-surface-container-lowest p-md rounded-2xl border border-outline-variant/30 shadow-md">
          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-lg pr-md py-sm bg-surface-container-low border border-transparent rounded-xl font-body-md focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest outline-none transition-all" 
              placeholder="Qidiruv (ism yoki mutaxassislik)..." 
              type="text"
            />
          </div>

          {/* Specialization Filter Buttons */}
          <div className="flex flex-wrap gap-xs w-full md:w-auto">
            {['All', 'Neurosurgery', 'Cardiothoracic Surgery', 'Orthopedic Surgery'].map((spec) => (
              <button
                key={spec}
                onClick={() => setFilterSpecialty(spec)}
                className={`px-md py-sm rounded-xl text-label-md font-bold transition-all ${
                  filterSpecialty === spec 
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/25' 
                    : 'bg-surface-container hover:bg-primary-container/20 text-on-surface-variant'
                }`}
              >
                {spec === 'All' ? 'Barcha jarrohlar' : spec}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-xl text-center">
            <span className="material-symbols-outlined animate-spin text-[48px] text-primary">progress_activity</span>
            <p className="font-label-md text-label-md text-on-surface-variant mt-sm">Jarrohlik ma'lumotlari yuklanmoqda...</p>
          </div>
        ) : (
          /* Premium Surgeons Grid */
          <div className="grid grid-cols-1 gap-lg">
            {filteredSurgeons.map((doc) => (
              <div 
                key={doc.id}
                className="bg-surface-container-lowest p-md md:p-lg rounded-3xl shadow-xl border border-outline-variant/20 hover:border-primary/20 transition-all duration-300 flex flex-col md:flex-row gap-lg items-stretch group"
              >
                {/* Photo & Details Left */}
                <div className="w-full md:w-72 shrink-0 relative rounded-2xl overflow-hidden bg-slate-900 shadow-lg">
                  <img 
                    src={doc.image} 
                    alt={doc.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 min-h-[250px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  
                  {/* Quality Badges */}
                  <div className="absolute bottom-md left-md right-md flex justify-between items-center text-white">
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-yellow-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-bold text-label-md">{doc.rating}</span>
                    </div>
                    <div className="bg-cyan-500/25 border border-cyan-400/30 backdrop-blur-md px-sm py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {doc.proceduresCount} Procedures
                    </div>
                  </div>
                </div>

                {/* Surgeon Info Middle */}
                <div className="flex-1 flex flex-col justify-between py-xs space-y-md">
                  <div>
                    <div className="flex justify-between items-start gap-md flex-wrap">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface group-hover:text-primary transition-colors">
                          {doc.name}, MD, PhD
                        </h2>
                        <p className="text-primary font-headline-md font-bold mt-1">
                          {doc.specialty} Specialist
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-outline font-semibold uppercase block mb-1">Muvaffaqiyat ko'rsatkichi</span>
                        <div className="bg-green-500/10 border border-green-500/20 text-green-700 font-extrabold px-md py-1 rounded-xl inline-block text-headline-sm">
                          {doc.successRate}
                        </div>
                      </div>
                    </div>

                    <p className="font-body-md text-on-surface-variant mt-md leading-relaxed text-slate-600">
                      {doc.biography}
                    </p>

                    {/* Bento Info Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm mt-lg">
                      <div className="bg-surface-container rounded-xl p-sm border border-surface-variant/20">
                        <span className="text-[10px] text-outline font-semibold uppercase block">Ta'lim / Muassasa</span>
                        <span className="font-label-md text-on-surface font-bold block truncate">{doc.education}</span>
                      </div>
                      <div className="bg-surface-container rounded-xl p-sm border border-surface-variant/20">
                        <span className="text-[10px] text-outline font-semibold uppercase block">Klinika</span>
                        <span className="font-label-md text-on-surface font-bold block truncate">{doc.clinicName}</span>
                      </div>
                      <div className="bg-surface-container rounded-xl p-sm border border-surface-variant/20">
                        <span className="text-[10px] text-outline font-semibold uppercase block">Tajriba</span>
                        <span className="font-label-md text-on-surface font-bold block truncate">{doc.experience} Years of Practice</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Timing Bottom */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-md border-t border-surface-variant/20 pt-md mt-md">
                    <div className="flex items-center gap-sm">
                      <span className="w-3.5 h-3.5 bg-green-500 rounded-full animate-ping"></span>
                      <div>
                        <span className="text-[10px] text-outline font-bold uppercase block">Navbatdagi qabul</span>
                        <span className="font-label-md text-on-surface font-bold">{doc.nextAvailable}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-sm w-full sm:w-auto">
                      <Link 
                        href={`/doctor-profile?doctorId=${doc.id}`}
                        className="flex-1 sm:flex-none text-center border-2 border-primary/20 text-primary font-bold px-lg py-md rounded-xl hover:bg-primary-container/10 active:scale-95 transition-all font-label-md"
                      >
                        Jarroh Profili
                      </Link>
                      <Link 
                        href={`/booking?doctorId=${doc.id}`}
                        className="flex-1 sm:flex-none text-center bg-primary text-on-primary font-bold px-lg py-md rounded-xl hover:bg-primary-container active:scale-95 transition-all shadow-lg shadow-primary/10 font-label-md"
                      >
                        Qabulga yozilish
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredSurgeons.length === 0 && (
              <div className="py-xl text-center bg-surface-container-lowest border border-dashed rounded-3xl border-outline-variant/50">
                <span className="material-symbols-outlined text-[48px] text-outline mb-sm">error</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">Hech qanday jarroh topilmadi</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Qidiruv yoki filtrlash parametrlarini o'zgartiring.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setFilterSpecialty('All'); }}
                  className="mt-md bg-primary text-on-primary px-lg py-sm rounded-xl font-bold font-label-md"
                >
                  Qayta yuklash
                </button>
              </div>
            )}
          </div>
        )}

        {/* Premium Department Info Section */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-lg border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-lg items-center justify-between">
            <div className="space-y-sm max-w-2xl">
              <h3 className="text-2xl font-bold text-cyan-300">Jarrohlik Xavfsizligi va Sifat Kafolati</h3>
              <p className="text-slate-300 leading-relaxed font-body-md">
                Barcha jarrohlarimiz xalqaro standartlar (JCI, ISO) asosida akkreditatsiyadan o'tgan bo'lib, eng zamonaviy robotlashtirilgan asbob-uskunalar yordamida operatsiyalarni amalga oshirishadi. DocRayting portalidagi har bir reyting va sharh 100% real operatsiya qilingan bemorlar tomonidan qoldirilgan.
              </p>
            </div>
            <Link 
              href="/find-doctors" 
              className="bg-white text-slate-900 font-bold px-lg py-md rounded-xl hover:bg-slate-100 transition-all font-label-md whitespace-nowrap"
            >
              Barcha shifokorlarni ko'rish
            </Link>
          </div>
        </section>

      </section>
    </main>
  );
}

export default function Surgeons() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-[48px] text-primary">progress_activity</span>
      </div>
    }>
      <SurgeonsContent />
    </Suspense>
  );
}
