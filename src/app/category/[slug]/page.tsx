import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `Best ${categoryName} Watches — Whit Logic Reviews`,
    description: `Discover the best budget ${categoryName} watches. We independently review top brands to help you find durable gear.`,
  };
}

function StarRating({ rating = 4.5 }: { rating?: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span aria-label={`${rating} out of 5 stars`} style={{ color: '#f59e0b', fontSize: '0.85rem', letterSpacing: '1px' }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
      <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '4px', letterSpacing: 'normal' }}>({rating})</span>
    </span>
  );
}

function ReadingTime({ content }: { content?: string }) {
  const words = content?.replace(/<[^>]*>/g, '').split(' ').length || 800;
  const mins = Math.max(3, Math.ceil(words / 200));
  return <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>⏱ {mins} min read</span>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  const posts = await prisma.post.findMany({
    where: { category: { equals: slug, mode: 'insensitive' } },
    orderBy: { createdAt: 'desc' },
  });

  // Remove notFound() to show the "Coming soon" UI instead
  // if (posts.length === 0) {
  //   notFound();
  // }

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* ══ HERO SECTION ══ */}
      <section className="animate-gradient" style={{
        background: 'linear-gradient(-45deg, #0f172a, #1e293b, #0a0f1d, #172554)',
        backgroundSize: '400% 400%',
        padding: '100px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', color: 'white', marginBottom: '16px' }}>
            Best <span style={{ color: '#f59e0b' }}>{categoryName}</span> Watches
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            We've tested and reviewed the top {slug} watches on the market. Find the perfect balance of durability, features, and budget.
          </p>
        </div>
      </section>

      {/* ══ GRID SECTION ══ */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 80px' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🕐</div>
            <h3 style={{ fontSize: '1.3rem', color: '#475569', fontWeight: '600' }}>Reviews coming soon!</h3>
            <p style={{ color: '#94a3b8', marginTop: '8px' }}>We are currently testing watches for the {categoryName} category. Check back soon.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {posts.map((post, i) => (
              <article
                key={post.id}
                className="card-hover"
                style={{
                  background: 'white', borderRadius: '20px', overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0',
                  display: 'flex', flexDirection: 'column',
                  animation: `fadeInUp 0.5s ease-out ${i * 0.05}s both`,
                }}
              >
                <Link href={`/watch-reviews/${post.slug}`} style={{ textDecoration: 'none', display: 'block', position: 'relative', aspectRatio: '1 / 1', height: 'auto' }}>
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                    <span style={{
                      background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)',
                      color: 'white', padding: '3px 10px', borderRadius: '999px',
                      fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{post.brand}</span>
                  </div>
                </Link>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <StarRating rating={post.ratingValue || 4.5} />
                    <ReadingTime content={post.content} />
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.4, marginBottom: '8px' }}>
                    <Link href={`/watch-reviews/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {post.title}
                    </Link>
                  </h3>

                  <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <Link
                      href={`/watch-reviews/${post.slug}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        color: '#f59e0b', fontWeight: '700', fontSize: '0.82rem', textDecoration: 'none',
                      }}
                    >
                      Read Review <span style={{ fontSize: '1rem' }}>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
