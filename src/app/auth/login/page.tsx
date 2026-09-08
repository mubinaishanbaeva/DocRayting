'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/actions';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await loginUser({ phone, password });
      if (result.error) { setError(result.error); setLoading(false); return; }
      if (result.role === 'ADMIN') router.push('/admin');
      else router.push('/profile');
    } catch {
      setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-48 -mt-48 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-48 -mb-48 pointer-events-none"></div>

      <div className="relative w-[100%] min-w-[350px] max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]">medical_services</span>
            </div>
            <span className="text-2xl font-extrabold text-white">DocRayting</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">Xush kelibsiz!</h1>
          <p className="text-slate-400 mt-1">Hisobingizga kiring</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">📱 Telefon raqam</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+998901234567"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">🔒 Parol</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Parolingizni kiriting"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Kirilmoqda...</>
              ) : (
                <><span className="material-symbols-outlined text-[20px]">login</span> Kirish</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-slate-500 text-sm">yoki</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Register link */}
          <Link
            href="/auth/register"
            className="w-full flex items-center justify-center gap-2 border border-white/20 text-slate-300 font-semibold py-3.5 rounded-xl hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Yangi hisob yaratish
          </Link>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          <Link href="/" className="text-blue-400 hover:underline">← Bosh sahifaga qaytish</Link>
        </p>
      </div>
    </div>
  );
}
