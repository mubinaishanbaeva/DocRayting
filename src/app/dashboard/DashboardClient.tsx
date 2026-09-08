'use client';
import { useState } from 'react';
import { updatePatientProfile, addReview, logoutUser } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function DashboardClient({ user }: { user: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({
    firstName: user.profile?.firstName || '',
    lastName: user.profile?.lastName || '',
    birthDate: user.profile?.birthDate || '',
    bloodGroup: user.profile?.bloodGroup || '',
    allergies: user.profile?.allergies || ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const [reviewForm, setReviewForm] = useState({ doctorId: '', stars: 5, comment: '', type: 'doctor' });
  const [reviewMsg, setReviewMsg] = useState('');

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    const res = await updatePatientProfile(form);
    if (res.error) setMsg('Xatolik: ' + res.error);
    else setMsg('Saqlandi!');
    setLoading(false);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.doctorId) { setReviewMsg('Shifokor ID kiritilmadi.'); return; }
    
    const payload: any = { stars: reviewForm.stars, comment: reviewForm.comment };
    if (reviewForm.type === 'doctor') payload.doctorProfileId = parseInt(reviewForm.doctorId);
    else payload.surgeonProfileId = parseInt(reviewForm.doctorId);

    const res = await addReview(payload);
    if (res.error) setReviewMsg('Xatolik: ' + res.error);
    else { setReviewMsg('Sharh yuborildi. Rahmat!'); setReviewForm({ ...reviewForm, comment: '' }); }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  const tabClass = (id: string) => `px-4 py-2 font-semibold rounded-t-lg transition-colors ${activeTab === id ? 'bg-white text-blue-600 border-t border-x' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="flex bg-slate-50 px-4 pt-4 border-b">
        <button onClick={() => setActiveTab('profile')} className={tabClass('profile')}>Shaxsiy Profil</button>
        <button onClick={() => setActiveTab('reviews')} className={tabClass('reviews')}>Sharh qoldirish</button>
        <div className="flex-1"></div>
        <button onClick={handleLogout} className="px-4 py-2 text-red-500 font-semibold hover:bg-red-50 rounded-t-lg transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">logout</span> Chiqish
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Ism</label>
                <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Familiya</label>
                <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tug'ilgan sana</label>
              <input type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Qon guruhi</label>
              <select value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Tanlang...</option>
                <option value="I (0)">I (0)</option>
                <option value="II (A)">II (A)</option>
                <option value="III (B)">III (B)</option>
                <option value="IV (AB)">IV (AB)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Allergiyalar (agar bo'lsa)</label>
              <textarea value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={3}></textarea>
            </div>
            
            <button disabled={loading} type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
            {msg && <p className="mt-2 text-sm text-green-600 font-semibold">{msg}</p>}
          </form>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Shifokorga baho bering</h2>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mutaxassis turi</label>
                <select value={reviewForm.type} onChange={e => setReviewForm({...reviewForm, type: e.target.value})} className="w-full border rounded-lg px-3 py-2">
                  <option value="doctor">Oddiy Shifokor</option>
                  <option value="surgeon">Jarroh</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Shifokor ID si</label>
                <input type="number" placeholder="Masalan: 1" value={reviewForm.doctorId} onChange={e => setReviewForm({...reviewForm, doctorId: e.target.value})} className="w-full border rounded-lg px-3 py-2" required />
                <p className="text-xs text-slate-500 mt-1">Siz ko'ringan shifokorning tizimdagi ID raqamini kiriting</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Baho (1-5)</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button type="button" key={s} onClick={() => setReviewForm({...reviewForm, stars: s})} className={`text-2xl ${reviewForm.stars >= s ? 'text-amber-400' : 'text-slate-300'}`}>★</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Fikringiz</label>
                <textarea value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} className="w-full border rounded-lg px-3 py-2 resize-none" rows={3}></textarea>
              </div>
              <button type="submit" className="bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
                Yuborish
              </button>
              {reviewMsg && <p className="mt-2 text-sm text-amber-600 font-semibold">{reviewMsg}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
