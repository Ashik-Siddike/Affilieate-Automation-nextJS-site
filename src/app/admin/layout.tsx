import Link from 'next/link';
import { cookies } from 'next/headers';
import { logoutAction } from '@/app/admin/actions';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin Panel | Whit Logic',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('admin_token')?.value;
  const isAuthenticated = token === 'authenticated_admin_session';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Sidebar - Only show if authenticated */}
      {isAuthenticated && (
        <aside style={{ width: '250px', background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Admin Panel</h2>
          </div>
          <nav style={{ flex: 1, padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
            <Link href="/admin/reviews" style={{ display: 'block', padding: '12px 24px', color: '#cbd5e1', textDecoration: 'none', fontWeight: 600, borderLeft: '3px solid #f59e0b', background: 'rgba(255,255,255,0.05)' }}>
              Reviews
            </Link>
            
            <div style={{ marginTop: 'auto' }}>
              <Link href="/" style={{ display: 'block', padding: '12px 24px', color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
                ← Back to Site
              </Link>
              <form 
                action={async () => {
                  'use server';
                  await logoutAction();
                  redirect('/admin/login');
                }}
              >
                <button 
                  type="submit" 
                  style={{ 
                    width: '100%', textAlign: 'left', padding: '12px 24px', color: '#ef4444', 
                    background: 'transparent', border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', 
                    cursor: 'pointer', fontWeight: 600, fontSize: '1rem' 
                  }}
                >
                  Logout
                </button>
              </form>
            </div>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: isAuthenticated ? '40px' : '0' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
