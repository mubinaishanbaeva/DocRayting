'use client';
import { useState } from 'react';
import { toggleBlockUser, approveDoctorProfile, approveSurgeonProfile, logoutUser } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function AdminClient({ users, pendingDoctors, pendingSurgeons }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState<number | null>(null);

  const handleBlock = async (id: number, block: boolean) => {
    setLoading(id);
    await toggleBlockUser(id, block);
    setLoading(null);
  };

  const handleApproveDoc = async (id: number, approve: boolean) => {
    setLoading(id);
    await approveDoctorProfile(id, approve);
    setLoading(null);
  };

  const handleApproveSurg = async (id: number, approve: boolean) => {
    setLoading(id);
    await approveSurgeonProfile(id, approve);
    setLoading(null);
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  const tabClass = (id: string) => `px-6 py-3 font-semibold rounded-t-lg transition-colors ${activeTab === id ? 'bg-white text-blue-600 border-t border-x' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="flex bg-slate-50 px-4 pt-4 border-b">
        <button onClick={() => setActiveTab('pending')} className={tabClass('pending')}>
          Tasdiqlash kutilmoqda <span className="ml-2 bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs">{pendingDoctors.length + pendingSurgeons.length}</span>
        </button>
        <button onClick={() => setActiveTab('users')} className={tabClass('users')}>Barcha foydalanuvchilar</button>
        <div className="flex-1"></div>
        <button onClick={handleLogout} className="px-4 py-2 text-red-500 font-semibold hover:bg-red-50 rounded-t-lg transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">logout</span> Chiqish
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'pending' && (
          <div className="space-y-8">
            {/* Doctors */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">stethoscope</span> Shifokor so'rovlari
              </h3>
              {pendingDoctors.length === 0 ? <p className="text-slate-500 text-sm">Yangi so'rovlar yo'q.</p> : (
                <div className="space-y-4">
                  {pendingDoctors.map((doc: any) => (
                    <div key={doc.id} className="border rounded-xl p-4 flex justify-between items-center bg-slate-50">
                      <div>
                        <p className="font-bold text-slate-800">{doc.firstName} {doc.lastName} <span className="text-slate-500 font-normal text-sm">(@{doc.username})</span></p>
                        <p className="text-sm text-slate-600 mt-1">Mutaxassislik: <b>{doc.specialty}</b> • Tajriba: <b>{doc.experience} yil</b></p>
                        <p className="text-sm text-slate-600">Klinika: {doc.clinicName}</p>
                      </div>
                      <div className="flex gap-2">
                        <button disabled={loading === doc.id} onClick={() => handleApproveDoc(doc.id, true)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> Tasdiqlash
                        </button>
                        <button disabled={loading === doc.id} onClick={() => handleApproveDoc(doc.id, false)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">cancel</span> Rad etish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Surgeons */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-t pt-8">
                <span className="material-symbols-outlined text-violet-500">surgical</span> Jarroh so'rovlari
              </h3>
              {pendingSurgeons.length === 0 ? <p className="text-slate-500 text-sm">Yangi so'rovlar yo'q.</p> : (
                <div className="space-y-4">
                  {pendingSurgeons.map((surg: any) => (
                    <div key={surg.id} className="border border-violet-200 rounded-xl p-4 flex justify-between items-center bg-violet-50/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800">{surg.lastName} {surg.firstName} {surg.middleName}</p>
                          <span className="bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded font-bold">{surg.licenseNumber}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">Soha: <b>{surg.surgicalField}</b> • Tajriba: <b>{surg.experience} yil</b></p>
                        <p className="text-sm text-slate-600">Klinika: {surg.clinicName} ({surg.clinicAddress})</p>
                        <div className="mt-2 text-xs text-slate-500 bg-white border rounded p-2 inline-block">
                          <p><b>Tavsiyachi 1:</b> {surg.ref1Name} ({surg.ref1Phone})</p>
                          <p><b>Tavsiyachi 2:</b> {surg.ref2Name} ({surg.ref2Phone})</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button disabled={loading === surg.id} onClick={() => handleApproveSurg(surg.id, true)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> Tasdiqlash
                        </button>
                        <button disabled={loading === surg.id} onClick={() => handleApproveSurg(surg.id, false)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">cancel</span> Rad etish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="p-3 text-sm font-semibold text-slate-600">ID</th>
                  <th className="p-3 text-sm font-semibold text-slate-600">Telefon</th>
                  <th className="p-3 text-sm font-semibold text-slate-600">Email</th>
                  <th className="p-3 text-sm font-semibold text-slate-600">Rol</th>
                  <th className="p-3 text-sm font-semibold text-slate-600">Holat</th>
                  <th className="p-3 text-sm font-semibold text-slate-600">Amal</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 text-sm">{u.id}</td>
                    <td className="p-3 text-sm font-mono">{u.phone}</td>
                    <td className="p-3 text-sm">{u.email || '-'}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        u.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                        u.role === 'SURGEON' ? 'bg-violet-100 text-violet-700' :
                        u.role === 'DOCTOR' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>{u.role}</span>
                    </td>
                    <td className="p-3 text-sm">
                      <span className={`flex items-center gap-1 ${u.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-600'}`}>
                        <span className="material-symbols-outlined text-[16px]">{u.status === 'ACTIVE' ? 'check_circle' : 'block'}</span>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      {u.role !== 'ADMIN' && (
                        <button 
                          disabled={loading === u.id}
                          onClick={() => handleBlock(u.id, u.status === 'ACTIVE')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            u.status === 'ACTIVE' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Bloklash' : 'Ochish'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
