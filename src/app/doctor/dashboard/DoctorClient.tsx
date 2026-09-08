'use client';
import { useState } from 'react';
import { updateDoctorProfile, logoutUser } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function DoctorClient({ user }: { user: any }) {
  const router = useRouter();
  const profile = user.profile || {};
  const [form, setForm] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    bio: profile.bio || '',
    clinicName: profile.clinicName || '',
    specialty: profile.specialty || ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    const res = await updateDoctorProfile(form);
    if (res.error) setMsg('Xatolik: ' + res.error);
    else setMsg('Saqlandi!');
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="flex bg-slate-50 px-4 pt-4 border-b">
        <button className="px-4 py-2 font-semibold rounded-t-lg bg-white text-blue-600 border-t border-x">Shaxsiy Profil</button>
        <div className="flex-1"></div>
        <button onClick={handleLogout} className="px-4 py-2 text-red-500 font-semibold hover:bg-red-50 rounded-t-lg transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">logout</span> Chiqish
        </button>
      </div>

      <div className="p-6">
        {profile.approvalStatus === 'PENDING' && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700 flex gap-3">
            <span className="material-symbols-outlined">pending_actions</span>
            <div>
              <h3 className="font-bold">Profilingiz tekshirilmoqda</h3>
              <p className="text-sm mt-1">Admin tasdiqlagandan so'ng sizning anketangiz saytda ko'rinadi.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Ism</label>
              <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Familiya</label>
              <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full border rounded-lg px-3 py-2" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Mutaxassislik</label>
            <input type="text" value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Klinika nomi</label>
            <input type="text" value={form.clinicName} onChange={e => setForm({...form, clinicName: e.target.value})} className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Bio (Siz haqingizda)</label>
            <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full border rounded-lg px-3 py-2 resize-none" rows={4}></textarea>
          </div>
          
          <button disabled={loading} type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
          {msg && <p className="mt-2 text-sm text-green-600 font-semibold">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
