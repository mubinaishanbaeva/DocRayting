'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerPatient } from '@/app/actions';

export default function PatientRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError("Parollar mos kelmadi."); return; }
    if (form.password.length < 6) { setError("Parol kamida 6 ta belgi bo'lishi kerak."); return; }
    setLoading(true);
    try {
      const result = await registerPatient({ firstName: form.firstName, lastName: form.lastName, phone: form.phone, password: form.password });
      if (result.error) { setError(result.error); setLoading(false); return; }
      router.push('/profile');
    } catch {
      setError("Xatolik yuz berdi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-4 py-16">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-[100%] min-w-[350px] max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="material-symbols-outlined text-white text-[32px]">personal_injury</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Bemor sifatida kirish</h1>
          <p className="text-slate-400 mt-1">Tez va oson ro'yxatdan o'tish</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ism *</label>
                <input type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)}
                  placeholder="Ism" required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Familiya *</label>
                <input type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)}
                  placeholder="Familiya" required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-all text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">📱 Telefon raqam *</label>
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="+998901234567" required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">🔒 Parol *</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                  placeholder="Kamida 6 ta belgi" required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-all" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">{showPwd ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">🔒 Parolni tasdiqlang *</label>
              <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                placeholder="Parolni qaytaring" required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-all" />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>{error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? (<><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Ro'yxatdan o'tilmoqda...</>) : (<><span className="material-symbols-outlined text-[20px]">how_to_reg</span> Ro'yxatdan o'tish</>)}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Hisobingiz bormi? <Link href="/auth/login" className="text-emerald-400 hover:underline font-semibold">Kirish</Link>
          </p>
        </div>

        <p className="text-center text-slate-600 text-sm mt-4">
          <Link href="/auth/register" className="hover:text-slate-400 transition-colors">← Orqaga</Link>
        </p>
      </div>
    </div>
  );
}
