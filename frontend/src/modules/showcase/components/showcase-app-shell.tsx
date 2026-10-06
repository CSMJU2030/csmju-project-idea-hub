'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  AddIcon,
  ArrowBackIcon,
  CheckIcon,
  CloseIcon,
  DashboardIcon,
  GroupIcon,
  LogoutIcon,
  MenuBookIcon,
  MenuIcon,
  NotificationsIcon,
  SchoolIcon,
  SearchIcon,
  TrendingUpIcon,
} from './icons';
import { UserContext } from '../types/domain';

interface NavItem {
  href: string;
  label: string;
  labelEn: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/showcase', label: 'ผลงานและโครงงาน', labelEn: 'Projects', Icon: MenuBookIcon },
  { href: '/showcase/ideas', label: 'คลังไอเดีย', labelEn: 'Idea Bank', Icon: DashboardIcon },
  { href: '/showcase/approvals', label: 'ตรวจสอบผลงาน', labelEn: 'Approvals', Icon: CheckIcon },
  { href: '/showcase/advisor', label: 'อาจารย์ที่ปรึกษา', labelEn: 'Advisors', Icon: SchoolIcon },
  { href: '/showcase/alumni', label: 'ทำเนียบศิษย์เก่า', labelEn: 'Alumni', Icon: GroupIcon },
  { href: '/showcase/admin/dashboard', label: 'สถิติและรายงาน', labelEn: 'Analytics', Icon: TrendingUpIcon },
];

const FOOTER_LINKS = [
  'ติดต่อเรา',
  'นโยบายความเป็นส่วนตัว',
  'ทำเนียบบุคลากร',
  'ปฏิทินการศึกษา',
];

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'ผู้ดูแลระบบ',
  TEACHER: 'อาจารย์ที่ปรึกษา',
  STUDENT: 'นักศึกษา',
  ALUMNI: 'ศิษย์เก่า',
};

interface ShowcaseAppShellProps {
  user: UserContext | null;
  children: React.ReactNode;
}

export function ShowcaseAppShell({ user, children }: ShowcaseAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();

  const closeNav = () => setNavOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      router.push('/showcase');
      return;
    }
    router.push(`/showcase?keyword=${encodeURIComponent(searchTerm.trim())}`);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'CS';
    return name.slice(0, 2).toUpperCase();
  };

  const loginUrl = `/auth/login?next=${encodeURIComponent(pathname || '/showcase')}`;

  const coreHubWebUrl =
    process.env.NEXT_PUBLIC_CORE_HUB_WEB_URL || process.env.CORE_HUB_WEB_URL || 'http://localhost:3000';

  return (
    <div className="flex min-h-dvh w-full bg-background text-on-surface">
      {/* Mobile drawer scrim */}
      <button
        type="button"
        onClick={closeNav}
        aria-label="ปิดเมนูนำทาง"
        tabIndex={navOpen ? 0 : -1}
        className={`fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 md:hidden ${
          navOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`brand-gradient fixed left-0 top-0 z-30 flex h-dvh w-64 flex-col py-4 shadow-xl transition-transform duration-300 ease-out md:translate-x-0 ${
          navOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 shrink-0 px-4 pt-2">
          {/* Logo container (framed white box matching Core Hub BackOffice standard) */}
          <div className="mb-4 flex items-center justify-between gap-2">
            <Link
              href="/showcase"
              onClick={closeNav}
              className="flex w-full flex-col items-center justify-center rounded-xl bg-white p-3 shadow-sm transition-transform hover:scale-[1.01]"
            >
              <Image
                src="/csmju-logo.png"
                alt="โลโก้ สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยแม่โจ้"
                width={200}
                height={140}
                priority
                className="h-auto w-full max-w-[120px] object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={closeNav}
              aria-label="ปิดเมนู"
              className="self-start rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4 text-center">
            <h2 className="font-display text-label-md font-bold text-white">
              CSMJU Showcase
            </h2>
            <p className="text-caption text-primary-fixed">
              คลังผลงานและวิทยานิพนธ์
            </p>
          </div>

          {/* Back to CSMJU Portal link (Standards 1.7.3 / ui-design-system 5.1) */}
          {coreHubWebUrl && (
            <a
              href={coreHubWebUrl}
              className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-label-md text-white/90 transition-colors hover:bg-white/20 hover:text-white"
            >
              <ArrowBackIcon className="h-4 w-4 shrink-0" />
              <span>กลับ CSMJU Portal</span>
            </a>
          )}

          {/* Primary Action Button */}
          <Link
            href="/showcase/new"
            onClick={closeNav}
            className="btn-gradient flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-label-md text-white shadow-md"
          >
            <AddIcon className="h-4 w-4" />
            <span>ส่งผลงานใหม่</span>
          </Link>
        </div>

        {/* Navigation items (scrolls independently so logout stays pinned) */}
        <nav className="mt-1 min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ href, label, labelEn, Icon }) => {
              const active =
                href === '/showcase'
                  ? pathname === href
                  : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeNav}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 py-3 duration-200 ${
                      active
                        ? 'border-l-4 border-accent bg-white/10 pl-6 text-white font-semibold'
                        : 'pl-7 text-white/70 transition-all hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="text-label-md">{label}</span>
                    <span className="text-caption text-white/50">{labelEn}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User session / Logout in sidebar (pinned at bottom) */}
        <div className="mx-4 mt-auto shrink-0 pt-4 border-t border-white/10">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 rounded-lg bg-white/10 p-2.5 backdrop-blur-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-label-sm font-bold text-white shadow-sm">
                  {getInitials(user.name)}
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-label-md font-medium text-white">
                    {user.name}
                  </p>
                  <p className="text-caption text-primary-fixed">
                    {ROLE_LABELS[user.role] || user.role}
                  </p>
                </div>
              </div>

              {/* Sign out form via POST /auth/logout per Standards 1.7.2 */}
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 py-2 text-label-md text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <LogoutIcon className="h-4 w-4" />
                  <span>ออกจากระบบ</span>
                </button>
              </form>
            </div>
          ) : (
            <a
              href={loginUrl}
              className="btn-gradient flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-label-md text-white shadow-md"
            >
              <span>เข้าสู่ระบบ Core Hub</span>
            </a>
          )}
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="ml-0 flex min-h-dvh flex-1 flex-col md:ml-64">
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between gap-4 border-b border-surface-variant bg-surface-container-lowest px-4 shadow-sm md:px-12">
          {/* Mobile menu button and brand name */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="เปิดเมนู"
              className="rounded-lg p-2 text-on-surface transition-colors hover:bg-surface-variant/50"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <Link href="/showcase" className="text-gradient font-display text-headline-md font-bold">
              CSMJU Showcase
            </Link>
          </div>

          {/* Desktop Search bar */}
          <form
            onSubmit={handleSearch}
            role="search"
            aria-label="ค้นหาผลงานและโครงงาน"
            className="relative mx-auto hidden max-w-md flex-1 items-center md:flex"
          >
            <SearchIcon className="pointer-events-none absolute left-3.5 h-4 w-4 text-outline" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาโครงงาน, คำสำคัญ, ผู้พัฒนา..."
              aria-label="ค้นหาโครงงาน"
              className="w-full rounded-full border border-outline-variant/60 bg-surface py-2 pl-10 pr-4 text-body-md text-on-surface transition-colors focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
            />
          </form>

          {/* Topbar Right Controls */}
          <div className="flex items-center gap-3 text-on-surface-variant">
            <button
              type="button"
              aria-label="การแจ้งเตือน"
              className="relative rounded-full p-2 transition-colors hover:bg-surface-variant/50 hover:text-primary-container active:opacity-80"
            >
              <NotificationsIcon className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
            </button>

            {user ? (
              <div
                title={user.email}
                className="flex items-center gap-2.5 rounded-full p-1"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/40 bg-primary-container text-label-md text-white shadow-sm font-semibold">
                  {getInitials(user.name)}
                </span>
                <div className="hidden flex-col leading-tight md:flex">
                  <span className="text-label-md font-semibold text-on-surface">
                    {user.name}
                  </span>
                  <span className="text-caption text-secondary">
                    {ROLE_LABELS[user.role] || user.role}
                  </span>
                </div>
              </div>
            ) : (
              <a
                href={loginUrl}
                className="btn-gradient hidden items-center justify-center rounded-lg px-4 py-2 text-label-md text-white shadow-sm md:inline-flex"
              >
                เข้าสู่ระบบ SSO
              </a>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main id="main" className="mx-auto w-full max-w-[1280px] flex-1 space-y-8 p-4 md:p-12">
          {children}
        </main>

        {/* Academic Standard Footer */}
        <footer className="mt-auto w-full border-t border-outline-variant/30 bg-surface-container-low py-8">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-6 px-4 md:grid-cols-2 md:px-12">
            <div>
              <p className="font-semibold text-body-md text-brand-navy">
                Computer Science, Maejo University
              </p>
              <p className="text-caption text-secondary mt-0.5">
                © 2026 สาขาวิชาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์ มหาวิทยาลัยแม่โจ้
              </p>
            </div>
            <div className="flex flex-wrap gap-6 md:justify-end">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-label-sm text-secondary transition-colors hover:text-primary-container hover:underline"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
