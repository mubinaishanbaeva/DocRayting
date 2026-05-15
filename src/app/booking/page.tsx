'use client';

import { useState, useEffect } from 'react';
import { getDoctors, getBookedSlots, bookAppointment } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function Booking() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All Specialties');
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [symptomInput, setSymptomInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  
  const allTimeSlots = ['09:00 AM', '10:00 AM', '10:30 AM', '11:15 AM', '01:45 PM', '03:30 PM'];

  useEffect(() => {
    getDoctors().then(data => {
      setDoctors(data);
      if (data.length > 0) setSelectedDoctor(data[1] || data[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      getBookedSlots(selectedDoctor.id, 'Oct 23rd').then(setBookedTimes);
      setSelectedTime('');
    }
  }, [selectedDoctor]);

  const handleSmartBooking = () => {
    if (!symptomInput.trim() || doctors.length === 0) return;
    
    setIsThinking(true);
    
    setTimeout(() => {
      const input = symptomInput.toLowerCase();
      let matchedSpecialty = 'General Practice';
      
      if (input.includes('bosh') || input.includes('asab') || input.includes('uxla') || input.includes('migren')) {
        matchedSpecialty = 'Neurology';
      } else if (input.includes('yurak') || input.includes('nafas') || input.includes('bosim')) {
        matchedSpecialty = 'Cardiology';
      } else if (input.includes('teri') || input.includes('toshma') || input.includes('allergiya')) {
        matchedSpecialty = 'Dermatology';
      } else if (input.includes('bola') || input.includes('chaqaloq')) {
        matchedSpecialty = 'Pediatrics';
      }

      setSpecialty(matchedSpecialty);
      
      const suitableDoctor = doctors.find(d => d.specialty === matchedSpecialty) || doctors[0];
      if (suitableDoctor) {
        setSelectedDoctor(suitableDoctor);
        setBookingStep(2);
        
        setTimeout(() => {
          document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
      
      setIsThinking(false);
    }, 1500);
  };

  const handleBookingConfirm = async () => {
    if (!selectedDoctor || !firstName || !lastName || !phone || !selectedTime) {
      alert("Please fill all details and select a time.");
      return;
    }
    
    try {
      await bookAppointment({
        doctorId: selectedDoctor.id,
        patientName: `${firstName} ${lastName}`,
        patientPhone: phone,
        date: 'Oct 23rd',
        time: selectedTime
      });
      setBookingConfirmed(true);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (e: any) {
      alert(e.message || "Failed to book appointment");
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-ds-md">
            <span className="material-symbols-outlined text-[48px]">check_circle</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg mb-ds-sm">Booking Confirmed!</h2>
          <p className="font-body-lg text-body-lg text-secondary">Your appointment with {selectedDoctor?.name} has been scheduled.</p>
          <p className="font-body-sm text-body-sm text-outline mt-ds-md">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-ds-gutter py-ds-xxl">
      {/* Smart Booking Banner */}
      <div className="bg-gradient-to-r from-primary-container via-surface-container to-secondary-container rounded-2xl p-ds-xl mb-ds-xxl shadow-sm border border-outline-variant relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="material-symbols-outlined text-[120px]">psychiatry</span>
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="font-headline-md text-headline-md text-primary mb-ds-sm flex items-center gap-ds-xs">
            <span className="material-symbols-outlined animate-pulse text-tertiary">auto_awesome</span>
            Smart Booking AI
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-ds-lg">
            Qaysi shifokor kerakligini bilmaysizmi? Shunchaki o'zingizni qanday his qilayotganingizni yozing, tizim avtomatik ravishda to'g'ri mutaxassis va eng yaqin bo'sh vaqtni taklif qiladi.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-ds-md">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-ds-md top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                type="text" 
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="Masalan: Boshim og'riyapti, kechasi uxlolmadim..." 
                className="w-full pl-12 pr-ds-md py-ds-md rounded-xl border-2 border-primary/20 focus:border-primary bg-surface-container-lowest outline-none font-body-md shadow-sm transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleSmartBooking()}
              />
            </div>
            <button 
              onClick={handleSmartBooking}
              disabled={isThinking || !symptomInput.trim()}
              className="bg-primary text-on-primary px-ds-xl py-ds-md rounded-xl font-label-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center min-w-[160px]"
            >
              {isThinking ? (
                <>
                  <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                  Izlanmoqda...
                </>
              ) : (
                'Shifokor topish'
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="flex flex-col md:flex-row gap-ds-lg">
      {/* Sidebar Filter */}
      <aside className="w-full md:w-80 shrink-0">
        <div className="bg-surface-container-low p-ds-lg rounded-xl card-shadow border border-outline-variant/30 sticky top-24">
          <h2 className="font-headline-sm text-headline-sm mb-ds-lg text-on-surface">Filter Doctors</h2>
          
          <div className="space-y-ds-lg">
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-ds-sm">Search by Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-ds-sm top-1/2 -translate-y-1/2 text-outline">search</span>
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Doctor name..." 
                  className="w-full pl-10 pr-ds-sm py-ds-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright outline-none font-body-sm text-body-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-ds-sm">Specialty</label>
              <select 
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full p-ds-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright outline-none font-body-sm text-body-sm cursor-pointer appearance-none"
              >
                {uniqueSpecialties.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-ds-sm cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input 
                    type="checkbox" 
                    checked={availableTodayOnly}
                    onChange={(e) => setAvailableTodayOnly(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border-2 border-outline rounded bg-surface-bright checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                  />
                  <span className="material-symbols-outlined absolute text-on-primary text-[16px] opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                </div>
                <span className="font-body-md text-body-md text-on-surface select-none group-hover:text-primary transition-colors">Available Today</span>
              </label>
            </div>

            <button 
              onClick={() => {setSearch(''); setSpecialty('All Specialties'); setAvailableTodayOnly(false);}}
              className="w-full bg-secondary-container text-on-secondary-container font-label-md text-label-md py-ds-md rounded-lg hover:bg-outline-variant transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 space-y-ds-xl">
        <header className="flex justify-between items-end mb-ds-lg">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Available Specialists</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Find the right care and book your appointment in seconds.</p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="font-label-md text-label-md text-on-surface-variant">Showing {filteredDoctors.length} results</span>
          </div>
        </header>

        {/* Doctor List */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-ds-lg">
          {filteredDoctors.map(doc => (
            <div key={doc.id} className={`bg-surface-container-lowest rounded-xl p-ds-lg card-shadow border-2 transition-all cursor-pointer ${selectedDoctor?.id === doc.id ? 'border-primary-container' : 'border-transparent hover:border-outline-variant/30'}`} onClick={() => setSelectedDoctor(doc)}>
              <div className="flex flex-col sm:flex-row gap-ds-lg">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container shrink-0 border-2 border-primary-container/10">
                  <img alt={doc.name} className="w-full h-full object-cover" src={doc.image} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">{doc.name}</h3>
                      <span className="bg-surface-container px-ds-sm py-ds-xs rounded text-on-secondary-container font-label-sm text-label-sm">{doc.specialty}</span>
                    </div>
                    <div className="flex items-center gap-ds-xs">
                      <span className="material-symbols-outlined text-tertiary-container" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      <span className="font-label-md text-label-md text-on-surface">{doc.rating}</span>
                    </div>
                  </div>
                  <div className={`mt-ds-md flex items-center gap-ds-sm ${doc.availableToday ? 'text-primary' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-body-sm">{doc.availableToday ? 'schedule' : 'calendar_today'}</span>
                    <span className={`font-body-sm text-body-sm ${doc.availableToday ? 'font-semibold' : ''}`}>{doc.availableToday ? 'Available Today' : `Next: ${doc.nextAvailable}`}</span>
                  </div>
                  <button className={`mt-ds-lg w-full sm:w-auto px-ds-xl py-ds-sm rounded-lg font-label-md text-label-md transition-all ${selectedDoctor?.id === doc.id ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-secondary hover:bg-surface-container-high'}`}>
                    {selectedDoctor?.id === doc.id ? 'Selected' : 'Select Doctor'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredDoctors.length === 0 && (
            <div className="col-span-full py-ds-xxl text-center text-secondary font-body-lg">
              No doctors found matching your criteria.
            </div>
          )}
        </div>

        {/* Booking Section */}
        {selectedDoctor && (
        <div className="bg-surface-container-lowest rounded-xl card-shadow border-t-4 border-primary overflow-hidden scroll-mt-24" id="booking-form">
          <div className="p-ds-lg bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-ds-md">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">{bookingStep}</div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Book Appointment</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {bookingStep === 1 && 'Step 1 of 3: Personal Information'}
                  {bookingStep === 2 && 'Step 2 of 3: Select Date & Time'}
                  {bookingStep === 3 && 'Step 3 of 3: Confirm Booking'}
                </p>
              </div>
            </div>
            <div className="flex gap-ds-xs">
              <button onClick={() => setBookingStep(1)} className={`w-8 h-1 rounded-full ${bookingStep >= 1 ? 'bg-primary' : 'bg-outline-variant'}`}></button>
              <button onClick={() => setBookingStep(2)} className={`w-8 h-1 rounded-full ${bookingStep >= 2 ? 'bg-primary' : 'bg-outline-variant'}`}></button>
              <button onClick={() => setBookingStep(3)} className={`w-8 h-1 rounded-full ${bookingStep >= 3 ? 'bg-primary' : 'bg-outline-variant'}`}></button>
            </div>
          </div>
          <div className="p-ds-lg space-y-ds-xl">
            {bookingStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-ds-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-ds-xs">First Name</label>
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-ds-md py-ds-sm rounded-lg border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface-bright outline-none font-body-sm text-body-sm" placeholder="e.g. John" type="text" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-ds-xs">Last Name</label>
                  <input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-ds-md py-ds-sm rounded-lg border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface-bright outline-none font-body-sm text-body-sm" placeholder="e.g. Doe" type="text" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-ds-xs">Phone Number</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-ds-md py-ds-sm rounded-lg border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface-bright outline-none font-body-sm text-body-sm" placeholder="+1 (555) 000-0000" type="tel" />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button onClick={() => setBookingStep(2)} className="bg-primary text-white px-ds-xl py-ds-sm rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all">Next: Select Time</button>
                </div>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="space-y-ds-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-ds-xl">
                  {/* Calendar Placeholder */}
                  <div className="bg-surface-container rounded-xl p-ds-md">
                    <div className="flex justify-between items-center mb-ds-md px-ds-sm">
                      <span className="font-label-md text-label-md text-on-surface">October 2024</span>
                      <div className="flex gap-ds-sm">
                        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">chevron_left</span>
                        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">chevron_right</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-ds-xs text-center mb-ds-xs">
                      <span className="font-label-sm text-label-sm text-outline">M</span>
                      <span className="font-label-sm text-label-sm text-outline">T</span>
                      <span className="font-label-sm text-label-sm text-outline">W</span>
                      <span className="font-label-sm text-label-sm text-outline">T</span>
                      <span className="font-label-sm text-label-sm text-outline">F</span>
                      <span className="font-label-sm text-label-sm text-outline">S</span>
                      <span className="font-label-sm text-label-sm text-outline">S</span>
                    </div>
                    <div className="grid grid-cols-7 gap-ds-xs text-center">
                      {[21, 22].map(d => <button key={d} className="py-ds-sm rounded-lg hover:bg-outline-variant transition-colors text-body-sm">{d}</button>)}
                      <button className="py-ds-sm rounded-lg bg-primary text-on-primary font-bold text-body-sm">23</button>
                      {[24, 25].map(d => <button key={d} className="py-ds-sm rounded-lg hover:bg-outline-variant transition-colors text-body-sm">{d}</button>)}
                      <button className="py-ds-sm rounded-lg text-outline cursor-not-allowed text-body-sm">26</button>
                      <button className="py-ds-sm rounded-lg text-outline cursor-not-allowed text-body-sm">27</button>
                    </div>
                  </div>
                  {/* Time Slots */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-ds-md text-center lg:text-left">Available Time Slots</label>
                    <div className="grid grid-cols-2 gap-ds-sm">
                      {allTimeSlots.map(time => {
                        const isBooked = bookedTimes.includes(time);
                        const isSelected = selectedTime === time;
                        return (
                          <button 
                            key={time}
                            disabled={isBooked}
                            onClick={() => setSelectedTime(time)}
                            className={`py-ds-md border-2 rounded-xl font-label-md text-label-md transition-all ${
                              isBooked 
                                ? 'bg-surface-container text-outline border-transparent cursor-not-allowed relative overflow-hidden group' 
                                : isSelected 
                                  ? 'border-primary-container bg-primary-fixed text-on-primary-fixed shadow-sm' 
                                  : 'border-outline-variant text-on-surface hover:border-primary hover:text-primary'
                            }`}
                          >
                            {time}
                            {isBooked && <span className="absolute top-0 right-0 bg-error text-on-error text-[8px] px-ds-xs py-[2px] rounded-bl">BUSY</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setBookingStep(1)} className="text-secondary hover:underline font-label-md text-label-md">Back</button>
                  <button onClick={() => setBookingStep(3)} disabled={!selectedTime} className="bg-primary disabled:opacity-50 text-white px-ds-xl py-ds-sm rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all">Confirm Details</button>
                </div>
              </div>
            )}

            {bookingStep === 3 && (
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-tertiary-fixed/30 p-ds-lg rounded-xl flex items-center gap-ds-md w-full max-w-lg mb-ds-xl">
                  <span className="material-symbols-outlined text-tertiary text-headline-md">verified_user</span>
                  <div>
                    <p className="font-headline-sm text-headline-sm text-tertiary">Booking Summary</p>
                    <p className="font-body-sm text-body-sm text-on-tertiary-fixed-variant">{selectedDoctor.name} • Oct 23rd • {selectedTime}</p>
                  </div>
                </div>
                <div className="w-full max-w-lg space-y-ds-md mb-ds-xl">
                  <div className="flex justify-between border-b border-outline-variant pb-ds-sm">
                    <span className="font-body-md text-body-md text-secondary">Patient Name</span>
                    <span className="font-body-md text-body-md font-semibold">{firstName} {lastName}</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant pb-ds-sm">
                    <span className="font-body-md text-body-md text-secondary">Contact Number</span>
                    <span className="font-body-md text-body-md font-semibold">{phone}</span>
                  </div>
                </div>
                <div className="flex justify-between w-full max-w-lg">
                  <button onClick={() => setBookingStep(2)} className="text-secondary hover:underline font-label-md text-label-md">Back</button>
                  <button 
                    onClick={handleBookingConfirm}
                    className="bg-primary-container text-on-primary py-ds-md px-ds-xl rounded-xl font-headline-sm text-headline-sm shadow-lg hover:shadow-xl hover:bg-primary transition-all active:scale-[0.98]"
                  >
                    Confirm Booking
                  </button>
                </div>
                <p className="mt-ds-md font-body-sm text-body-sm text-on-surface-variant">A confirmation email will be sent upon completion.</p>
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
