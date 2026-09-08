import { getAppointments, getDoctors, getUser, getCurrentUser, getApprovedDoctors, getApprovedSurgeons } from '@/app/actions';
import ProfileClient from './ProfileClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    redirect('/auth/login');
  }

  if (currentUser.role === 'ADMIN') {
    redirect('/admin');
  }

  const appointments = await getAppointments();
  const doctors = await getDoctors();
  const user = await getUser();
  const approvedDoctors = await getApprovedDoctors();
  const approvedSurgeons = await getApprovedSurgeons();
  
  return (
    <ProfileClient 
      initialAppointments={appointments} 
      doctors={doctors} 
      initialUser={user} 
      currentUser={currentUser}
      approvedDoctors={approvedDoctors}
      approvedSurgeons={approvedSurgeons}
    />
  );
}
