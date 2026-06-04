'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  
  // Newsletter subscription
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery);
    if (locationQuery.trim()) params.set('location', locationQuery);
    router.push(`/find-doctors?${params.toString()}`);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  const categories = [
    { name: 'Cardiology', icon: 'cardiology', bg: 'bg-error-container/10', text: 'text-error' },
    { name: 'Pediatrics', icon: 'child_care', bg: 'bg-secondary-container/10', text: 'text-secondary' },
    { name: 'Surgery', icon: 'surgical', bg: 'bg-primary-container/10', text: 'text-primary', path: '/surgeons' },
    { name: 'Dermatology', icon: 'dermatology', bg: 'bg-tertiary-container/10', text: 'text-tertiary' },
    { name: 'Neurology', icon: 'psychology', bg: 'bg-primary-container/10', text: 'text-primary' },
    { name: 'Eye Care', icon: 'visibility', bg: 'bg-primary-container/10', text: 'text-primary' },
  ];

  const featuredDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Jenkins',
      specialty: 'Senior Cardiologist',
      location: 'City Medical Center, NY',
      rating: '4.9',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUNwDmMj--NWRHTUaHbsaGK4mTBnUdTvcrAX8MVrweroJqGxXH8BWC5CrC3dmZr2m1y0t4lnbW_5YnwTA_36x4FsC3kusxwY5_FRGO0fdcdAowdcOZhG94GDGZaC2igy0k7fVgm1IDs9yOk8NoRN40UJyDQPRkW2ElYTfq89fuLnZwVSwEtk2dNjmS0XNf_572_F-VQLKNejwi0BkmwtKrAMMpRLbFHvF2Bwmoxfj2Y5ud5DKkn4RMbZG8Lr_zbYLqLq5NSVGpX6Q'
    },
    {
      id: 3,
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrics Specialist',
      location: 'Kindred Children\'s Clinic, SF',
      rating: '5.0',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrUH55ta9DajSLOyp6F9IlAeERPIBTE2Sw1rA9Z4VoWQJvP_JDMEPqhUqSDPJMIbLpgHpenRsikEQraE1ymeyFZ8lyRm3tnBooLC8f65hbtyHZKYKJ7lCsEI0OfRVE6k6c9Ubo7tdTnAvH5X9uN_0ykc35tPK6MrTkTr2QiFoyXCWDVnyEPVAWYsWB-DwWMhlUe4_iRTd4Um2hKn3NKXSJlglzsz9yv2mbiqJzRxfCcMkup8BBZQkYP1wps6JoWibF7JughY5gZeI'
    },
    {
      id: 2,
      name: 'Dr. Elena Rodriguez',
      specialty: 'Neurology Expert',
      location: 'NeuroHealth Institute, CHI',
      rating: '4.8',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnV1fzm9IRdFs2tqYFr72ra_ZI7u7EttJWlBfbzhAgbyWtziHGsePu1NTJ9KQQRBMjxOlhB889AhtnR8cmF1L2t_Ufua41eukiwWa9n6uL7vk4tP6UR4EfWWZ6gEohwhtXZiab2KhJRVKA9GjE3pts7XodMsuVO9irwqGj2bfY_nFt6F0JDSKkwTFKMM-HZ2A908gRut-OHyeyalO0Y-XpCFW8W2DQAZJViChoKPl02tR3_WYJ9EzccFZcvnJUkCSaGlnXFIudSSM'
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-xl pb-xl overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-container/20 rounded-full blur-[100px] -mr-64 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-container/20 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-margin-desktop text-center">
          <span className="inline-block py-xs px-md bg-primary-container/30 text-primary rounded-full font-label-md text-label-md mb-md">
            Precision Healthcare Network
          </span>
          <h1 className="font-display-lg text-display-lg max-w-3xl mx-auto mb-md tracking-tight">
            Find the Right Doctor for You in <span className="text-primary">Minutes</span>
          </h1>
          <p className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl mx-auto mb-lg">
            Experience healthcare search built on trust and precision. Access verified specialists, real patient ratings, and instant booking at top-tier medical facilities.
          </p>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="bg-surface-container-lowest ambient-shadow rounded-xl p-xs md:p-base max-w-4xl mx-auto flex flex-col md:flex-row items-stretch gap-xs border border-surface-variant/20"
          >
            <div className="flex-1 flex items-center px-md border-b md:border-b-0 md:border-r border-outline-variant/30">
              <span className="material-symbols-outlined text-outline mr-sm">search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-md border-none focus:ring-0 text-on-surface font-body-md bg-transparent outline-none" 
                placeholder="Specialty, Doctor, or Illness" 
                type="text"
              />
            </div>
            <div className="flex-1 flex items-center px-md border-b md:border-b-0 md:border-r border-outline-variant/30">
              <span className="material-symbols-outlined text-outline mr-sm">location_on</span>
              <input 
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full py-md border-none focus:ring-0 text-on-surface font-body-md bg-transparent outline-none" 
                placeholder="Location" 
                type="text"
              />
            </div>
            <button 
              type="submit" 
              className="bg-primary text-on-primary font-bold px-lg py-md rounded-lg hover:bg-primary-container active:scale-95 transition-all font-label-md"
            >
              Search Now
            </button>
          </form>

          {/* Key Bulletpoints */}
          <div className="mt-lg flex flex-wrap justify-center gap-lg">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-label-md text-label-md text-on-surface-variant">100% Verified Reviews</span>
            </div>
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Instant Confirmation</span>
            </div>
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Free to Use</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-surface-container py-lg border-y border-surface-variant/10">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md text-center">
            <div>
              <div className="font-headline-lg text-headline-lg text-primary mb-xs">10k+</div>
              <div className="font-label-md text-label-md text-on-surface-variant">Verified Doctors</div>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-primary mb-xs">250+</div>
              <div className="font-label-md text-label-md text-on-surface-variant">Partner Clinics</div>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-primary mb-xs">1M+</div>
              <div className="font-label-md text-label-md text-on-surface-variant">Annual Bookings</div>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-primary mb-xs">4.9/5</div>
              <div className="font-label-md text-label-md text-on-surface-variant">Patient Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-xl">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <div className="flex justify-between items-end mb-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg mb-xs">Top Medical Categories</h2>
              <p className="text-on-surface-variant">Explore specialists across various medical fields</p>
            </div>
            <Link 
              href="/find-doctors" 
              className="text-primary font-bold flex items-center gap-xs hover:underline decoration-2 font-label-md"
            >
              View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-md">
            {categories.map((cat: any) => (
              <Link 
                key={cat.name}
                href={cat.path || `/find-doctors?specialty=${cat.name}`}
                className="bg-surface-container-lowest p-md rounded-xl text-center ambient-shadow card-hover cursor-pointer border border-surface-variant/10"
              >
                <div className={`w-12 h-12 ${cat.bg} ${cat.text} rounded-full flex items-center justify-center mx-auto mb-sm`}>
                  <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-xl bg-surface-container-low border-y border-surface-variant/10">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg mb-xs">Featured Specialists</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Highly rated professionals with consistent excellence in patient care and clinical outcomes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {featuredDoctors.map((doc) => (
              <div 
                key={doc.name} 
                className="bg-surface-container-lowest rounded-xl overflow-hidden ambient-shadow card-hover border border-surface-variant/20 flex flex-col justify-between"
              >
                <div className="h-48 relative overflow-hidden bg-surface-dim">
                  <img 
                    alt={doc.name} 
                    className="w-full h-full object-cover" 
                    src={doc.image}
                  />
                  <div className="absolute top-md right-md bg-surface-container-lowest/90 px-sm py-xs rounded-lg flex items-center gap-xs shadow-sm">
                    <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-sm text-label-sm font-bold">{doc.rating}</span>
                  </div>
                </div>
                <div className="p-md flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-headline-md mb-xs text-on-surface">{doc.name}</h3>
                    <p className="text-primary font-label-md text-label-md mb-md uppercase tracking-wider">{doc.specialty}</p>
                    <div className="flex items-center gap-sm mb-lg text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {doc.location}
                    </div>
                  </div>
                  <Link 
                    href={`/booking?doctorId=${doc.id}`}
                    className="w-full bg-primary text-on-primary py-sm rounded-lg font-bold text-center hover:bg-primary-container active:scale-95 transition-all font-label-md block"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotion Banners */}
      <section className="py-xl">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* Clinics Banner */}
            <div className="relative rounded-2xl overflow-hidden min-h-[300px] flex items-center group shadow-md border border-surface-variant/10">
              <img 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEMskwfAcJtc_aeMFODrB5CpQ5xkcNCcoZ0Q5lgKCSuKh3eG5ydsnQeqEakysbz1KrKpg5bESVQF9cU84izvXR6lzS7utblOW-6QCqntKkYHDFmrIqzpGTo8JFUOZdFKWKEtY4QlcMDats-0TkDewW8J6mZyQDhCxm_BhZ3aqxqvTvPhmwdsGqFWm9O_SdMGjH8RdVEUSJBKayrpG2M5XLSLBv0bzB0Q8HX3IKJg-cgqoI9EvbZr5XlELWYPh6xSE057MgScDoXoU"
                alt="Partner Clinics"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-on-background/95 to-transparent"></div>
              <div className="relative p-xl max-w-sm z-10">
                <h3 className="font-headline-lg text-headline-lg text-on-primary mb-sm">For Clinics</h3>
                <p className="text-surface-container mb-lg font-body-md opacity-90">Join our premium network to increase your patient reach and streamline appointments.</p>
                <Link 
                  href="/clinics" 
                  className="bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-bold hover:shadow-lg transition-all scale-active inline-block font-label-md"
                >
                  Register Clinic
                </Link>
              </div>
            </div>

            {/* Pharmacies Banner */}
            <div className="relative rounded-2xl overflow-hidden min-h-[300px] flex items-center group shadow-md border border-surface-variant/10">
              <img 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA40wwxJLydcBvZn7Qt9utfMgz7tC1aEC_UhyLpyEN5vdhe9LXvp1x6UyOf0p4KwECphCIZ2FscaxlSoMijMP9hyQufxrc_XhhJT3W_q_8At7wxUKriBFJDr-XYFpqlrahx1NFmsSOCpO_9Gct2rSD3pxiOf5e8gTeoa8bquQBYCxTsNswaXGRl2R8msVoUkmxfU47e9AF_Eht8UmTxiyrAerHQBJJ2e1YR7UmYj_cB58Wvswm_PDbB72PLKlV6k6GlXb4OVT1OD3Q"
                alt="Partner Pharmacies"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-on-background/95 to-transparent"></div>
              <div className="relative p-xl max-w-sm z-10">
                <h3 className="font-headline-lg text-headline-lg text-on-primary mb-sm">For Pharmacies</h3>
                <p className="text-surface-container mb-lg font-body-md opacity-90">Connect your pharmacy to our platform and fulfill digital prescriptions instantly.</p>
                <Link 
                  href="/pharmacies" 
                  className="bg-secondary-container text-on-secondary-container px-md py-sm rounded-lg font-bold hover:shadow-lg transition-all scale-active inline-block font-label-md"
                >
                  Join as Partner
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / Trust CTA */}
      <section className="bg-primary py-xl text-on-primary">
        <div className="max-w-7xl mx-auto px-margin-desktop text-center">
          <h2 className="font-headline-lg text-headline-lg mb-md">Ready to prioritize your health?</h2>
          <p className="font-body-lg text-body-lg mb-lg opacity-90">Get early access to health insights and doctor availability alerts.</p>
          
          {subscribed ? (
            <div className="bg-surface-container-lowest text-primary p-md rounded-xl inline-block max-w-md mx-auto animate-in zoom-in duration-300 font-bold">
              🎉 Thank you! You've successfully subscribed to our newsletter.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row justify-center gap-sm max-w-md mx-auto">
              <input 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-md py-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white flex-1 font-body-md" 
                placeholder="Enter your email" 
                type="email"
              />
              <button 
                type="submit" 
                className="bg-white text-primary font-bold px-lg py-sm rounded-lg hover:bg-surface-container-high transition-colors font-label-md scale-active"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
