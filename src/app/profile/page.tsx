import { getAppointments, getDoctors, getUser } from '@/app/actions';
import ProfileClient from './ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const appointments = await getAppointments();
  const doctors = await getDoctors();
  const user = await getUser();
  
  return <ProfileClient initialAppointments={appointments} doctors={doctors} initialUser={user} />;
}
