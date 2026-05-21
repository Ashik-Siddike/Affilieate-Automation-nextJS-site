import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteButton from '@/components/admin/DeleteButton';

// Prevent static rendering since we want real-time admin data
export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Manage Reviews</h1>
        <Link 
          href="/admin/reviews/new" 
          style={{ 
            background: '#f59e0b', color: 'white', padding: '10px 20px', 
            borderRadius: '8px', textDecoration: 'none', fontWeight: 600 
          }}
        >
          + Add New Review
        </Link>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Title</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Brand</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Category</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Date</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                  No reviews found. Click "Add New Review" to create one.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px', fontWeight: 500, color: '#0f172a' }}>
                    {post.title}
                    {post.isDeal && <span style={{ marginLeft: '8px', background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>Deal</span>}
                  </td>
                  <td style={{ padding: '16px', color: '#64748b' }}>{post.brand}</td>
                  <td style={{ padding: '16px', color: '#64748b', textTransform: 'capitalize' }}>{post.category}</td>
                  <td style={{ padding: '16px', color: '#64748b' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <Link 
                      href={`/admin/reviews/${post.id}`} 
                      style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600, marginRight: '16px' }}
                    >
                      Edit
                    </Link>
                    <Link 
                      href={`/watch-reviews/${post.slug}`} 
                      target="_blank"
                      style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600, marginRight: '16px' }}
                    >
                      View ↗
                    </Link>
                    <DeleteButton id={post.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
