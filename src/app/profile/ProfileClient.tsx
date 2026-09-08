'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateAppointmentStatus, updateUser, logoutUser, addReview } from '@/app/actions';

export default function ProfileClient({ initialAppointments, doctors, initialUser, currentUser, approvedDoctors, approvedSurgeons }: { 
  initialAppointments: any[], 
  doctors: any[], 
  initialUser: any, 
  currentUser: any,
  approvedDoctors: any[],
  approvedSurgeons: any[]
}) {
  // Review state
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [reviewForm, setReviewForm] = useState({ doctorId: '', stars: 5, comment: '', type: 'doctor' });
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.doctorId) { setReviewMsg('Shifokor ID kiritilmadi.'); return; }
    setReviewLoading(true);
    const payload: any = { stars: reviewForm.stars, comment: reviewForm.comment };
    if (reviewForm.type === 'doctor') payload.doctorProfileId = parseInt(reviewForm.doctorId);
    else payload.surgeonProfileId = parseInt(reviewForm.doctorId);
    const res = await addReview(payload);
    if (res.error) setReviewMsg('Xatolik: ' + res.error);
    else { setReviewMsg('Sharh yuborildi! Rahmat! ⭐'); setReviewForm({ ...reviewForm, comment: '', doctorId: '' }); }
    setReviewLoading(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };
  const router = useRouter();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(initialUser);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setEditForm((prev: any) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const openEditWithPhoto = () => {
    setIsEditing(true);
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED');
  const historyAppointments = appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED');

  const handleCancel = async (id: number) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      await updateAppointmentStatus(id, 'CANCELLED');
      const updated = appointments.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a);
      setAppointments(updated);
      router.refresh();
    }
  };

  const handleSaveProfile = async () => {
    await updateUser(editForm);
    setUser(editForm);
    setIsEditing(false);
    router.refresh();
  };

  const getSpecialtyIcon = (specialty: string) => {
    if (specialty.toLowerCase().includes('neuro')) return 'psychiatry';
    if (specialty.toLowerCase().includes('cardio')) return 'favorite';
    if (specialty.toLowerCase().includes('derm')) return 'healing';
    return 'medical_services';
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen scroll-smooth">
      {isEditing && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => { setIsEditing(false); setImagePreview(null); }}
          />
          {/* Centered Modal Card */}
          <div 
            className="fixed left-1/2 top-1/2 bg-surface-container-lowest rounded-3xl p-8 shadow-2xl z-[101] animate-in zoom-in-95 duration-200 overflow-y-auto"
            style={{ 
              width: '90%', 
              maxWidth: '560px', 
              maxHeight: '90vh',
              boxSizing: 'border-box',
              transform: 'translate(-50%, -50%)' 
            }}
          >
            <h2 className="text-headline-md font-headline-md text-primary mb-6">Update Profile Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">First Name</label>
                <input 
                  type="text" 
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Last Name</label>
                <input 
                  type="text" 
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Date of Birth</label>
                <input 
                  type="date" 
                  value={editForm.birthDate || ''}
                  onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              {/* ── Photo Picker ── */}
              <div className="col-span-2">
                <label className="block text-label-md font-label-md text-on-surface-variant mb-3">Profile Photo</label>
                <div className="flex items-center gap-5">
                  {/* Preview circle */}
                  <div
                    onClick={openFilePicker}
                    className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 cursor-pointer group ring-4 ring-primary/10 shadow-md"
                  >
                    <img
                      src={imagePreview || editForm.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
                      alt="Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="material-symbols-outlined text-white text-[22px]">photo_camera</span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-1">
                    <button
                      type="button"
                      onClick={openFilePicker}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary font-semibold text-sm hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                      Galereyadan tanlash
                    </button>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => { setImagePreview(null); setEditForm({...editForm, image: user.image}); }}
                        className="w-full text-center text-xs text-error hover:underline"
                      >
                        Bekor qilish
                      </button>
                    )}
                  </div>
                </div>
                {/* Quick avatars */}
                <div className="mt-4">
                  <p className="text-xs text-on-surface-variant mb-2 font-semibold">Yoki tayyor avatardan tanlang:</p>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
                    ].map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Avatar ${i+1}`}
                        onClick={() => { setImagePreview(null); setEditForm({...editForm, image: url}); }}
                        className={`w-12 h-12 rounded-full cursor-pointer object-cover border-2 transition-all ${
                          editForm.image === url && !imagePreview ? 'border-primary scale-110 shadow-md ring-2 ring-primary/20' : 'border-transparent hover:scale-105 hover:border-primary/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => { setIsEditing(false); setImagePreview(null); }}
                className="flex-1 px-6 py-3 rounded-xl text-label-md font-semibold border border-outline-variant hover:bg-surface-container transition-all"
              >
                Bekor qilish
              </button>
              <button 
                onClick={async () => { await handleSaveProfile(); setImagePreview(null); }}
                className="flex-1 px-6 py-3 rounded-xl text-label-md font-semibold bg-primary text-on-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                Saqlash ✓
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Flex Layout */}
      <div className="flex relative min-h-screen">
        {/* Hidden file input for gallery access */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFileChange}
        />

      {/* SideNavBar */}
      <nav className="bg-surface-container-lowest border-r border-surface-container-high docked left-0 h-screen w-72 sticky top-0 flex-col py-stack-lg px-stack-md gap-stack-sm hidden md:flex z-40">
        <div className="mb-stack-lg flex flex-col items-center">
          <div className="group relative cursor-pointer" onClick={openEditWithPhoto}>
            <div className="w-24 h-24 rounded-full overflow-hidden mb-stack-sm ring-4 ring-primary/10 shadow-sm transition-transform duration-300 group-hover:scale-105 relative">
              <img 
                alt="Patient Profile" 
                className="w-full h-full object-cover" 
                src={user.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"} 
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" }}
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="material-symbols-outlined text-white text-[24px]">photo_camera</span>
                <span className="text-[9px] text-white font-bold uppercase tracking-wider mt-0.5">Change</span>
              </div>
            </div>
          </div>
          <h2 className="text-headline-md font-bold text-primary">{user.firstName} {user.lastName}</h2>
          <p className="text-label-md text-on-surface-variant font-medium">Patient ID: #88291</p>
        </div>
        
        <div className="flex flex-col gap-unit flex-grow">
          <Link className="bg-primary/10 text-primary rounded-xl font-bold flex items-center p-3 gap-3 transition-all hover:bg-primary/15" href="#dashboard">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>dashboard</span>
            <span className="text-label-md">Dashboard</span>
          </Link>
          <Link className="text-on-surface-variant hover:bg-surface-container-low rounded-xl flex items-center p-3 gap-3 transition-all" href="#appointments">
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="text-label-md">Appointments</span>
          </Link>
          <Link className="text-on-surface-variant hover:bg-surface-container-low rounded-xl flex items-center p-3 gap-3 transition-all" href="#history">
            <span className="material-symbols-outlined">history</span>
            <span className="text-label-md">Booking History</span>
          </Link>
          <Link className="text-on-surface-variant hover:bg-surface-container-low rounded-xl flex items-center p-3 gap-3 transition-all" href="#favorites">
            <span className="material-symbols-outlined">favorite</span>
            <span className="text-label-md">Favorite Doctors</span>
          </Link>
          <button 
            onClick={() => setShowReviewPanel(!showReviewPanel)}
            className={`${showReviewPanel ? 'bg-tertiary/10 text-tertiary' : 'text-on-surface-variant hover:bg-surface-container-low'} rounded-xl flex items-center p-3 gap-3 transition-all w-full text-left`}
          >
            <span className="material-symbols-outlined">rate_review</span>
            <span className="text-label-md">Sharh & Baho</span>
          </button>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-on-surface-variant hover:bg-surface-container-low rounded-xl flex items-center p-3 gap-3 transition-all w-full text-left"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-label-md">Account Settings</span>
          </button>
        </div>
        
        <div className="mt-auto mb-stack-lg">
          <Link href="/booking" className="w-full block text-center bg-primary text-on-primary font-semibold text-label-md py-3.5 px-4 rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
            Book New Consultation
          </Link>
        </div>

        <div className="flex flex-col gap-unit pt-stack-sm border-t border-surface-container-high">
          <Link className="text-on-surface-variant hover:bg-surface-container-low rounded-xl flex items-center p-3 gap-3 transition-all" href="#">
            <span className="material-symbols-outlined">contact_support</span>
            <span className="text-label-md">Support</span>
          </Link>
          <button onClick={handleLogout} className="text-error hover:bg-error/10 rounded-xl flex items-center p-3 gap-3 transition-all w-full text-left">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-label-md">Chiqish (Logout)</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto bg-surface-bright" id="dashboard">
        <div className="md:hidden bg-surface-container-lowest border-b border-surface-container-high px-margin-mobile py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
          <div className="text-headline-md-mobile font-bold text-primary">DocRayting</div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-primary cursor-pointer">menu</span>
          </div>
        </div>

        <div className="max-w-container-max mx-auto p-margin-mobile md:p-margin-desktop space-y-8">
          {/* Header Hero Section */}
          <section className="bg-primary rounded-[2.5rem] p-8 md:p-12 text-on-primary relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -ml-32 -mb-32"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div 
                onClick={openEditWithPhoto}
                className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden shrink-0 ring-4 ring-white/20 shadow-2xl relative group cursor-pointer"
              >
                <img 
                  alt="Patient Avatar" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  src={user.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"} 
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" }}
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="material-symbols-outlined text-white text-[32px]">photo_camera</span>
                  <span className="text-[11px] text-white font-bold uppercase tracking-wider">Change Photo</span>
                </div>
              </div>
              <div className="w-full text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-label-sm font-medium mb-4 backdrop-blur-md border border-white/10">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Active Patient
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{currentUser?.profile?.firstName || user.firstName} {currentUser?.profile?.lastName || user.lastName}</h1>
                <p className="text-white/80 text-lg w-full max-w-[600px] mb-6 mx-auto md:mx-0">Xush kelibsiz! Sizda {upcomingAppointments.length} ta kelgusi qabul bor. {currentUser?.role === 'PATIENT' ? '🟢 Bemor' : currentUser?.role === 'DOCTOR' ? '🔵 Shifokor' : currentUser?.role === 'SURGEON' ? '🟣 Jarroh' : ''}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                    <span className="material-symbols-outlined text-[20px]">phone</span>
                    <span className="font-medium">{user.phone}</span>
                  </div>
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl backdrop-blur-md font-bold transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (Appointments) */}
            <div className="lg:col-span-8 space-y-8">
              <section id="appointments" className="bg-white rounded-3xl p-8 shadow-[0px_4px_30px_rgba(0,0,0,0.03)] border border-surface-variant/30">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-on-surface">Upcoming Appointments</h3>
                    <p className="text-on-surface-variant text-sm mt-1">Manage your scheduled medical visits</p>
                  </div>
                  <Link className="bg-primary/5 text-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/10 transition-all" href="/booking">
                    + Book New
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {upcomingAppointments.length === 0 && (
                    <div className="py-12 text-center text-on-surface-variant border-2 border-dashed rounded-2xl border-surface-variant/50">
                      <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">event_busy</span>
                      No upcoming appointments.
                    </div>
                  )}
                  {upcomingAppointments.map((app) => (
                    <div key={app.id} className="group bg-surface-container-lowest rounded-2xl p-5 border border-surface-variant/30 hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 ring-2 ring-surface-variant/20 group-hover:ring-primary/20 transition-all">
                        <img alt={app.doctor.name} className="w-full h-full object-cover" src={app.doctor.image} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{app.doctor.name}</h4>
                        <p className="text-sm font-medium text-on-surface-variant mb-3">{app.doctor.specialty} • City Hospital</p>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 bg-secondary-container/50 text-on-secondary-fixed-variant px-3 py-1.5 rounded-lg text-xs font-bold">
                            <span className="material-symbols-outlined text-[16px]">event</span>
                            {app.date}
                          </div>
                          <div className="flex items-center gap-1.5 bg-secondary-container/50 text-on-secondary-fixed-variant px-3 py-1.5 rounded-lg text-xs font-bold">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                            {app.time}
                          </div>
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none bg-surface-container/50 text-on-surface-variant px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-surface-container transition-all">Reschedule</button>
                        <button onClick={() => handleCancel(app.id)} className="flex-1 sm:flex-none bg-error/10 text-error px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-error/15 transition-all">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="history" className="bg-white rounded-3xl p-8 shadow-[0px_4px_30px_rgba(0,0,0,0.03)] border border-surface-variant/30">
                <h3 className="text-2xl font-bold text-on-surface mb-8">Medical History</h3>
                <div className="space-y-0">
                  {historyAppointments.length === 0 && (
                    <p className="py-4 text-center text-on-surface-variant italic">No previous history recorded.</p>
                  )}
                  {historyAppointments.map((app) => (
                    <div key={app.id} className="py-5 border-b border-surface-container-high last:border-0 flex items-center justify-between group hover:px-2 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
                          <span className="material-symbols-outlined">{getSpecialtyIcon(app.doctor.specialty)}</span>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-on-surface">{app.doctor.name}</h4>
                          <p className="text-sm font-medium text-on-surface-variant">{app.doctor.specialty} • {app.date}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${app.status === 'CANCELLED' ? 'bg-error/10 text-error' : 'bg-surface-container-highest/50 text-on-surface-variant'}`}>
                        {app.status === 'CANCELLED' ? 'Cancelled' : 'Completed'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column (Sidebar Cards) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Modern Patient Info Card */}
              <section className="bg-white rounded-3xl p-8 shadow-xl border border-primary/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                
                <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  Patient Stats
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">bloodtype</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Blood Group</p>
                      <p className="text-lg font-bold text-on-surface">O Positive (Rh+)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">cake</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date of Birth</p>
                      <p className="text-lg font-bold text-on-surface">{user.birthDate || 'Not Set'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-surface-bright rounded-2xl p-4 border border-surface-variant/30">
                      <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Weight</p>
                      <p className="text-xl font-bold text-primary">75 <span className="text-sm text-on-surface-variant font-medium">kg</span></p>
                    </div>
                    <div className="bg-surface-bright rounded-2xl p-4 border border-surface-variant/30">
                      <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Height</p>
                      <p className="text-xl font-bold text-primary">178 <span className="text-sm text-on-surface-variant font-medium">cm</span></p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100 mt-2">
                    <div className="flex items-center gap-2 mb-2 text-yellow-700">
                      <span className="material-symbols-outlined text-[20px]">warning</span>
                      <p className="text-xs font-bold uppercase tracking-wider">Allergies</p>
                    </div>
                    <p className="text-sm font-medium text-yellow-800">Penicillin, Peanuts</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-8 py-3 rounded-xl border-2 border-primary/10 text-primary font-bold text-sm hover:bg-primary/5 transition-all"
                >
                  Update Vitals
                </button>
              </section>

              {/* Review Section */}
              {showReviewPanel && (
                <section className="bg-white rounded-3xl p-8 shadow-xl border border-tertiary/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-full -mr-12 -mt-12"></div>
                  <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-tertiary rounded-full"></span>
                    Shifokorga Baho Berish
                  </h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-on-surface-variant mb-1">Mutaxassis turi</label>
                      <select value={reviewForm.type} onChange={e => setReviewForm({...reviewForm, type: e.target.value, doctorId: ''})} className="w-full border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                        <option value="doctor">Shifokor</option>
                        <option value="surgeon">Jarroh</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-on-surface-variant mb-1">Shifokorni tanlang</label>
                      {reviewForm.type === 'doctor' ? (
                        approvedDoctors.length === 0 ? (
                          <p className="text-sm text-on-surface-variant italic border rounded-xl p-3">Hozircha tasdiqlangan shifokor yo'q.</p>
                        ) : (
                          <select value={reviewForm.doctorId} onChange={e => setReviewForm({...reviewForm, doctorId: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" required>
                            <option value="">— Shifokor tanlang —</option>
                            {approvedDoctors.map((d: any) => (
                              <option key={d.id} value={d.id}>{d.firstName} {d.lastName} — {d.specialty} ({d.clinicName})</option>
                            ))}
                          </select>
                        )
                      ) : (
                        approvedSurgeons.length === 0 ? (
                          <p className="text-sm text-on-surface-variant italic border rounded-xl p-3">Hozircha tasdiqlangan jarroh yo'q.</p>
                        ) : (
                          <select value={reviewForm.doctorId} onChange={e => setReviewForm({...reviewForm, doctorId: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" required>
                            <option value="">— Jarroh tanlang —</option>
                            {approvedSurgeons.map((s: any) => (
                              <option key={s.id} value={s.id}>{s.firstName} {s.lastName} — {s.surgicalField} ({s.clinicName})</option>
                            ))}
                          </select>
                        )
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-on-surface-variant mb-1">Baho (1-5 yulduz)</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(s => (
                          <button type="button" key={s} onClick={() => setReviewForm({...reviewForm, stars: s})} className={`text-3xl transition-transform hover:scale-110 ${reviewForm.stars >= s ? 'text-amber-400' : 'text-slate-300'}`}>★</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-on-surface-variant mb-1">Fikringiz</label>
                      <textarea value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" rows={3} placeholder="Shifokor haqida fikringiz..."></textarea>
                    </div>
                    <button type="submit" disabled={reviewLoading} className="w-full bg-tertiary text-on-tertiary py-3 rounded-xl font-bold hover:bg-tertiary/90 transition-all active:scale-[0.98] shadow-lg shadow-tertiary/20 disabled:opacity-50">
                      {reviewLoading ? 'Yuborilmoqda...' : '⭐ Sharh Yuborish'}
                    </button>
                    {reviewMsg && <p className={`text-sm font-semibold ${reviewMsg.includes('Xatolik') ? 'text-error' : 'text-secondary'}`}>{reviewMsg}</p>}
                  </form>
                </section>
              )}

              <section id="favorites" className="bg-white rounded-3xl p-8 shadow-[0px_4px_30px_rgba(0,0,0,0.03)] border border-surface-variant/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-on-surface">Favorite Doctors</h3>
                  <span className="material-symbols-outlined text-primary/40">favorite</span>
                </div>
                <div className="space-y-4">
                  {doctors.slice(0, 2).map((doc) => (
                    <div key={doc.id} className="bg-surface-bright rounded-2xl p-4 border border-surface-variant/30 hover:border-primary/30 transition-all group">
                      <div className="flex items-center gap-4 mb-4">
                        <img alt={doc.name} className="w-12 h-12 rounded-xl object-cover shadow-sm" src={doc.image} />
                        <div>
                          <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{doc.name}</h4>
                          <p className="text-xs font-medium text-on-surface-variant">{doc.specialty}</p>
                        </div>
                      </div>
                      <Link href="/booking" className="w-full block text-center bg-white border border-primary/20 text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary hover:text-on-primary transition-all">
                        Book Now
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
