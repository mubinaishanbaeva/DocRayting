'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerSurgeon } from '@/app/actions';

const fields = [
  'Neyroxirurgiya', 'Kardioxirurgiya', 'Umumiy jarrohlik', 
  'Bolalar jarrohligi', 'Plastik jarrohlik', 'Ortopediya va travmatologiya', 
  'Qon-tomir jarrohligi', 'Yuz-jag\' jarrohligi', 'Onkologik jarrohlik'
];

export default function SurgeonRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', middleName: '', phone: '', email: '', username: '',
    password: '', confirm: '', surgicalField: '', experience: '', clinicName: '',
    clinicAddress: '', licenseNumber: '', bio: '', ref1Name: '', ref1Phone: '',
    ref2Name: '', ref2Phone: '', securityAnswer: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const validateStep1 = () => {
    if (!form.firstName || !form.lastName || !form.middleName || !form.phone || !form.email) return 'Barcha shaxsiy ma\'lumotlarni to\'ldiring.';
    if (!form.email.includes('@')) return 'Email noto\'g\'ri formatda.';
    return '';
  };

  const validateStep2 = () => {
    if (!form.surgicalField || !form.experience || !form.clinicName || !form.clinicAddress) return 'Barcha kasbiy ma\'lumotlarni to\'ldiring.';
    return '';
  };

  const validateStep3 = () => {
    if (!form.licenseNumber || !form.ref1Name || !form.ref1Phone || !form.ref2Name || !form.ref2Phone) return 'Litsenziya va tavsiyachilarni kiriting.';
    if (form.licenseNumber.length < 5) return 'Litsenziya raqami noto\'g\'ri.';
    return '';
  };

  const validateStep4 = () => {
    if (!form.username || !form.password || !form.confirm || !form.securityAnswer) return 'Barcha maydonlarni to\'ldiring.';
    if (form.password !== form.confirm) return 'Parollar mos kelmadi.';
    
    // Strong password check
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})");
    if (!strongRegex.test(form.password)) {
      return 'Parol kamida 8 belgi, 1 ta katta harf, 1 ta raqam va 1 ta maxsus belgi (!@#$%^&*) dan iborat bo\'lishi kerak.';
    }
    return '';
  };

  const handleNext = () => {
    const err = step === 1 ? validateStep1() : step === 2 ? validateStep2() : step === 3 ? validateStep3() : '';
    if (err) { setError(err); return; }
    setError('');
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const err = validateStep4();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const result = await registerSurgeon({
        firstName: form.firstName, lastName: form.lastName, middleName: form.middleName,
        phone: form.phone, email: form.email, username: form.username,
        password: form.password, surgicalField: form.surgicalField,
        experience: parseInt(form.experience) || 0, clinicName: form.clinicName,
        clinicAddress: form.clinicAddress, licenseNumber: form.licenseNumber, bio: form.bio,
        ref1Name: form.ref1Name, ref1Phone: form.ref1Phone,
        ref2Name: form.ref2Name, ref2Phone: form.ref2Phone,
        securityAnswer: form.securityAnswer
      });
      if (result.error) { setError(result.error); setLoading(false); return; }
      router.push('/profile');
    } catch {
      setError('Xatolik yuz berdi.');
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-slate-300 mb-1.5";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 p-4 py-16">
      <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-[100%] min-w-[350px] max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-500/20">
            <span className="material-symbols-outlined text-white text-[32px]">surgical</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Jarrohlar uchun yopiq ro'yxat</h1>
          <p className="text-slate-400 mt-1 text-sm max-w-lg mx-auto">Xavfsizlik va malakani tasdiqlash maqsadida ko'proq ma'lumot talab etiladi. Barcha ma'lumotlar sir saqlanadi va faqat admin tomonidan ko'riladi.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8 px-8 relative">
          <div className="absolute left-10 right-10 top-1/2 h-0.5 bg-white/10 -z-10"></div>
          <div className="absolute left-10 right-10 top-1/2 h-0.5 bg-violet-500 -z-10 transition-all duration-500" style={{ width: `${(step-1)*33.3}%` }}></div>
          
          {[1,2,3,4].map(s => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-lg ${step >= s ? 'bg-violet-500 text-white shadow-violet-500/50' : 'bg-slate-800 border border-white/10 text-slate-500'}`}>
              {step > s ? <span className="material-symbols-outlined text-[20px]">check</span> : s}
            </div>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Security badge */}
          <div className="absolute top-0 right-0 bg-violet-500/20 text-violet-300 text-[10px] uppercase font-bold px-4 py-1.5 rounded-bl-xl flex items-center gap-1 border-b border-l border-white/10">
            <span className="material-symbols-outlined text-[14px]">shield</span> Xavfsiz tizim
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">1. Shaxsiy ma'lumotlar</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Ism *</label>
                  <input type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Ism" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Familiya *</label>
                  <input type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Familiya" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Otasining ismi *</label>
                  <input type="text" value={form.middleName} onChange={e => set('middleName', e.target.value)} placeholder="Otasining ismi" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>📱 Telefon *</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+998901234567" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>📧 Email (Gmail) *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@gmail.com" className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">2. Kasbiy va ish joyi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Jarrohlik sohasi *</label>
                  <select value={form.surgicalField} onChange={e => set('surgicalField', e.target.value)} className={`${inputClass} cursor-pointer`}>
                    <option value="" className="bg-slate-800">Sohani tanlang</option>
                    {fields.map(s => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Ish tajribasi (yillar) *</label>
                  <input type="number" min="0" max="60" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="Masalan: 10" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Asosiy ish joyi (Shifoxona/Klinika) *</label>
                <input type="text" value={form.clinicName} onChange={e => set('clinicName', e.target.value)} placeholder="Respublika ixtisoslashtirilgan markazi..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Shifoxona manzili *</label>
                <input type="text" value={form.clinicAddress} onChange={e => set('clinicAddress', e.target.value)} placeholder="Toshkent sh, Yunusobod tumani..." className={inputClass} />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">3. Litsenziya va tavsiyalar</h2>
              <div>
                <label className={labelClass}>Tibbiy litsenziya raqami *</label>
                <input type="text" value={form.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} placeholder="SSV-..." className={inputClass} />
                <p className="text-xs text-slate-500 mt-1">Sog'liqni saqlash vazirligi tomonidan berilgan tartib raqam</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 mt-4">
                <h3 className="text-sm font-bold text-white mb-3">Tavsiya beruvchi hamkasblar (Reference)</h3>
                <p className="text-xs text-slate-400 mb-4">Sizni tasdiqlay oladigan 2 ta hamkasb jarroh ism va raqamini kiriting.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>1-Hamkasb F.I.Sh *</label>
                    <input type="text" value={form.ref1Name} onChange={e => set('ref1Name', e.target.value)} placeholder="Dr. Aliyev Vali" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>1-Hamkasb Telefoni *</label>
                    <input type="tel" value={form.ref1Phone} onChange={e => set('ref1Phone', e.target.value)} placeholder="+998..." className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>2-Hamkasb F.I.Sh *</label>
                    <input type="text" value={form.ref2Name} onChange={e => set('ref2Name', e.target.value)} placeholder="Dr. Valiyev Ali" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>2-Hamkasb Telefoni *</label>
                    <input type="tel" value={form.ref2Phone} onChange={e => set('ref2Phone', e.target.value)} placeholder="+998..." className={inputClass} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">4. Xavfsizlik va Parol</h2>
              <div>
                <label className={labelClass}>Login (Username) *</label>
                <input type="text" value={form.username} onChange={e => set('username', e.target.value)} placeholder="dr.surname" className={inputClass} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>🔒 Parol *</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Murakkab parol" className={`${inputClass} pr-10`} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <span className="material-symbols-outlined text-[18px]">{showPwd ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>🔒 Parolni tasdiqlang *</label>
                  <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Parolni qaytaring" className={inputClass} />
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-[11px] text-red-300 font-mono flex items-start gap-2">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Parol majburiy talablari: Kamida 8 belgi, 1ta katta harf, 1ta raqam, 1ta maxsus belgi (!@#$%^&*).
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <label className={labelClass}>Maxfiy savol: Siz tahsil olgan birinchi maktab nomi? *</label>
                <input type="text" value={form.securityAnswer} onChange={e => set('securityAnswer', e.target.value)} placeholder="Javobingiz (kichik harflarda yozing)" className={inputClass} />
                <p className="text-xs text-slate-500 mt-1">Hisobni tiklash yoki qo'shimcha tekshiruv uchun ishlatiladi</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2 animate-pulse">
              <span className="material-symbols-outlined text-[18px]">error</span>{error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button onClick={() => { setStep(s => s - 1); setError(''); }}
                className="w-1/3 border border-white/20 text-slate-300 font-bold py-3.5 rounded-xl hover:bg-white/5 transition-all">
                Orqaga
              </button>
            )}
            {step < 4 ? (
              <button onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 hover:scale-[1.01] transition-all shadow-lg shadow-violet-500/25">
                Keyingisi
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/25">
                {loading ? (<><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Yuborilmoqda...</>) : (<><span className="material-symbols-outlined text-[20px]">verified_user</span> Yuborish</>)}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-slate-600 text-sm mt-6">
          <Link href="/auth/register" className="hover:text-slate-400 transition-colors">← Bekor qilish</Link>
        </p>
      </div>
    </div>
  );
}
