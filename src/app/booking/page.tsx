'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getDoctors, getBookedSlots, bookAppointment } from '@/app/actions';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All Specialties');
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  
  // Selected Doctor
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  
  // Steps and AI
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [symptomInput, setSymptomInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-10-23'); // Default date
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const allTimeSlots = ['09:00 AM', '10:00 AM', '10:30 AM', '11:15 AM', '01:45 PM', '03:30 PM', '04:00 PM', '05:30 PM'];

  // Load doctors from SQLite database
  useEffect(() => {
    getDoctors()
      .then((data) => {
        setDoctors(data);
        
        // Parse search params for pre-selected doctor
        const docIdParam = searchParams.get('doctorId');
        const timeParam = searchParams.get('time');
        const dateParam = searchParams.get('date');

        let defaultDoc = null;
        if (docIdParam) {
          defaultDoc = data.find((d) => d.id === parseInt(docIdParam));
        }

        if (!defaultDoc && data.length > 0) {
          defaultDoc = data[1] || data[0];
        }

        if (defaultDoc) {
          setSelectedDoctor(defaultDoc);
        }

        if (dateParam) {
          setSelectedDate(dateParam);
        }

        if (timeParam) {
          setSelectedTime(decodeURIComponent(timeParam));
          // If we already have doctor and time/date preselected, jump directly to step 2 or 3!
          setBookingStep(1); // Keep on personal details first, then let them advance easily.
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load doctors", err);
        setLoading(false);
      });
  }, [searchParams]);

  // Load busy slots dynamically when selected doctor or date changes
  useEffect(() => {
    if (selectedDoctor) {
      getBookedSlots(selectedDoctor.id, selectedDate)
        .then((busySlots) => {
          setBookedTimes(busySlots);
        })
        .catch(err => console.error("Error fetching booked slots", err));
    }
  }, [selectedDoctor, selectedDate]);

  // Smart Symptom Matching AI
  const handleSmartBooking = () => {
    if (!symptomInput.trim() || doctors.length === 0) return;
    
    setIsThinking(true);
    setErrorMsg('');
    
    setTimeout(() => {
      const input = symptomInput.toLowerCase();
      let matchedSpecialty = 'General Practice';
      
      if (input.includes('bosh') || input.includes('asab') || input.includes('uxla') || input.includes('migren') || input.includes('nerv')) {
        matchedSpecialty = 'Neurology';
      } else if (input.includes('yurak') || input.includes('nafas') || input.includes('bosim') || input.includes('kardio')) {
        matchedSpecialty = 'Cardiology';
      } else if (input.includes('teri') || input.includes('toshma') || input.includes('allergiya') || input.includes('qichish')) {
        matchedSpecialty = 'Dermatology';
      } else if (input.includes('bola') || input.includes('chaqaloq') || input.includes('emlash')) {
        matchedSpecialty = 'Pediatrics';
      }

      setSpecialty(matchedSpecialty);
      
      const suitableDoctor = doctors.find(d => d.specialty.toLowerCase() === matchedSpecialty.toLowerCase()) || doctors[0];
      if (suitableDoctor) {
        setSelectedDoctor(suitableDoctor);
        // Automatically scroll down and move to the booking flow
        setBookingStep(1);
        setTimeout(() => {
          document.getElementById('booking-flow-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        setErrorMsg("Hech qanday mutaxassis topilmadi, iltimos ro'yxatdan tanlang.");
      }
      
      setIsThinking(false);
    }, 1200);
  };

  // Confirm booking and write to database using Prisma server action
  const handleBookingConfirm = async () => {
    if (!selectedDoctor || !firstName || !lastName || !phone || !selectedTime) {
      setErrorMsg("Iltimos, barcha shaxsiy ma'lumotlarni to'ldiring va vaqtni belgilang.");
      return;
    }
    
    setErrorMsg('');
    try {
      await bookAppointment({
        doctorId: selectedDoctor.id,
        patientName: `${firstName} ${lastName}`,
        patientPhone: phone,
        date: selectedDate,
        time: selectedTime
      });
      setBookingConfirmed(true);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (e: any) {
      setErrorMsg(e.message || "Ushbu vaqt band bo'lishi mumkin. Boshqa vaqtni tanlang.");
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = specialty === 'All Specialties' || doc.specialty === specialty;
    const matchAvailable = !availableTodayOnly || doc.availableToday;
    return matchSearch && matchSpecialty && matchAvailable;
  });

  const uniqueSpecialties = ['All Specialties', ...Array.from(new Set(doctors.map(d => d.specialty)))];

  if (bookingConfirmed) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-background">
        <div className="text-center animate-in zoom-in duration-500 max-w-md p-md bg-white rounded-xl shadow-lg border border-outline-variant/30">
          <div className="w-20 h-20 bg-secondary-container/30 text-secondary rounded-full flex items-center justify-center mx-auto mb-md">
            <span className="material-symbols-outlined text-[48px]">check_circle</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Booking Confirmed!</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-md">
            Your appointment with <strong className="text-primary">{selectedDoctor?.name}</strong> has been successfully booked.
          </p>
          <div className="bg-surface-container p-sm rounded-lg text-body-sm text-outline border border-surface-variant/20">
            📅 Date: {selectedDate} <br />
            ⏰ Time: {selectedTime}
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-lg">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-margin-desktop py-lg space-y-lg min-h-screen">
      {/* Smart Booking Banner (Mockup style but premium React states) */}
      <div className="bg-gradient-to-r from-primary-container/20 via-surface-container-low to-secondary-container/20 rounded-2xl p-md md:p-lg border border-primary/10 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <span className="material-symbols-outlined text-[140px]">auto_awesome</span>
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-xs py-xs px-sm bg-primary-container text-on-primary-container rounded-full font-label-sm text-label-sm mb-sm font-semibold select-none shadow-sm">
            <span className="material-symbols-outlined text-[16px] animate-pulse">auto_awesome</span>
            Smart Booking AI Assistant
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
            Shifokor tanlashda qiynalyapsizmi?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-md max-w-2xl leading-relaxed">
            O'zingizni qanday his qilayotganingizni yoki qanday alomatlar borligini pastga yozing. Bizning intellektual tizimimiz sizga ixtisoslashgan shifokorni avtomatlashtirilgan tarzda moslashtiradi.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-sm">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">psychiatry</span>
              <input 
                type="text" 
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="Masalan: bosh og'rig'i, isitma, uyqusizlik..." 
                className="w-full pl-lg pr-md py-md rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary/20 bg-surface-container-lowest outline-none font-body-md shadow-sm transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleSmartBooking()}
              />
            </div>
            <button 
              onClick={handleSmartBooking}
              disabled={isThinking || !symptomInput.trim()}
              className="bg-primary text-on-primary px-lg py-md rounded-xl font-bold font-label-md text-label-md shadow-md hover:bg-primary-container active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center min-w-[160px]"
            >
              {isThinking ? (
                <>
                  <span className="material-symbols-outlined animate-spin mr-2 text-[20px]">progress_activity</span>
                  Izlanmoqda...
                </>
              ) : (
                'Mutaxassisni topish'
              )}
            </button>
          </div>
          {errorMsg && <p className="text-error font-body-sm text-body-sm mt-sm font-semibold">{errorMsg}</p>}
        </div>
      </div>

      <main className="flex flex-col md:flex-row gap-lg" id="booking-flow-section">
        {/* Sidebar Selector */}
        <aside className="w-full md:w-[300px] shrink-0">
          <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/30 sticky top-24 space-y-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">Select Doctor</h2>
            
            <div className="space-y-sm">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Search by Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="E.g. Dr. Rodriguez..." 
                    className="w-full pl-lg pr-sm py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 bg-surface-container-low outline-none font-body-sm text-body-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Specialty</label>
                <select 
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full p-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 bg-white outline-none font-body-sm text-body-sm cursor-pointer"
                >
                  {uniqueSpecialties.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-sm cursor-pointer group py-xs select-none">
                  <input 
                    type="checkbox" 
                    checked={availableTodayOnly}
                    onChange={(e) => setAvailableTodayOnly(e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary cursor-pointer"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Available Today</span>
                </label>
              </div>
            </div>

            <button 
              onClick={() => {setSearch(''); setSpecialty('All Specialties'); setAvailableTodayOnly(false);}}
              className="w-full bg-surface-container hover:bg-surface-container-high text-primary font-bold font-label-md text-label-md py-sm rounded-lg transition-colors scale-active"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Booking & Calendar Wizard */}
        <section className="flex-grow space-y-md">
          {/* Doctor Grid Selection */}
          <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/30">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Specialists List</h3>
            {loading ? (
              <div className="py-lg text-center">
                <span className="material-symbols-outlined animate-spin text-[32px] text-primary">progress_activity</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-sm">
                {filteredDoctors.map(doc => (
                  <div 
                    key={doc.id} 
                    onClick={() => { setSelectedDoctor(doc); setBookingStep(1); }}
                    className={`p-sm rounded-xl border-2 transition-all cursor-pointer flex gap-sm items-center ${
                      selectedDoctor?.id === doc.id 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-outline-variant/20 hover:border-primary/20 bg-surface-container-low/20'
                    }`}
                  >
                    <img 
                      alt={doc.name} 
                      className="w-16 h-16 rounded-lg object-cover border border-outline-variant/20 bg-surface-dim" 
                      src={doc.image} 
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <h4 className="font-label-md text-label-md font-bold text-on-surface">{doc.name}</h4>
                        <div className="flex items-center text-tertiary">
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="font-label-sm text-label-sm font-bold ml-xs">{doc.rating}</span>
                        </div>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{doc.specialty}</p>
                      <p className="font-label-sm text-[10px] text-outline mt-xs">
                        {doc.availableToday ? '✅ Available Today' : `📅 Next: ${doc.nextAvailable}`}
                      </p>
                    </div>
                  </div>
                ))}
                {filteredDoctors.length === 0 && (
                  <p className="text-on-surface-variant text-center font-body-sm py-md">Shifokorlar topilmadi.</p>
                )}
              </div>
            )}
          </div>

          {/* Form Wizard Steps */}
          {selectedDoctor && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              {/* Header Tracker */}
              <div className="p-md bg-surface-container-low border-b border-surface-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shadow-sm">{bookingStep}</div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Book with {selectedDoctor.name}</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {bookingStep === 1 && 'Step 1 of 3: Enter Personal Details'}
                      {bookingStep === 2 && 'Step 2 of 3: Choose Slot & Calendar'}
                      {bookingStep === 3 && 'Step 3 of 3: Confirmation Summary'}
                    </p>
                  </div>
                </div>
                
                {/* Step Dots */}
                <div className="flex gap-xs">
                  <span className={`w-8 h-1.5 rounded-full transition-all ${bookingStep >= 1 ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                  <span className={`w-8 h-1.5 rounded-full transition-all ${bookingStep >= 2 ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                  <span className={`w-8 h-1.5 rounded-full transition-all ${bookingStep >= 3 ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                </div>
              </div>

              {/* Form Workspace */}
              <div className="p-md">
                {/* Step 1: Personal Info */}
                {bookingStep === 1 && (
                  <div className="space-y-md animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">First Name</label>
                        <input 
                          required
                          value={firstName} 
                          onChange={e => setFirstName(e.target.value)} 
                          className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 bg-surface-container-low outline-none font-body-sm text-body-sm" 
                          placeholder="E.g. John" 
                          type="text" 
                        />
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Last Name</label>
                        <input 
                          required
                          value={lastName} 
                          onChange={e => setLastName(e.target.value)} 
                          className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 bg-surface-container-low outline-none font-body-sm text-body-sm" 
                          placeholder="E.g. Doe" 
                          type="text" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Phone Number</label>
                        <input 
                          required
                          value={phone} 
                          onChange={e => setPhone(e.target.value)} 
                          className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 bg-surface-container-low outline-none font-body-sm text-body-sm" 
                          placeholder="+998 (90) 123-4567" 
                          type="tel" 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-md border-t border-outline-variant/10">
                      <button 
                        onClick={() => {
                          if (firstName && lastName && phone) {
                            setBookingStep(2);
                            setErrorMsg('');
                          } else {
                            setErrorMsg("Iltimos, ism, familiya va telefon raqamingizni to'ldiring.");
                          }
                        }}
                        className="bg-primary text-on-primary px-lg py-sm rounded-lg font-bold font-label-md text-label-md hover:bg-primary-container active:scale-95 transition-all shadow-sm"
                      >
                        Next: Select Time
                      </button>
                    </div>
                    {errorMsg && <p className="text-error font-body-sm text-body-sm mt-xs">{errorMsg}</p>}
                  </div>
                )}

                {/* Step 2: Date & Time Picker */}
                {bookingStep === 2 && (
                  <div className="space-y-md animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-md items-start">
                      {/* Interactive Calendar widget */}
                      <div className="bg-surface-container-low rounded-xl p-md border border-outline-variant/20">
                        <div className="flex justify-between items-center mb-sm px-xs">
                          <span className="font-label-md text-label-md text-on-surface font-bold">Select Date (October 2026)</span>
                        </div>
                        <div className="grid grid-cols-7 gap-xs text-center mb-xs font-bold text-[10px] text-outline uppercase select-none">
                          <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                        </div>
                        <div className="grid grid-cols-7 gap-xs text-center">
                          {['20', '21', '22', '23', '24', '25', '26'].map((day) => {
                            const dateStr = `2026-10-${day}`;
                            const isSelected = selectedDate === dateStr;
                            return (
                              <button 
                                key={day}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`py-sm rounded-full font-bold text-body-sm transition-all ${
                                  isSelected 
                                    ? 'bg-primary text-on-primary shadow-sm' 
                                    : 'text-on-surface hover:bg-surface-container-high'
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time slots with BUSY flags loaded from SQLite */}
                      <div className="space-y-sm">
                        <label className="block font-label-md text-label-md text-on-surface-variant font-bold text-center lg:text-left">
                          Available Time Slots ({selectedDate})
                        </label>
                        <div className="grid grid-cols-2 gap-sm">
                          {allTimeSlots.map(time => {
                            const isBooked = bookedTimes.includes(time);
                            const isSelected = selectedTime === time;
                            return (
                              <button 
                                key={time}
                                disabled={isBooked}
                                onClick={() => setSelectedTime(time)}
                                className={`py-sm border-2 rounded-xl font-label-md text-label-md transition-all relative overflow-hidden ${
                                  isBooked 
                                    ? 'bg-surface-container text-outline border-transparent cursor-not-allowed' 
                                    : isSelected 
                                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm' 
                                      : 'border-outline-variant text-on-surface hover:border-primary hover:text-primary'
                                }`}
                              >
                                {time}
                                {isBooked && (
                                  <span className="absolute top-0 right-0 bg-error text-on-error text-[8px] px-sm py-[2px] rounded-bl font-bold">
                                    BUSY
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-md border-t border-outline-variant/10">
                      <button 
                        onClick={() => setBookingStep(1)} 
                        className="text-on-surface-variant font-bold hover:text-primary font-label-md"
                      >
                        Back
                      </button>
                      <button 
                        disabled={!selectedTime}
                        onClick={() => {
                          if (selectedTime) {
                            setBookingStep(3);
                            setErrorMsg('');
                          }
                        }}
                        className="bg-primary text-on-primary disabled:opacity-50 px-lg py-sm rounded-lg font-bold font-label-md text-label-md hover:bg-primary-container active:scale-95 transition-all shadow-sm"
                      >
                        Confirm Details
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Final confirmation */}
                {bookingStep === 3 && (
                  <div className="flex flex-col items-center space-y-md animate-in fade-in duration-300">
                    <div className="bg-primary/5 p-md rounded-xl flex items-center gap-md w-full max-w-lg border border-primary/10">
                      <span className="material-symbols-outlined text-primary text-[32px]">verified_user</span>
                      <div>
                        <p className="font-headline-sm text-headline-sm text-primary font-bold">Appointment Summary</p>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          {selectedDoctor.name} • {selectedDate} • {selectedTime}
                        </p>
                      </div>
                    </div>

                    <div className="w-full max-w-lg space-y-sm bg-surface-container-low p-md rounded-xl border border-surface-variant/20">
                      <div className="flex justify-between pb-sm border-b border-outline-variant/30 font-body-md">
                        <span className="text-on-surface-variant">Patient Full Name</span>
                        <span className="font-bold text-on-surface">{firstName} {lastName}</span>
                      </div>
                      <div className="flex justify-between pb-sm border-b border-outline-variant/30 font-body-md">
                        <span className="text-on-surface-variant">Contact Phone</span>
                        <span className="font-bold text-on-surface">{phone}</span>
                      </div>
                      <div className="flex justify-between pb-sm font-body-md">
                        <span className="text-on-surface-variant">Consultation Type</span>
                        <span className="font-bold text-secondary">Premium Precision Healthcare</span>
                      </div>
                    </div>

                    <div className="flex justify-between w-full max-w-lg pt-md">
                      <button 
                        onClick={() => setBookingStep(2)} 
                        className="text-on-surface-variant font-bold hover:text-primary font-label-md"
                      >
                        Back
                      </button>
                      <button 
                        onClick={handleBookingConfirm}
                        className="bg-primary text-on-primary py-md px-lg rounded-xl font-bold font-label-md text-label-md shadow-lg hover:bg-primary-container active:scale-95 transition-all"
                      >
                        Confirm Appointment Booking
                      </button>
                    </div>
                    {errorMsg && <p className="text-error font-body-sm text-body-sm mt-xs">{errorMsg}</p>}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function Booking() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-[48px] text-primary">progress_activity</span>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
