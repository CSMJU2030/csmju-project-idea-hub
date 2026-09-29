import Link from "next/link";

export default function ShowcaseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/showcase" className="brand">CSMJU Showcase<small>สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยแม่โจ้</small></Link>
          <nav className="main-nav" aria-label="เมนูหลัก">
            <Link href="/showcase">ผลงาน</Link><Link href="/showcase/ideas">คลังไอเดีย</Link><Link href="/showcase/portfolio/demo">Portfolio</Link><Link href="/showcase/new">ส่งผลงาน</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}