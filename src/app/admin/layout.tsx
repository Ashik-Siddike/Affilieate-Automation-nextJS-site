import Link from 'next/link';

export const metadata = {
  title: 'Admin Panel | Whit Logic',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Admin Panel</h2>
        </div>
        <nav style={{ flex: 1, padding: '24px 0' }}>
          <Link href="/admin/reviews" style={{ display: 'block', padding: '12px 24px', color: '#cbd5e1', textDecoration: 'none', fontWeight: 600, borderLeft: '3px solid #f59e0b', background: 'rgba(255,255,255,0.05)' }}>
            Reviews
          </Link>
          <Link href="/" style={{ display: 'block', padding: '12px 24px', color: '#94a3b8', textDecoration: 'none', fontWeight: 500, marginTop: 'auto' }}>
            ← Back to Site
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '40px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
