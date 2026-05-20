import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Allowed categories mapping for nice titles
const CATEGORY_MAP: Record<string, string> = {
  'tactical': 'Best Tactical & Military Watches',
  'budget-under-20': 'Best Watches Under $20',
  'waterproof': 'Best Waterproof & Dive Watches',
  'sports': 'Best Sports & Fitness Watches',
  'digital': 'Best Digital Watches'
};

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const cat = params.category.toLowerCase();
  const title = CATEGORY_MAP[cat] || `Best ${cat.replace(/-/g, ' ')} Watches`;
  
  return {
    title: `${title} | Whit Logic Reviews`,
    description: `Independent reviews of the ${title.toLowerCase()}. We test the best budget options from SKMEI, CURREN, and more.`,
    alternates: { canonical: `https://whitlogic.online/watches/${cat}` },
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categorySlug = params.category.toLowerCase();
  
  // If not a known category, let them see it anyway, but with a generic title
  const pageTitle = CATEGORY_MAP[categorySlug] || `Best ${categorySlug.replace(/-/g, ' ')} Watches`;

  const posts = await prisma.post.findMany({
    where: {
      category: categorySlug
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── Premium Category Header ── */}
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
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '999px', padding: '6px 16px', marginBottom: '16px',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#fde68a', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Category
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: 'white', marginBottom: '16px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {pageTitle}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Discover our top picks and in-depth reviews for {pageTitle.toLowerCase()}. Tested for durability and value.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>

        {posts.length === 0 ? (
          <div style={{ background: 'white', padding: '60px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🕒</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Coming Soon</h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>We are currently testing watches for this category. Check back soon!</p>
            <Link href="/" style={{
              display: 'inline-block', background: '#0f172a', color: 'white',
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
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#f1f5f9', overflow: 'hidden' }}>
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
