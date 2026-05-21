import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
  const query = searchParams.q || '';
  return {
    title: `Search results for "${query}" | Whit Logic`,
    description: `Search results for ${query} on Whit Logic budget tactical watch reviews.`,
    robots: { index: false, follow: true }, // Don't index search results pages
  };
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { modelNumber: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── Premium Search Header ── */}
      <section className="animate-gradient" style={{
        background: 'linear-gradient(-45deg, #0f172a, #1e293b, #0a0f1d, #172554)',
        backgroundSize: '400% 400%',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        <div className="animate-float" style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in-up">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', marginBottom: '16px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Search Results
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            {posts.length} {posts.length === 1 ? 'result' : 'results'} found for <span style={{ color: '#fde68a', fontWeight: 700 }}>"{query}"</span>
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>

        {posts.length === 0 ? (
          <div style={{ background: 'white', padding: '60px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>No reviews found</h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>We couldn't find any watches matching your search. Try different keywords.</p>
            <Link href="/" style={{
              display: 'inline-block', background: '#f59e0b', color: 'white',
              padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none'
            }}>
              Back to Home
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px'
          }}>
            {posts.map((post) => (
              <Link key={post.id} href={`/watch-reviews/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article className="card-hover" style={{
                  background: 'white', borderRadius: '20px', overflow: 'hidden',
                  height: '100%', display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#f1f5f9', overflow: 'hidden' }}>
                    <Image src={post.imageUrl} alt={post.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 300px" className="transition-transform duration-500 hover:scale-105" />
                    {post.isDeal && (
                      <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: '#ef4444', color: 'white', padding: '4px 8px',
                        borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold'
                      }}>
                        {post.discountPercentage ? `🔥 ${post.discountPercentage}% OFF` : '🔥 DEAL'}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{post.brand}</span>
                      <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>★ {post.ratingValue?.toFixed(1) || '4.5'}</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px', lineHeight: 1.4 }}>
                      {post.title}
                    </h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
