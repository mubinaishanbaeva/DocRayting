import { getCurrentUser, getAdminStats, getAllUsers, getPendingDoctors, getPendingSurgeons } from '@/app/actions';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  const stats = await getAdminStats();
  const allUsers = await getAllUsers();
  const pendingDoctors = await getPendingDoctors();
  const pendingSurgeons = await getPendingSurgeons();

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined text-[32px] text-blue-600">admin_panel_settings</span>
          Admin Boshqaruv Paneli
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">personal_injury</span>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold">Bemorlar</p>
              <p className="text-2xl font-bold text-slate-800">{stats?.patients || 0}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">stethoscope</span>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold">Shifokorlar</p>
              <p className="text-2xl font-bold text-slate-800">{stats?.doctors || 0}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">surgical</span>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold">Jarrohlar</p>
              <p className="text-2xl font-bold text-slate-800">{stats?.surgeons || 0}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold">Kutishda (Tasdiq)</p>
              <p className="text-2xl font-bold text-slate-800">{(stats?.pendingDoctors || 0) + (stats?.pendingSurgeons || 0)}</p>
            </div>
          </div>
        </div>

        <AdminClient 
          users={allUsers || []} 
          pendingDoctors={pendingDoctors || []} 
          pendingSurgeons={pendingSurgeons || []} 
        />
      </div>
    </div>
  );
}
