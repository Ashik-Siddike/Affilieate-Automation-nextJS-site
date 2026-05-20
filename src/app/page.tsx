import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Whit Logic — Best Budget Tactical & Sports Watches Reviewed',
  description:
    'Discover the best budget tactical and sports watches. We independently review top brands like SKMEI and CURREN to help you find durable gear under $50.',
  alternates: { canonical: 'https://whitlogic.online' },
};

export const revalidate = 3600;

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

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 12,
  });

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  const stats = [
    { value: posts.length + '+', label: 'Reviews Published' },
    { value: '4.8★', label: 'Average Rating' },
    { value: '100%', label: 'Independent Testing' },
    { value: '<$50', label: 'Budget Focused' },
  ];

  const categories = ['All', 'Tactical', 'Sports', 'Military', 'Dive', 'Smart'];

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>

      {/* ══ HERO SECTION ══ */}
      <section className="animate-gradient" style={{
        background: 'linear-gradient(-45deg, #0f172a, #1e293b, #0a0f1d, #172554)',
        backgroundSize: '400% 400%',
        padding: '100px 24px 120px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative dots */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        {/* Amber glow */}
        <div className="animate-float" style={{
          position: 'absolute', top: '-150px', right: '-150px',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }} className="animate-fade-in-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: '999px', padding: '6px 16px', marginBottom: '24px',
          }}>
            <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              🔥 Trusted by 50,000+ Shoppers
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: '900',
            color: 'white',
            lineHeight: 1.15,
            marginBottom: '20px',
            letterSpacing: '-0.03em',
          }}>
            Find Your Perfect Watch.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Spend Less.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#94a3b8',
            maxWidth: '600px',
            margin: '0 auto 36px',
            lineHeight: 1.7,
          }}>
            Independent, hands-on reviews of the best budget tactical and sports watches.
            Real tests. Honest verdicts. No fluff.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#reviews"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                color: 'white', padding: '14px 32px', borderRadius: '12px',
                fontWeight: '700', fontSize: '1rem', textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(245,158,11,0.35)',
                transition: 'all 0.2s',
              }}
            >
              Browse Reviews →
            </a>
            <a
              href="#trending"
              style={{
                background: 'rgba(255,255,255,0.08)', color: 'white',
                padding: '14px 32px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)',
                fontWeight: '600', fontSize: '1rem', textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              🔥 Trending
            </a>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="glass-dark" style={{
          maxWidth: '850px', margin: '60px auto 0',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative', zIndex: 1,
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ padding: '24px 16px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#fde68a', lineHeight: 1, textShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURED POST ══ */}
      {featuredPost && (
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: 'white', padding: '4px 14px', borderRadius: '999px',
              fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>⚡ Editor's Pick</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Featured Review</h2>
          </div>

          <Link href={`/watch-reviews/${featuredPost.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <article className="card-hover" style={{
              background: 'white', borderRadius: '24px', overflow: 'hidden',
              display: 'grid', gridTemplateColumns: '1fr 1fr',
            }}
            >
              <div style={{ position: 'relative', minHeight: '320px' }}>
                <Image
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority
                />
                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)',
                  color: 'white', padding: '4px 12px', borderRadius: '999px',
                  fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>{featuredPost.brand}</div>
              </div>
              <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '600' }}>
                    📋 Model: {featuredPost.modelNumber}
                  </span>
                  <ReadingTime />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.3, marginBottom: '12px' }}>
                  {featuredPost.title}
                </h3>
                <StarRating />
                <p style={{ color: '#64748b', lineHeight: 1.7, marginTop: '16px', fontSize: '0.95rem' }}>
                  Read our comprehensive hands-on review of the {featuredPost.brand} {featuredPost.modelNumber}. 
                  We tested durability, accuracy, and value for money.
                </p>
                <div style={{
                  marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: 'white', padding: '12px 24px', borderRadius: '10px',
                  fontWeight: '700', fontSize: '0.9rem', width: 'fit-content',
                }}>
                  Read Full Review →
                </div>
              </div>
            </article>
          </Link>
        </section>
      )}

      {/* ══ CATEGORY FILTER ══ */}
      <section id="reviews" style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ color: '#f59e0b', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              🏆 Latest Reviews
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.03em' }}>
              All Watch Reviews
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <span key={cat} style={{
                padding: '6px 16px', borderRadius: '999px',
                background: cat === 'All' ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : '#f1f5f9',
                color: cat === 'All' ? 'white' : '#475569',
                fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
              }}>
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {gridPosts.length === 0 && posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🕐</div>
            <h3 style={{ fontSize: '1.3rem', color: '#475569', fontWeight: '600' }}>Reviews coming soon!</h3>
            <p style={{ color: '#94a3b8', marginTop: '8px' }}>Our team is busy testing watches. Check back in a few hours.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {(gridPosts.length > 0 ? gridPosts : posts).map((post, i) => (
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
                <Link href={`/watch-reviews/${post.slug}`} style={{ textDecoration: 'none', display: 'block', position: 'relative', height: '220px' }}>
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
                    <StarRating rating={4.5} />
                    <ReadingTime />
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

      {/* ══ WHY TRUST US ══ */}
      <section id="trending" style={{ background: '#0f172a', padding: '80px 24px', marginTop: '80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', letterSpacing: '-0.03em' }}>
              Why Trust <span style={{ color: '#f59e0b' }}>Whit Logic</span>?
            </h2>
            <p style={{ color: '#64748b', marginTop: '12px', maxWidth: '500px', margin: '12px auto 0' }}>
              We spend hours testing every product before writing a single word.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🧪', title: 'Hands-On Testing', desc: 'We wear and test every watch before recommending it.' },
              { icon: '📊', title: 'Data-Driven Reviews', desc: 'Ratings based on 12+ measurable criteria.' },
              { icon: '💰', title: 'Budget Focused', desc: 'All reviews focus on maximum value under $50.' },
              { icon: '🔗', title: 'Transparent', desc: 'We earn commissions but it never affects our scores.' },
            ].map((item) => (
              <div key={item.title} className="glass-dark card-hover" style={{
                borderRadius: '20px', padding: '32px 24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div className="animate-float" style={{ fontSize: '3rem', marginBottom: '16px', display: 'inline-block' }}>{item.icon}</div>
                <h3 style={{ color: 'white', fontWeight: '700', marginBottom: '8px', fontSize: '1.1rem' }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        padding: '60px 24px', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', marginBottom: '12px', letterSpacing: '-0.03em' }}>
          Never Miss a Deal Again
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '28px', fontSize: '1rem' }}>
          We post new reviews every week. Bookmark us for the latest watch deals.
        </p>
        <a
          href="/#reviews"
          style={{
            background: 'white', color: '#0f172a', padding: '14px 36px',
            borderRadius: '12px', fontWeight: '800', fontSize: '1rem', textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          📚 See All Reviews
        </a>
      </section>

    </main>
  );
}
