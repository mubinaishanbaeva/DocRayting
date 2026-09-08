'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerDoctor } from '@/app/actions';

const specialties = ['Kardiologiya','Dermatologiya','Pediatriya','Nevrologiya','Oftalmologiya','Ortopediya','Endokrinologiya','Gastroenterologiya','Urologiya','Ginekologiya','Psixiatriya','Radiologiya','Onkologiya','Revmatologiya'];

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', username: '',
    password: '', confirm: '', specialty: '', experience: '', clinicName: '', bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const validateStep1 = () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.email) return 'Barcha maydonlarni to\'ldiring.';
    if (!form.email.includes('@')) return 'Email noto\'g\'ri formatda.';
    return '';
  };

  const validateStep2 = () => {
    if (!form.username || !form.password || !form.confirm) return 'Barcha maydonlarni to\'ldiring.';
    if (form.password !== form.confirm) return 'Parollar mos kelmadi.';
    if (form.password.length < 8) return 'Parol kamida 8 ta belgi bo\'lishi kerak.';
    return '';
  };

  const validateStep3 = () => {
    if (!form.specialty || !form.experience || !form.clinicName) return 'Barcha majburiy maydonlarni to\'ldiring.';
    return '';
  };

  const handleNext = () => {
    const err = step === 1 ? validateStep1() : step === 2 ? validateStep2() : validateStep3();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const err = validateStep3();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const result = await registerDoctor({
        firstName: form.firstName, lastName: form.lastName,
        phone: form.phone, email: form.email, username: form.username,
        password: form.password, specialty: form.specialty,
        experience: parseInt(form.experience) || 0,
        clinicName: form.clinicName, bio: form.bio
      });
      if (result.error) { setError(result.error); setLoading(false); return; }
      router.push('/profile');
    } catch {
      setError('Xatolik yuz berdi.');
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 py-16">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-[100%] min-w-[350px] max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="material-symbols-outlined text-white text-[32px]">stethoscope</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Shifokor ro'yxati</h1>
          <p className="text-slate-400 mt-1">Admin tasdiqlashidan so'ng faollashadi</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1,2,3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-500'}`}>{s}</div>
              {s < 3 && <div className={`w-16 h-0.5 transition-all ${step > s ? 'bg-blue-500' : 'bg-white/10'}`}></div>}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-500 mb-6 px-2">
          <span className={step >= 1 ? 'text-blue-400' : ''}>Shaxsiy ma'lumot</span>
          <span className={step >= 2 ? 'text-blue-400' : ''}>Hisob ma'lumoti</span>
          <span className={step >= 3 ? 'text-blue-400' : ''}>Kasb ma'lumoti</span>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">👤 Shaxsiy ma'lumotlar</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ism *</label>
                  <input type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Ism" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Familiya *</label>
                  <input type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Familiya" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">📱 Telefon *</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+998901234567" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">📧 Email (Gmail) *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@gmail.com" className={inputClass} />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">🔐 Hisob ma'lumotlari</h2>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Login (username) *</label>
                <input type="text" value={form.username} onChange={e => set('username', e.target.value)} placeholder="dr.username" className={inputClass} />
                <p className="text-xs text-slate-500 mt-1">Faqat lotin harflari, raqamlar va nuqta</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">🔒 Parol *</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Kamida 8 ta belgi" className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">{showPwd ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">🔒 Parolni tasdiqlang *</label>
                <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Parolni qaytaring" className={inputClass} />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">🏥 Kasb ma'lumotlari</h2>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mutaxassislik *</label>
                <select value={form.specialty} onChange={e => set('specialty', e.target.value)} className={`${inputClass} cursor-pointer`}>
                  <option value="" className="bg-slate-800">Mutaxassislikni tanlang</option>
                  {specialties.map(s => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ish tajribasi (yillar) *</label>
                <input type="number" min="0" max="60" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="Masalan: 5" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Klinika/Shifoxona nomi *</label>
                <input type="text" value={form.clinicName} onChange={e => set('clinicName', e.target.value)} placeholder="Klinika nomi" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tarjimai hol (bio)</label>
                <textarea value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="O'zingiz haqingizda qisqacha..." rows={3}
                  className={`${inputClass} resize-none`} />
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-blue-300 text-xs flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] mt-0.5">info</span>
                Ro'yxatdan o'tganingizdan so'ng admin sertifikat va hujjatlaringizni tasdiqlaydi. Hujjatlarni profilingizdan yuklashingiz mumkin.
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>{error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button onClick={() => { setStep(s => s - 1); setError(''); }}
                className="flex-1 border border-white/20 text-slate-300 font-bold py-3 rounded-xl hover:bg-white/5 transition-all">
                ← Orqaga
              </button>
            )}
            {step < 3 ? (
              <button onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all">
                Davom etish →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                {loading ? (<><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Yuborilmoqda...</>) : (<><span className="material-symbols-outlined text-[20px]">how_to_reg</span> Ro'yxatdan o'tish</>)}
              </button>
            )}
          </div>

          <p className="text-center text-slate-500 text-sm mt-5">
            Hisobingiz bormi? <Link href="/auth/login" className="text-blue-400 hover:underline font-semibold">Kirish</Link>
          </p>
        </div>

        <p className="text-center text-slate-600 text-sm mt-4">
          <Link href="/auth/register" className="hover:text-slate-400 transition-colors">← Orqaga</Link>
        </p>
      </div>
    </div>
  );
}
