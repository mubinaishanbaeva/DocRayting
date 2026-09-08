'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header({ user }: { user?: any }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide header on profile, dashboards, admin, auth pages (they have their own nav)
  if (pathname === '/profile' || pathname.includes('/dashboard') || pathname.includes('/admin') || pathname.includes('/auth')) return null;

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    const baseClasses = "font-label-md text-label-md transition-colors duration-200 pb-1";
    const activeClasses = "text-primary font-bold border-b-2 border-primary";
    const inactiveClasses = "text-on-surface-variant font-medium hover:text-primary border-b-2 border-transparent";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Doctors', path: '/find-doctors' },
    { name: 'Surgeons', path: '/surgeons' },
    { name: 'Clinics', path: '/clinics' },
    { name: 'Pharmacies', path: '/pharmacies' },
  ];

  const getDashboardLink = () => {
    if (!user) return '/auth/login';
    if (user.role === 'ADMIN') return '/admin';
    return '/profile';
  };

  return (
    <header className="bg-surface-container-lowest/80 backdrop-blur-md shadow-sm border-b border-surface-variant/10 top-0 sticky z-50 h-20 flex items-center">
      <div className="flex justify-between items-center w-full px-margin-desktop max-w-7xl mx-auto h-full">
        {/* Brand Logo */}
        <div className="flex items-center gap-md">
          <Link href="/" className="font-headline-md text-headline-md font-bold text-primary tracking-tight select-none">
            DocRayting
          </Link>
          
          <nav className="hidden md:flex items-center gap-md ml-lg">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} className={getLinkClasses(link.path)}>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-sm">
          {!user ? (
            <>
              <Link href="/auth/login" className="text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors">
                Kirish
              </Link>
              <Link href="/auth/register" className="bg-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-md">
                Ro'yxatdan o'tish
              </Link>
            </>
          ) : (
            <Link href={getDashboardLink()} className="bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors shadow-md flex items-center gap-1">
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
              Mening profilim
            </Link>
          )}

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-xs text-on-surface hover:text-primary transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-[28px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-surface-container-lowest border-b border-surface-variant/20 shadow-md md:hidden z-40">
          <nav className="flex flex-col p-md gap-sm">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} onClick={() => setMobileMenuOpen(false)} className="py-sm px-md rounded-lg hover:bg-primary/5">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
