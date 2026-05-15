'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  if (pathname === '/profile') return null;

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    const baseClasses = "transition-all font-body-md text-body-md pb-1 border-b-2";
    const activeClasses = "text-primary font-bold border-primary";
    const inactiveClasses = "text-secondary dark:text-secondary-fixed-dim hover:text-primary-container border-transparent";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <header className="w-full top-0 sticky bg-surface-container-lowest dark:bg-surface-dim shadow-sm z-50">
      <div className="flex justify-between items-center px-ds-gutter py-ds-md max-w-7xl mx-auto">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">
          DocRayting
        </Link>
        <nav className="hidden md:flex items-center gap-ds-xl">
          <Link className={getLinkClasses('/')} href="/">
            Home
          </Link>
          <Link className={getLinkClasses('/booking')} href="/booking">
            Services
          </Link>
          <Link className={getLinkClasses('/about')} href="/about">
            About Us
          </Link>
        </nav>
        <div className="flex items-center gap-ds-md">
          <Link href="/profile" className="flex items-center gap-1 text-primary hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors font-label-md">
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
            <span className="hidden sm:inline">Profile</span>
          </Link>
          <Link href="/booking" className="bg-primary-container text-white px-ds-lg py-ds-sm rounded-lg font-label-md text-label-md active:scale-95 duration-200 transition-all hover:bg-primary">
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
