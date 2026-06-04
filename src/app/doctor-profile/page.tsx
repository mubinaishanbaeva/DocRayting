'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDoctors } from '@/app/actions';

function DoctorProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Interactive booking state in the sidebar
  const [selectedDate, setSelectedDate] = useState('15'); // default Oct 15
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [messageOpen, setMessageOpen] = useState(false);

  // Load selected doctor from SQLite via actions
  useEffect(() => {
    const docId = searchParams.get('doctorId');
    getDoctors()
      .then((doctors) => {
        let selected = null;
        if (docId) {
          selected = doctors.find((d) => d.id === parseInt(docId));
        }
        // Fallback to the first doctor (Dr. Julian Vance) if none is selected
        if (!selected && doctors.length > 0) {
          selected = doctors[0];
        }
        
        if (selected) {
          // Augment with rich data from the mockup profile for Dr. Julian Thorne
          setDoctor({
            ...selected,
            title: selected.name.includes('MD') ? selected.name : `${selected.name}, MD`,
            consultantTitle: selected.specialty === 'Cardiology' ? 'Senior Consultant Cardiologist'
                            : selected.specialty === 'Dermatology' ? 'Chief Dermatological Consultant'
                            : selected.specialty === 'Pediatrics' ? 'Director of Pediatric Medicine'
                            : 'Senior Clinical Specialist',
            about: selected.specialty === 'Cardiology' 
                   ? "Dr. Julian is an internationally recognized expert in interventional cardiology with over 15 years of experience in managing complex heart conditions. He specializes in minimally invasive procedures and has pioneered several techniques in heart valve replacement. His patient-centric approach focuses on precision medicine and long-term wellness."
                   : selected.specialty === 'Dermatology'
                   ? "Dr. Elena Rodriguez is a board-certified dermatologist specializing in advanced medical dermatology and cosmetic skin health. With a deep focus on oncology and skin-cancer screening, she leverages high-definition dermoscopy and minimally invasive clinical laser therapies to secure the best patient outcomes."
                   : "Dr. Sarah Smith is a highly acclaimed specialist in childhood wellness, pediatric acute care, and allergy sciences. Her clinical focus covers childhood developmental milestones and complex family medicine, emphasizing a warm and highly compassionate environment that puts children at ease.",
            education: selected.specialty === 'Cardiology' 
                      ? [
                          { school: "Harvard Medical School", degree: "Fellowship in Interventional Cardiology" },
                          { school: "Johns Hopkins University", degree: "MD, Cardiovascular Medicine" }
                        ]
                      : selected.specialty === 'Dermatology'
                      ? [
                          { school: "Stanford University School of Medicine", degree: "Residency in Dermatology" },
                          { school: "Yale School of Medicine", degree: "MD, Dermatology & General Practice" }
                        ]
                      : [
                          { school: "Columbia University Medical Center", degree: "Fellowship in Pediatric Medicine" },
                          { school: "Penn Medicine", degree: "MD, Pediatrics & Adolescent Health" }
                        ],
            specializations: selected.specialty === 'Cardiology' 
                             ? [
                                 { name: "Coronary Interventions", success: "98%" },
                                 { name: "Valve Treatments", success: "95%" }
                               ]
                             : selected.specialty === 'Dermatology'
                             ? [
                                 { name: "Melanoma Screening", success: "99%" },
                                 { name: "Laser Resurfacing", success: "97%" }
                               ]
                             : [
                                 { name: "Allergic Diagnostics", success: "96%" },
                                 { name: "Developmental Assessment", success: "98%" }
                               ]
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load doctor profile", err);
        setLoading(false);
      });
  }, [searchParams]);

  const handleQuickBook = () => {
    if (!doctor) return;
    // Format a mock date based on selection (e.g. October 15, 2026)
    const formattedDate = `2026-10-${selectedDate.padStart(2, '0')}`;
    // Route to booking page with pre-populated search queries!
    router.push(`/booking?doctorId=${doctor.id}&date=${formattedDate}&time=${encodeURIComponent(selectedTime)}`);
  };

  const handleMessageDoctor = () => {
    setMessageOpen(true);
    setTimeout(() => {
      setMessageOpen(false);
    }, 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-[48px] text-primary">progress_activity</span>
          <p className="font-label-md text-label-md text-on-surface-variant mt-sm">Loading profile workspace...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-background">
        <div className="text-center py-xl">
          <span className="material-symbols-outlined text-[48px] text-error mb-sm">error</span>
          <p className="font-headline-md text-headline-md text-on-surface">Doctor profile not found</p>
          <Link href="/find-doctors" className="mt-md bg-primary text-on-primary px-md py-sm rounded-lg inline-block font-label-md">
            Go to Search
          </Link>
        </div>
      </div>
    );
  }

  const timeSlots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];

  return (
    <main className="max-w-7xl mx-auto px-margin-desktop py-lg grid grid-cols-1 lg:grid-cols-12 gap-lg min-h-screen">
      {/* Profile Header Card */}
      <header className="lg:col-span-8 flex flex-col md:flex-row gap-md items-start md:items-center bg-surface-container-lowest p-md rounded-xl shadow-sm border border-surface-variant/20">
        <div className="relative shrink-0">
          <img 
            alt={doctor.name} 
            className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover shadow-md border border-outline-variant/30" 
            src={doctor.image} 
          />
          <div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary px-sm py-xs rounded-full text-label-sm font-label-sm flex items-center gap-xs shadow-lg select-none">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            Highly Rated
          </div>
        </div>
        <div className="flex-1 space-y-xs">
          <div className="flex items-center gap-sm flex-wrap">
            <h1 className="font-headline-lg text-headline-lg text-on-surface">{doctor.title}</h1>
            <div className="flex items-center gap-xs text-tertiary">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="font-bold font-label-md text-label-md">{doctor.rating}</span>
              <span className="text-on-surface-variant font-normal font-label-sm text-label-sm">(1,240 Reviews)</span>
            </div>
          </div>
          <p className="font-headline-md text-headline-md text-primary font-medium">{doctor.consultantTitle}</p>
          <div className="flex flex-wrap gap-sm pt-xs">
            <span className="bg-surface-container-low px-sm py-xs rounded-full font-label-sm text-label-sm text-on-surface-variant border border-surface-variant/10">
              {doctor.specialty} Specialist
            </span>
            <span className="bg-surface-container-low px-sm py-xs rounded-full font-label-sm text-label-sm text-on-surface-variant border border-surface-variant/10">
              Premium Service
            </span>
            <span className="bg-surface-container-low px-sm py-xs rounded-full font-label-sm text-label-sm text-on-surface-variant border border-surface-variant/10">
              15+ Years Exp.
            </span>
          </div>
        </div>
      </header>

      {/* Main Details Area */}
      <div className="lg:col-span-8 space-y-lg">
        {/* About Section */}
        <section className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-surface-variant/20">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">info</span>
            About
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            {doctor.about}
          </p>
        </section>

        {/* Education & Success Rates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Education Bento */}
          <section className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-surface-variant/20 flex flex-col justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">school</span>
                Education
              </h3>
              <ul className="space-y-md">
                {doctor.education.map((edu: any, i: number) => (
                  <li key={i} className="flex gap-md">
                    <div className={`w-1 ${i === 0 ? 'bg-primary-container' : 'bg-outline-variant'} rounded-full`}></div>
                    <div>
                      <p className="font-label-md text-label-md font-bold text-on-surface">{edu.school}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{edu.degree}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Success Specialty Bento */}
          <section className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-surface-variant/20 flex flex-col justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Specialization
              </h3>
              <div className="flex flex-col gap-sm">
                {doctor.specializations.map((spec: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-xs">
                      <span className="font-label-md text-label-md text-on-surface">{spec.name}</span>
                      <span className="text-primary font-bold">{spec.success} Success</span>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: spec.success }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Location Section */}
        <section className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-surface-variant/20">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">location_on</span>
              Clinic Location
            </h3>
            <p className="font-label-md text-label-md text-primary font-bold">St. Mary’s Advanced Heart Center</p>
          </div>
          {/* Map Image container */}
          <div className="w-full h-64 rounded-lg bg-surface-container overflow-hidden relative shadow-inner border border-outline-variant/30">
            <img 
              alt="Map Location" 
              className="w-full h-full object-cover grayscale opacity-50" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgefnpUzlP1zrQoAc7uI3Q46PHMKHOch3qQQv91CtbwUJasy7CRL3omosgtmOlTeF0jMIcNXd9bQoBS1QU-qWscufJ8Xn_mzY4VSDdyffO64yReY8rb8oMSJOJ7KfTPLR8-k7_-BS1YPexWWeI2I-0xOI63LwPMSoe9nZgRIbiY2aGCepj1Q1Lr8hchMSSEIY01-5kWZKWwG_A7maMatbZewYZoM7Zd8_nrWDOv9_sV2PvPQrkKJ5QmPkQ5d2RaBOOYK8GHArOBkg" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary p-sm rounded-full shadow-lg animate-pulse">
                <div className="bg-white w-4 h-4 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="mt-md flex flex-col md:flex-row gap-md justify-between items-start">
            <div className="space-y-xs">
              <p className="font-body-md text-body-md text-on-surface font-semibold">742 Evergreen Terrace, Suite 500</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Boston, MA 02108</p>
            </div>
            <div className="flex gap-sm">
              <button 
                onClick={handleMessageDoctor}
                className="px-md py-sm rounded-xl bg-surface-container text-primary font-bold font-label-md text-label-md flex items-center gap-xs hover:bg-primary-container/20 transition-colors scale-active"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
                Call Clinic
              </button>
              <a 
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="px-md py-sm rounded-xl bg-primary text-on-primary font-bold font-label-md text-label-md flex items-center gap-xs shadow-md hover:bg-primary-container transition-all scale-active"
              >
                <span className="material-symbols-outlined text-[20px]">directions</span>
                Get Directions
              </a>
            </div>
          </div>
        </section>

        {/* Patient Reviews */}
        <section className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-surface-variant/20">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-lg gap-md">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">rate_review</span>
                Patient Reviews
              </h3>
              <div className="flex items-center gap-md mt-sm">
                <span className="font-display-lg text-display-lg text-on-surface">{doctor.rating}</span>
                <div className="space-y-xs">
                  <div className="flex text-tertiary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Based on 1,240 reviews</p>
                </div>
              </div>
            </div>
            <div className="flex-1 max-w-xs space-y-xs">
              <div className="flex items-center gap-sm text-label-sm font-label-sm">
                <span className="w-4">5</span>
                <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[90%]"></div>
                </div>
              </div>
              <div className="flex items-center gap-sm text-label-sm font-label-sm">
                <span className="w-4">4</span>
                <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[8%]"></div>
                </div>
              </div>
              <div className="flex items-center gap-sm text-label-sm font-label-sm">
                <span className="w-4">3</span>
                <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[2%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-md divide-y divide-surface-variant/20">
            <div className="pt-md pb-md">
              <div className="flex justify-between items-start mb-sm">
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center text-on-primary-fixed font-bold shadow-sm">SM</div>
                  <div>
                    <p className="font-label-md text-label-md font-bold text-on-surface">Sarah Mitchell</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">2 weeks ago</p>
                  </div>
                </div>
                <div className="flex text-tertiary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant italic">
                "{doctor.name} is incredibly thorough. He took the time to explain my procedure in detail and made me feel completely at ease. The nursing staff at his clinic is also top-notch."
              </p>
            </div>
            <div className="pt-md pb-md">
              <div className="flex justify-between items-start mb-sm">
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed-dim flex items-center justify-center text-on-secondary-fixed font-bold shadow-sm">RJ</div>
                  <div>
                    <p className="font-label-md text-label-md font-bold text-on-surface">Robert Jenkins</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">1 month ago</p>
                  </div>
                </div>
                <div className="flex text-tertiary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant italic">
                "Highly professional. The online booking system was seamless and the appointment started right on time. Outstanding care."
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Quick Book Sidebar */}
      <aside className="lg:col-span-4 space-y-md">
        <div className="sticky top-24 bg-surface-container-lowest p-md rounded-xl shadow-lg border border-primary/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Quick Book</h3>
              <div className="bg-secondary-container/30 text-on-secondary-container px-sm py-xs rounded-full font-label-sm text-label-sm font-semibold select-none">
                Next: Tomorrow
              </div>
            </div>

            {/* Micro Calendar Mockup */}
            <div className="mb-md">
              <div className="flex justify-between items-center mb-sm px-xs">
                <p className="font-label-md text-label-md font-bold text-on-surface">October 2026</p>
                <div className="flex gap-xs">
                  <span className="material-symbols-outlined p-xs hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer select-none">chevron_left</span>
                  <span className="material-symbols-outlined p-xs hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer select-none">chevron_right</span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-xs text-center">
                <span className="text-[10px] font-bold text-outline uppercase select-none">M</span>
                <span className="text-[10px] font-bold text-outline uppercase select-none">T</span>
                <span className="text-[10px] font-bold text-outline uppercase select-none">W</span>
                <span className="text-[10px] font-bold text-outline uppercase select-none">T</span>
                <span className="text-[10px] font-bold text-outline uppercase select-none">F</span>
                <span className="text-[10px] font-bold text-outline uppercase select-none">S</span>
                <span className="text-[10px] font-bold text-outline uppercase select-none">S</span>
                
                {/* Days array */}
                {['12', '13', '14', '15', '16', '17', '18'].map((day) => (
                  <button 
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`p-xs text-label-sm rounded-full flex items-center justify-center font-bold transition-all ${
                      selectedDate === day 
                        ? 'bg-primary text-on-primary shadow-sm' 
                        : 'text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Selector */}
            <div className="space-y-sm mb-lg">
              <p className="font-label-md text-label-md font-bold text-on-surface">Available Times (Oct {selectedDate})</p>
              <div className="grid grid-cols-3 gap-xs">
                {timeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-xs rounded-lg text-label-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-primary text-on-primary font-bold shadow-sm' 
                          : 'bg-surface-container text-on-surface hover:bg-primary-container/20 hover:text-primary'
                      }`}
                    >
                      {time.replace(':00', '').replace(' AM', 'A').replace(' PM', 'P')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-sm">
            {messageOpen && (
              <div className="bg-primary/10 text-primary p-sm rounded-lg text-body-sm text-center mb-xs animate-pulse">
                📨 Contact request sent! St. Mary's Clinic will notify you shortly.
              </div>
            )}
            <button 
              onClick={handleQuickBook}
              className="w-full py-md bg-primary text-on-primary font-bold font-label-md text-label-md rounded-xl shadow-lg hover:shadow-xl transition-all scale-active"
            >
              Confirm Appointment
            </button>
            <button 
              onClick={handleMessageDoctor}
              className="w-full py-md border border-outline-variant text-on-surface font-bold font-label-md text-label-md rounded-xl flex items-center justify-center gap-xs hover:bg-surface-container transition-colors scale-active"
            >
              <span className="material-symbols-outlined text-[20px]">mail</span>
              Message Doctor
            </button>
          </div>
          <p className="mt-md text-[11px] text-center text-on-surface-variant font-medium">
            Insurance accepted: Medicare, Blue Cross, Aetna +12 more
          </p>
        </div>
      </aside>
    </main>
  );
}

export default function DoctorProfile() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[48px] text-primary">progress_activity</span>
      </div>
    }>
      <DoctorProfileContent />
    </Suspense>
  );
}
