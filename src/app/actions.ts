'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { signToken, getSession } from '@/lib/auth';

const prisma = new PrismaClient();

// ─── LEGACY ─────────────────────────────────────────────────────────────────

export async function getDoctors() {
  return await prisma.doctor.findMany();
}

// Tasdiqlangan shifokorlar ro'yxati (sharh uchun)
export async function getApprovedDoctors() {
  return await prisma.doctorProfile.findMany({
    where: { approvalStatus: 'APPROVED' },
    select: { id: true, firstName: true, lastName: true, specialty: true, clinicName: true, rating: true }
  });
}

export async function getApprovedSurgeons() {
  return await prisma.surgeonProfile.findMany({
    where: { approvalStatus: 'APPROVED' },
    select: { id: true, firstName: true, lastName: true, surgicalField: true, clinicName: true, rating: true }
  });
}

export async function getUser() {
  let user = await prisma.user.findUnique({ where: { id: 1 } });
  if (!user) {
    user = await prisma.user.create({ data: { id: 1 } });
  }
  return user;
}

export async function updateUser(data: { firstName: string, lastName: string, email: string, phone: string, image: string, birthDate?: string }) {
  await prisma.user.update({ where: { id: 1 }, data });
  revalidatePath('/profile');
}

export async function getAppointments() {
  return await prisma.appointment.findMany({
    include: { doctor: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getBookedSlots(doctorId: number, date: string) {
  const appointments = await prisma.appointment.findMany({
    where: { doctorId, date, status: { not: 'CANCELLED' } }
  });
  return appointments.map(a => a.time);
}

export async function bookAppointment(data: {
  doctorId: number; patientName: string; patientPhone: string; date: string; time: string;
}) {
  const existing = await prisma.appointment.findFirst({
    where: { doctorId: data.doctorId, date: data.date, time: data.time, status: { not: 'CANCELLED' } }
  });
  if (existing) throw new Error('This time slot is already booked.');
  await prisma.appointment.create({ data: { ...data, status: 'PENDING' } });
  revalidatePath('/booking');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateAppointmentStatus(id: number, status: string) {
  await prisma.appointment.update({ where: { id }, data: { status } });
  revalidatePath('/admin');
}

// ─── AUTH ACTIONS ────────────────────────────────────────────────────────────

export async function registerPatient(data: {
  firstName: string; lastName: string; phone: string; password: string;
}) {
  const existing = await prisma.authUser.findUnique({ where: { phone: data.phone } });
  if (existing) return { error: 'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan.' };

  const passwordHash = await bcrypt.hash(data.password, 10);
  const authUser = await prisma.authUser.create({
    data: { phone: data.phone, passwordHash, role: 'PATIENT', status: 'ACTIVE' }
  });
  await prisma.patient.create({
    data: { authUserId: authUser.id, firstName: data.firstName, lastName: data.lastName }
  });

  const token = signToken({ id: authUser.id, phone: authUser.phone, role: 'PATIENT', status: 'ACTIVE' });
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
  return { success: true, role: 'PATIENT' };
}

export async function registerDoctor(data: {
  firstName: string; lastName: string; phone: string; email: string;
  username: string; password: string; specialty: string; experience: number;
  clinicName: string; bio: string;
}) {
  const existingPhone = await prisma.authUser.findUnique({ where: { phone: data.phone } });
  if (existingPhone) return { error: 'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan.' };
  const existingEmail = await prisma.authUser.findUnique({ where: { email: data.email } });
  if (existingEmail) return { error: 'Bu email allaqachon ro\'yxatdan o\'tgan.' };
  const existingUsername = await prisma.doctorProfile.findUnique({ where: { username: data.username } });
  if (existingUsername) return { error: 'Bu login allaqachon band.' };

  const passwordHash = await bcrypt.hash(data.password, 10);
  const authUser = await prisma.authUser.create({
    data: { phone: data.phone, email: data.email, passwordHash, role: 'DOCTOR', status: 'ACTIVE' }
  });
  await prisma.doctorProfile.create({
    data: {
      authUserId: authUser.id,
      firstName: data.firstName, lastName: data.lastName,
      email: data.email, phone: data.phone, username: data.username,
      specialty: data.specialty, experience: data.experience,
      clinicName: data.clinicName, bio: data.bio,
      approvalStatus: 'PENDING'
    }
  });

  const token = signToken({ id: authUser.id, phone: authUser.phone, role: 'DOCTOR', status: 'ACTIVE' });
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
  return { success: true, role: 'DOCTOR' };
}

export async function registerSurgeon(data: {
  firstName: string; lastName: string; middleName: string;
  phone: string; email: string; username: string; password: string;
  surgicalField: string; experience: number; clinicName: string;
  clinicAddress: string; licenseNumber: string; bio: string;
  ref1Name: string; ref1Phone: string; ref2Name: string; ref2Phone: string;
  securityAnswer: string;
}) {
  const existingPhone = await prisma.authUser.findUnique({ where: { phone: data.phone } });
  if (existingPhone) return { error: 'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan.' };
  const existingEmail = await prisma.authUser.findUnique({ where: { email: data.email } });
  if (existingEmail) return { error: 'Bu email allaqachon ro\'yxatdan o\'tgan.' };
  const existingLicense = await prisma.surgeonProfile.findUnique({ where: { licenseNumber: data.licenseNumber } });
  if (existingLicense) return { error: 'Bu litsenziya raqami allaqachon mavjud.' };
  const existingUsername = await prisma.surgeonProfile.findUnique({ where: { username: data.username } });
  if (existingUsername) return { error: 'Bu login allaqachon band.' };

  const passwordHash = await bcrypt.hash(data.password, 10);
  const securityHash = await bcrypt.hash(data.securityAnswer.toLowerCase(), 10);
  const authUser = await prisma.authUser.create({
    data: { phone: data.phone, email: data.email, passwordHash, role: 'SURGEON', status: 'ACTIVE' }
  });
  await prisma.surgeonProfile.create({
    data: {
      authUserId: authUser.id,
      firstName: data.firstName, lastName: data.lastName, middleName: data.middleName,
      email: data.email, phone: data.phone, username: data.username,
      surgicalField: data.surgicalField, experience: data.experience,
      clinicName: data.clinicName, clinicAddress: data.clinicAddress,
      licenseNumber: data.licenseNumber, bio: data.bio,
      ref1Name: data.ref1Name, ref1Phone: data.ref1Phone,
      ref2Name: data.ref2Name, ref2Phone: data.ref2Phone,
      securityAnswer: securityHash,
      approvalStatus: 'PENDING'
    }
  });

  const token = signToken({ id: authUser.id, phone: authUser.phone, role: 'SURGEON', status: 'ACTIVE' });
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
  return { success: true, role: 'SURGEON' };
}

export async function loginUser(data: { phone: string; password: string }) {
  const authUser = await prisma.authUser.findUnique({ where: { phone: data.phone } });
  if (!authUser) return { error: 'Telefon raqam yoki parol noto\'g\'ri.' };
  if (authUser.status === 'BLOCKED') return { error: 'Hisobingiz bloklangan. Admin bilan bog\'laning.' };

  const valid = await bcrypt.compare(data.password, authUser.passwordHash);
  if (!valid) return { error: 'Telefon raqam yoki parol noto\'g\'ri.' };

  const token = signToken({
    id: authUser.id, phone: authUser.phone,
    role: authUser.role as any, status: authUser.status
  });
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
  return { success: true, role: authUser.role };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  return { success: true };
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const authUser = await prisma.authUser.findUnique({ where: { id: session.id } });
  if (!authUser) return null;

  if (authUser.role === 'PATIENT') {
    const patient = await prisma.patient.findUnique({ where: { authUserId: authUser.id } });
    return { ...authUser, profile: patient };
  }
  if (authUser.role === 'DOCTOR') {
    const doctor = await prisma.doctorProfile.findUnique({ where: { authUserId: authUser.id } });
    return { ...authUser, profile: doctor };
  }
  if (authUser.role === 'SURGEON') {
    const surgeon = await prisma.surgeonProfile.findUnique({ where: { authUserId: authUser.id } });
    return { ...authUser, profile: surgeon };
  }
  return authUser;
}

// ─── PROFILE UPDATES ─────────────────────────────────────────────────────────

export async function updatePatientProfile(data: {
  firstName: string; lastName: string; birthDate?: string;
  bloodGroup?: string; allergies?: string; image?: string;
}) {
  const session = await getSession();
  if (!session) return { error: 'Kirish talab qilinadi.' };
  await prisma.patient.update({ where: { authUserId: session.id }, data });
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateDoctorProfile(data: {
  firstName?: string; lastName?: string; bio?: string;
  clinicName?: string; specialty?: string; image?: string;
}) {
  const session = await getSession();
  if (!session) return { error: 'Kirish talab qilinadi.' };
  await prisma.doctorProfile.update({ where: { authUserId: session.id }, data });
  revalidatePath('/doctor/dashboard');
  return { success: true };
}

export async function updateSurgeonProfile(data: {
  firstName?: string; lastName?: string; bio?: string;
  clinicName?: string; image?: string;
}) {
  const session = await getSession();
  if (!session) return { error: 'Kirish talab qilinadi.' };
  await prisma.surgeonProfile.update({ where: { authUserId: session.id }, data });
  revalidatePath('/surgeon/dashboard');
  return { success: true };
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

export async function addReview(data: {
  stars: number; comment: string; doctorProfileId?: number; surgeonProfileId?: number;
}) {
  const session = await getSession();
  if (!session || session.role !== 'PATIENT') return { error: 'Faqat bemorlar sharh qoldira oladi.' };
  const patient = await prisma.patient.findUnique({ where: { authUserId: session.id } });
  if (!patient) return { error: 'Bemor profili topilmadi. Qaytadan kiring.' };

  // Shifokor yoki jarroh mavjudligini tekshirish
  if (data.doctorProfileId) {
    const doctorExists = await prisma.doctorProfile.findUnique({ where: { id: data.doctorProfileId } });
    if (!doctorExists) return { error: `ID ${data.doctorProfileId} bo'yicha shifokor topilmadi. To'g'ri ID kiriting.` };
  }
  if (data.surgeonProfileId) {
    const surgeonExists = await prisma.surgeonProfile.findUnique({ where: { id: data.surgeonProfileId } });
    if (!surgeonExists) return { error: `ID ${data.surgeonProfileId} bo'yicha jarroh topilmadi. To'g'ri ID kiriting.` };
  }

  if (!data.doctorProfileId && !data.surgeonProfileId) {
    return { error: 'Shifokor yoki jarroh ID si kiritilmadi.' };
  }

  await prisma.review.create({
    data: { 
      stars: data.stars, 
      comment: data.comment, 
      patientId: patient.id, 
      doctorProfileId: data.doctorProfileId, 
      surgeonProfileId: data.surgeonProfileId 
    }
  });

  // O'rtacha ratingni yangilash
  if (data.doctorProfileId) {
    const reviews = await prisma.review.findMany({ where: { doctorProfileId: data.doctorProfileId } });
    const avg = reviews.reduce((s, r) => s + r.stars, 0) / reviews.length;
    await prisma.doctorProfile.update({ where: { id: data.doctorProfileId }, data: { rating: avg, reviewCount: reviews.length } });
  }
  if (data.surgeonProfileId) {
    const reviews = await prisma.review.findMany({ where: { surgeonProfileId: data.surgeonProfileId } });
    const avg = reviews.reduce((s, r) => s + r.stars, 0) / reviews.length;
    await prisma.surgeonProfile.update({ where: { id: data.surgeonProfileId }, data: { rating: avg, reviewCount: reviews.length } });
  }
  return { success: true };
}

// ─── ADMIN ───────────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return null;

  const [patients, doctors, surgeons, appointments, pendingDoctors, pendingSurgeons] = await Promise.all([
    prisma.patient.count(),
    prisma.doctorProfile.count(),
    prisma.surgeonProfile.count(),
    prisma.appointment.count(),
    prisma.doctorProfile.count({ where: { approvalStatus: 'PENDING' } }),
    prisma.surgeonProfile.count({ where: { approvalStatus: 'PENDING' } }),
  ]);

  return { patients, doctors, surgeons, appointments, pendingDoctors, pendingSurgeons };
}

export async function getAllUsers() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return null;
  return await prisma.authUser.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getPendingDoctors() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return null;
  return await prisma.doctorProfile.findMany({ where: { approvalStatus: 'PENDING' } });
}

export async function getPendingSurgeons() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return null;
  return await prisma.surgeonProfile.findMany({ where: { approvalStatus: 'PENDING' } });
}

export async function approveDoctorProfile(id: number, approved: boolean) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return { error: 'Ruxsat yo\'q.' };
  await prisma.doctorProfile.update({
    where: { id },
    data: { approvalStatus: approved ? 'APPROVED' : 'REJECTED' }
  });
  revalidatePath('/admin');
  return { success: true };
}

export async function approveSurgeonProfile(id: number, approved: boolean) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return { error: 'Ruxsat yo\'q.' };
  await prisma.surgeonProfile.update({
    where: { id },
    data: { approvalStatus: approved ? 'APPROVED' : 'REJECTED' }
  });
  revalidatePath('/admin');
  return { success: true };
}

export async function toggleBlockUser(id: number, block: boolean) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return { error: 'Ruxsat yo\'q.' };
  await prisma.authUser.update({ where: { id }, data: { status: block ? 'BLOCKED' : 'ACTIVE' } });
  revalidatePath('/admin');
  return { success: true };
}
