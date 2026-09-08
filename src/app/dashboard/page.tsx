import { getCurrentUser, getAppointments } from '@/app/actions';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function PatientDashboard() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'PATIENT') {
    redirect('/auth/login');
  }

  // Get appointments for this patient
  // Note: the legacy getAppointments doesn't filter by patient auth ID, but we can filter it here
  // For now, let's fetch all and filter by patientName if needed, or we just pass them.
  // We'll pass the full user object to the client component.
  
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Bemor Profili</h1>
        <DashboardClient user={user} />
      </div>
    </div>
  );
}
