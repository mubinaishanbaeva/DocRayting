'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function getDoctors() {
  return await prisma.doctor.findMany();
}

export async function getUser() {
  // We use a hardcoded ID 1 for this demo/local user
  let user = await prisma.user.findUnique({ where: { id: 1 } });
  if (!user) {
    user = await prisma.user.create({ data: { id: 1 } });
  }
  return user;
}

export async function updateUser(data: { firstName: string, lastName: string, email: string, phone: string, image: string, birthDate?: string }) {
  await prisma.user.update({
    where: { id: 1 },
    data
  });
  revalidatePath('/profile');
}

export async function getAppointments() {
  return await prisma.appointment.findMany({
    include: {
      doctor: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getBookedSlots(doctorId: number, date: string) {
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      date,
      status: {
        not: 'CANCELLED'
      }
    }
  });
  return appointments.map(a => a.time);
}

export async function bookAppointment(data: {
  doctorId: number;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
}) {
  const existing = await prisma.appointment.findFirst({
    where: {
      doctorId: data.doctorId,
      date: data.date,
      time: data.time,
      status: {
        not: 'CANCELLED'
      }
    }
  });

  if (existing) {
    throw new Error('This time slot is already booked.');
  }

  await prisma.appointment.create({
    data: {
      ...data,
      status: 'PENDING'
    }
  });

  revalidatePath('/booking');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateAppointmentStatus(id: number, status: string) {
  await prisma.appointment.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/admin');
}
