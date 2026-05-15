import { getAppointments, updateAppointmentStatus } from '@/app/actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const appointments = await getAppointments();

  return (
    <main className="max-w-7xl mx-auto px-ds-gutter py-ds-xxl">
      <div className="flex justify-between items-center mb-ds-xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Admin Dashboard</h1>
          <p className="font-body-md text-body-md text-secondary">Manage real-time bookings</p>
        </div>
        <Link href="/" className="bg-surface-container text-on-surface px-ds-lg py-ds-sm rounded-lg hover:bg-outline-variant transition-colors">
          Back to Site
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-ds-lg mb-ds-xxl">
        <div className="bg-surface-container-lowest p-ds-lg rounded-xl card-shadow border-l-4 border-primary">
          <p className="font-label-md text-label-md text-secondary">Total Bookings</p>
          <p className="font-headline-xl text-headline-xl">{appointments.length}</p>
        </div>
        <div className="bg-surface-container-lowest p-ds-lg rounded-xl card-shadow border-l-4 border-yellow-500">
          <p className="font-label-md text-label-md text-secondary">Pending</p>
          <p className="font-headline-xl text-headline-xl">{appointments.filter(a => a.status === 'PENDING').length}</p>
        </div>
        <div className="bg-surface-container-lowest p-ds-lg rounded-xl card-shadow border-l-4 border-green-500">
          <p className="font-label-md text-label-md text-secondary">Confirmed</p>
          <p className="font-headline-xl text-headline-xl">{appointments.filter(a => a.status === 'CONFIRMED').length}</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl card-shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-container border-b border-outline-variant">
            <tr>
              <th className="p-ds-md font-label-md text-label-md">Patient</th>
              <th className="p-ds-md font-label-md text-label-md">Doctor</th>
              <th className="p-ds-md font-label-md text-label-md">Date & Time</th>
              <th className="p-ds-md font-label-md text-label-md">Status</th>
              <th className="p-ds-md font-label-md text-label-md text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {appointments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-ds-xl text-center text-secondary">No appointments found.</td>
              </tr>
            )}
            {appointments.map(app => (
              <tr key={app.id} className="hover:bg-surface-bright transition-colors">
                <td className="p-ds-md">
                  <p className="font-body-md text-body-md font-semibold">{app.patientName}</p>
                  <p className="text-xs text-secondary">{app.patientPhone}</p>
                </td>
                <td className="p-ds-md font-body-sm text-body-sm">{app.doctor.name}</td>
                <td className="p-ds-md font-body-sm text-body-sm">
                  <p>{app.date}</p>
                  <p className="font-semibold text-primary">{app.time}</p>
                </td>
                <td className="p-ds-md">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-ds-md text-right space-x-2">
                  {app.status === 'PENDING' && (
                    <>
                      <form action={async () => { 'use server'; await updateAppointmentStatus(app.id, 'CONFIRMED'); }} className="inline">
                        <button className="text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1 rounded text-sm font-medium transition-colors">Approve</button>
                      </form>
                      <form action={async () => { 'use server'; await updateAppointmentStatus(app.id, 'CANCELLED'); }} className="inline">
                        <button className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-sm font-medium transition-colors">Cancel</button>
                      </form>
                    </>
                  )}
                  {app.status === 'CONFIRMED' && (
                    <form action={async () => { 'use server'; await updateAppointmentStatus(app.id, 'CANCELLED'); }} className="inline">
                      <button className="text-red-600 hover:underline text-sm font-medium">Cancel Booking</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
