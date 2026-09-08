'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on profile, auth, admin pages
  if (pathname === '/profile' || pathname.includes('/auth') || pathname.includes('/admin') || pathname.includes('/dashboard')) return null;

  return (
    <footer className="bg-surface-container border-t border-outline-variant py-xl mt-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg px-margin-desktop max-w-7xl mx-auto">
        {/* Brand Column */}
        <div className="col-span-2 md:col-span-1">
          <div className="font-headline-md text-headline-md font-bold text-primary mb-md">
            DocRayting
          </div>
          <p className="text-on-surface-variant font-body-sm text-body-sm mb-lg leading-relaxed">
            Precision healthcare search engine empowering patients with verified data, real ratings, and instant booking at top-tier facilities.
          </p>
        </div>

        {/* Platform Column */}
        <div>
          <h4 className="font-label-md text-label-md text-on-surface font-semibold mb-md">Platform</h4>
          <ul className="space-y-sm">
            <li>
              <Link href="/find-doctors" className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary hover:underline underline-offset-4 transition-all">
                Search Specialists
              </Link>
            </li>
            <li>
              <Link href="/clinics" className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary hover:underline underline-offset-4 transition-all">
                Partner Clinics
              </Link>
            </li>
            <li>
              <Link href="/pharmacies" className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary hover:underline underline-offset-4 transition-all">
                Access Pharmacies
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h4 className="font-label-md text-label-md text-on-surface font-semibold mb-md">Resources</h4>
          <ul className="space-y-sm">
            <li>
              <Link href="/booking" className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary hover:underline underline-offset-4 transition-all">
                AI Symptom Assistant
              </Link>
            </li>
            <li>
              <a href="#" className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary hover:underline underline-offset-4 transition-all">
                Doctor Schedules (Closed)
              </a>
            </li>
            <li>
              <a href="#" className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary hover:underline underline-offset-4 transition-all">
                Patient Portal
              </a>
            </li>
          </ul>
        </div>

        {/* Contact/Social Column */}
        <div>
          <h4 className="font-label-md text-label-md text-on-surface font-semibold mb-md">Contact Us</h4>
          <p className="text-on-surface-variant font-body-sm text-body-sm mb-sm">
            support@docrayting.com
          </p>
          <div className="flex gap-sm mt-md">
            <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors text-[22px]">
              social_leaderboard
            </span>
            <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors text-[22px]">
              share
            </span>
            <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors text-[22px]">
              public
            </span>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-margin-desktop mt-xl pt-lg border-t border-outline-variant/30 text-center">
        <p className="text-on-surface-variant font-body-sm text-body-sm opacity-60">
          © {new Date().getFullYear()} DocRayting. Advanced Precision Healthcare. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
