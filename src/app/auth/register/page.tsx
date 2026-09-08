'use client';
import Link from 'next/link';

const roles = [
  {
    id: 'patient',
    title: 'Bemor',
    subtitle: 'Shifokorga yozilish va davolanish',
    icon: 'personal_injury',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    features: ['Tez ro\'yxatdan o\'tish', 'Shifokorga yozilish', 'Sharh va baho qoldirish', 'Profil tahrirlash'],
    href: '/auth/register/patient',
  },
  {
    id: 'doctor',
    title: 'Shifokor',
    subtitle: 'Professional tibbiy xizmat ko\'rsatish',
    icon: 'stethoscope',
    color: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
    features: ['Mutaxassislik va tajriba', 'Sertifikatlar yuklash', 'Bemorlar qabul qilish', 'Admin tasdiqidan o\'tish'],
    href: '/auth/register/doctor',
  },
  {
    id: 'surgeon',
    title: 'Jarroh',
    subtitle: 'Maxsus xavfsizlik va litsenziya talab qilinadi',
    icon: 'surgical',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10 border-violet-500/20',
    features: ['Kengaytirilgan tekshiruv', 'Litsenziya raqami', 'Ikki tasdiqlash', 'Maxsus xavfsizlik'],
    href: '/auth/register/surgeon',
  },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 py-16">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-48 -mt-48 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -mr-48 -mb-48 pointer-events-none"></div>

      <div className="relative w-[100%] min-w-[350px] max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]">medical_services</span>
            </div>
            <span className="text-2xl font-extrabold text-white">DocRayting</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-white">Kim sifatida ro'yxatdan o'tasiz?</h1>
          <p className="text-slate-400 mt-3 text-lg">Rolingizni tanlang va mos keladigan forma bilan davom eting</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Link
              key={role.id}
              href={role.href}
              className={`group relative bg-white/5 backdrop-blur-xl border ${role.bg} rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl cursor-pointer`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-white text-[32px]">{role.icon}</span>
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-1">{role.title}</h2>
              <p className="text-slate-400 text-sm mb-6">{role.subtitle}</p>

              <ul className="space-y-2 mb-8">
                {role.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${role.color} text-white font-bold py-3 rounded-xl group-hover:opacity-90 transition-all`}>
                <span>Ro'yxatdan o'tish</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-slate-500 mt-8">
          Hisobingiz bormi?{' '}
          <Link href="/auth/login" className="text-blue-400 hover:underline font-semibold">Kirish</Link>
        </p>
      </div>
    </div>
  );
}
