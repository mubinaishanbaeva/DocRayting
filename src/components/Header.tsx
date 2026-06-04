'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If we are on the profile page, we might want to hide the standard header,
  // but let's keep it visible or match existing behavior.
  // In the original, if pathname === '/profile' return null; 
  // Let's keep this behavior just in case.
  if (pathname === '/profile') return null;

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
    { name: 'Book Appointment', path: '/booking' },
  ];

  return (
    <header className="bg-surface-container-lowest/80 backdrop-blur-md shadow-sm border-b border-surface-variant/10 top-0 sticky z-50 h-20 flex items-center">
      <div className="flex justify-between items-center w-full px-margin-desktop max-w-7xl mx-auto h-full">
        {/* Brand Logo */}
        <div className="flex items-center gap-md">
          <Link href="/" className="font-headline-md text-headline-md font-bold text-primary tracking-tight select-none">
            DocRayting
          </Link>
          
          {/* Desktop Navigation (6 Links) */}
          <nav className="hidden md:flex items-center gap-md ml-lg">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} className={getLinkClasses(link.path)}>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-sm">
          {/* Profile link */}
          <Link 
            href="/profile" 
            className="flex items-center gap-xs text-primary font-medium px-md py-xs hover:bg-surface-container-low rounded-lg transition-colors font-label-md text-label-md scale-active"
          >
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
            <span className="hidden sm:inline">Profile</span>
          </Link>

          {/* Quick Book Button */}
          <Link 
            href="/booking" 
            className="bg-primary text-on-primary font-bold px-md py-sm rounded-lg hover:bg-primary-container active:scale-95 transition-all font-label-md text-label-md shadow-sm"
          >
            Book Now
          </Link>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-xs text-on-surface hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[28px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-surface-container-lowest border-b border-surface-variant/20 shadow-md md:hidden z-40 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-md gap-sm">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                onClick={() => setMobileMenuOpen(false)}
                className={`py-sm px-md rounded-lg font-label-md text-label-md transition-colors ${
                  pathname === link.path 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-surface-variant/20 my-xs" />
            <Link 
              href="/profile" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-sm py-sm px-md rounded-lg text-primary font-bold font-label-md text-label-md hover:bg-primary/5"
            >
              <span className="material-symbols-outlined">account_circle</span>
              User Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
