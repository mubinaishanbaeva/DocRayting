'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname === '/profile') return null;

  return (
    <footer className="w-full mt-ds-xxl bg-surface-container dark:bg-surface-container-highest">
      <div className="flex flex-col md:flex-row justify-between items-start px-ds-gutter py-ds-xl max-w-7xl mx-auto gap-ds-lg">
        <div className="space-y-ds-md max-w-xs">
          <div className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed-dim">DocRayting</div>
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-secondary-fixed-variant">
            Making healthcare accessible and efficient for everyone. Your health, our priority.
          </p>
          <div className="flex gap-ds-md">
            <Link className="text-primary hover:scale-110 transition-transform" href="#"><span className="material-symbols-outlined">public</span></Link>
            <Link className="text-primary hover:scale-110 transition-transform" href="#"><span className="material-symbols-outlined">alternate_email</span></Link>
            <Link className="text-primary hover:scale-110 transition-transform" href="#"><span className="material-symbols-outlined">share</span></Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-ds-xl w-full md:w-auto">
          <div className="space-y-ds-sm">
            <h6 className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">Contact Info</h6>
            <ul className="space-y-ds-xs">
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:underline transition-all" href="#">Support Center</Link></li>
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:underline transition-all" href="#">Emergency Hotlines</Link></li>
            </ul>
          </div>
          <div className="space-y-ds-sm">
            <h6 className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">Quick Links</h6>
            <ul className="space-y-ds-xs">
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:underline transition-all" href="/booking">Find Doctors</Link></li>
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:underline transition-all" href="#">Medical Blogs</Link></li>
            </ul>
          </div>
          <div className="space-y-ds-sm">
            <h6 className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">Legal</h6>
            <ul className="space-y-ds-ds-xs">
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:underline transition-all" href="#">Privacy Policy</Link></li>
              <li><Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:underline transition-all" href="#">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-ds-gutter py-ds-lg border-t border-outline-variant/30 text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-secondary-fixed-variant">© 2024 DocRayting. All rights reserved.</p>
      </div>
    </footer>
  );
}
