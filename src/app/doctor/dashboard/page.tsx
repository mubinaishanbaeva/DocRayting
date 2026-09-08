import { getCurrentUser } from '@/app/actions';
import { redirect } from 'next/navigation';
import DoctorClient from './DoctorClient';

export default async function DoctorDashboard() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'DOCTOR') {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Shifokor Profili</h1>
        <DoctorClient user={user} />
      </div>
    </div>
  );
}
