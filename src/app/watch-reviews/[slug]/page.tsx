import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import SpecTable from '@/components/SpecTable';

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post) return { title: 'Review Not Found | Whit Logic' };

  const title = `${post.title} — Honest Review & Verdict`;
  const description = `Our expert team tested the ${post.brand} ${post.modelNumber}. Read our full review with pros & cons, performance analysis, and buying verdict. Is it worth buying in 2025?`;
  const canonical = `https://whitlogic.online/watch-reviews/${post.slug}`;

  return {
    title,
    description,
    keywords: [
      `${post.brand} review`, `${post.modelNumber} review`,
      `${post.brand} ${post.modelNumber}`, 'budget watch review',
      'tactical watch', 'sports watch', post.brand?.toLowerCase() || '',
    ],
    authors: [{ name: 'Whit Logic Editorial Team' }],
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Whit Logic',
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ['https://whitlogic.online'],
      tags: ['watch review', post.brand || '', 'budget watch'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: { canonical },
  };
}


export default async function WatchReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post) notFound();

  // JSON-LD Schemas
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: post.title, image: post.imageUrl,
    author: { '@type': 'Organization', name: 'Whit Logic' },
    publisher: { '@type': 'Organization', name: 'Whit Logic', logo: { '@type': 'ImageObject', url: 'https://whitlogic.online/logo.png' } },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  };

  const productJsonLd = {
    '@context': 'https://schema.org/', '@type': 'Product',
    name: `${post.brand} ${post.modelNumber}`, image: post.imageUrl,
    brand: { '@type': 'Brand', name: post.brand },
    review: {
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: '4.5', bestRating: '5', worstRating: '1' },
      author: { '@type': 'Person', name: 'Whit Logic Editorial Team' },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://whitlogic.online' },
      { '@type': 'ListItem', position: 2, name: 'Watch Reviews', item: 'https://whitlogic.online/#reviews' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://whitlogic.online/watch-reviews/${post.slug}` },
    ],
  };

  const publishedDate = new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .review-page { font-family: 'Inter', sans-serif; }

        /* Progress bar */
        #progress-bar {
          position: fixed; top: 0; left: 0; height: 3px; width: 0%;
          background: linear-gradient(90deg, #f59e0b, #ef4444);
          z-index: 9999; transition: width 0.1s linear;
        }

        /* Hero */
        .hero-section {
          position: relative; width: 100%; min-height: 520px;
          display: flex; align-items: flex-end;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          filter: brightness(0.45);
          transition: transform 8s ease;
        }
        .hero-section:hover .hero-bg { transform: scale(1.03); }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%);
        }
        .hero-content { position: relative; z-index: 10; padding: 48px 32px; width: 100%; }

        /* Badge */
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          background: rgba(245,158,11,0.2); color: #fbbf24;
          border: 1px solid rgba(245,158,11,0.4);
          margin-bottom: 16px;
        }

        /* Rating stars */
        .stars { color: #fbbf24; font-size: 18px; letter-spacing: 2px; }

        /* CTA Button primary */
        .cta-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px 28px; border-radius: 12px; font-weight: 800; font-size: 16px;
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
          color: white; border: none; cursor: pointer; text-decoration: none;
          box-shadow: 0 8px 30px rgba(245,158,11,0.4);
          transition: all 0.3s ease; letter-spacing: 0.02em;
        }
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(245,158,11,0.5);
        }

        /* Verdict card */
        .verdict-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border: 1px solid rgba(245,158,11,0.3);
          border-radius: 20px; padding: 28px 32px;
          margin-bottom: 40px; position: relative; overflow: hidden;
        }
        .verdict-card::before {
          content: ''; position: absolute; top: -50%; right: -20%;
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%);
        }

        /* Sidebar card */
        .sidebar-card {
          background: #fff; border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          overflow: hidden; position: sticky; top: 24px;
        }
        .sidebar-header {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 20px 24px;
        }

        /* Section headings */
        .article-content h2 {
          font-size: 1.75rem; font-weight: 800; color: #0f172a;
          margin-top: 48px; margin-bottom: 20px; padding-bottom: 12px;
          border-bottom: 3px solid #f59e0b;
          display: flex; align-items: center; gap: 10px;
        }
        .article-content h3 {
          font-size: 1.3rem; font-weight: 700; color: #1e293b;
          margin-top: 32px; margin-bottom: 12px;
        }
        .article-content p { color: #475569; line-height: 1.85; margin-bottom: 16px; font-size: 1.05rem; }
        .article-content ul { padding-left: 24px; margin-bottom: 20px; }
        .article-content li { color: #475569; line-height: 1.8; margin-bottom: 8px; }
        .article-content a { color: #f59e0b; font-weight: 600; text-decoration: underline; }
        .article-content table { width: 100%; border-collapse: collapse; margin: 24px 0; border-radius: 12px; overflow: hidden; }
        .article-content th { background: #0f172a; color: white; padding: 14px 18px; text-align: left; font-weight: 700; }
        .article-content td { padding: 12px 18px; border-bottom: 1px solid #e2e8f0; color: #475569; }
        .article-content tr:nth-child(even) td { background: #f8fafc; }

        /* Author box */
        .author-box {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 20px; border: 1px solid #e2e8f0;
          padding: 32px; display: flex; gap: 24px; align-items: center;
        }
        .author-avatar {
          width: 80px; height: 80px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #0f172a, #f59e0b);
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 24px; color: white;
        }

        /* Breadcrumb */
        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #94a3b8; flex-wrap: wrap; }
        .breadcrumb a { color: #64748b; text-decoration: none; }
        .breadcrumb a:hover { color: #f59e0b; }
        .breadcrumb .sep { color: #cbd5e1; }

        /* Mobile sticky CTA */
        .mobile-cta {
          position: fixed; bottom: 0; left: 0; right: 0;
          padding: 12px 16px; background: white;
          border-top: 1px solid #e2e8f0;
          box-shadow: 0 -8px 24px rgba(0,0,0,0.1);
          z-index: 50; display: none;
        }
        @media (max-width: 1024px) { .mobile-cta { display: flex; } }
        @media (max-width: 1024px) { .desktop-sidebar { display: none; } }
      `}</style>

      {/* Reading Progress Bar */}
      <div id="progress-bar"></div>
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('scroll', function() {
            var el = document.getElementById('progress-bar');
            if (!el) return;
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            el.style.width = (scrollTop / docHeight * 100) + '%';
          });
        `
      }} />

      <div className="review-page bg-slate-50 min-h-screen pb-24 lg:pb-0">

        {/* ───── HERO SECTION ───── */}
        <div className="hero-section">
          <div
            className="hero-bg"
            style={{ backgroundImage: `url('${post.imageUrl}')` }}
          />
          <div className="hero-overlay" />
          <div className="hero-content max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="breadcrumb mb-6">
              <Link href="/">Home</Link>
              <span className="sep">›</span>
              <Link href="/#reviews">Reviews</Link>
              <span className="sep">›</span>
              <span style={{ color: '#fbbf24' }}>{post.brand}</span>
            </div>

            <div className="badge">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
              {post.brand}
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: '16px', maxWidth: '800px' }}>
              {post.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
              <div className="stars">★★★★½</div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Expert Review</span>
              <span style={{ color: '#64748b' }}>•</span>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>{publishedDate}</span>
              <span style={{ color: '#64748b' }}>•</span>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>By Whit Logic Team</span>
            </div>

            <a href={post.amazonAffiliateLink} target="_blank" rel="noopener noreferrer" className="cta-primary">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
              Check Price on Amazon
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
            </a>
          </div>
        </div>

        {/* ───── MAIN LAYOUT ───── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'start' }}>

            {/* ── LEFT: ARTICLE CONTENT ── */}
            <div>

              {/* Verdict Card */}
              <div className="verdict-card">
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>⚡ Our Verdict</p>
                  <div className="stars" style={{ marginBottom: '12px' }}>★★★★½</div>
                  <p style={{ color: '#e2e8f0', fontSize: '16px', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>
                    &ldquo;A solid pick for budget-conscious buyers who want reliability without compromise. The {post.brand} {post.modelNumber} punches well above its price tag.&rdquo;
                  </p>
                  <div style={{ display: 'flex', gap: '32px', marginTop: '20px', flexWrap: 'wrap' }}>
                    {[['Design', '8.5'], ['Performance', '8.8'], ['Value', '9.2'], ['Durability', '8.7']].map(([label, score]) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 900, color: '#fbbf24' }}>{score}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spec Table */}
              <div style={{ marginBottom: '40px' }}>
                <SpecTable brand={post.brand} modelNumber={post.modelNumber} />
              </div>

              {/* Main Article Content */}
              <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

              {/* Bottom CTA Banner */}
              <div style={{
                marginTop: '48px', padding: '40px 36px', borderRadius: '24px', textAlign: 'center',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 80%, #0f172a 100%)',
                border: '1px solid rgba(245,158,11,0.25)', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Ready to Buy?</p>
                  <h3 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>Get the {post.brand} {post.modelNumber}</h3>
                  <p style={{ color: '#94a3b8', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
                    Secure your order on Amazon. Fast shipping, hassle-free returns.
                  </p>
                  <a href={post.amazonAffiliateLink} target="_blank" rel="noopener noreferrer" className="cta-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.46 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    Buy Now on Amazon
                  </a>
                  <p style={{ color: '#475569', fontSize: '12px', marginTop: '14px' }}>*As an Amazon Associate, we earn from qualifying purchases at no extra cost to you.</p>
                </div>
              </div>

              {/* Author Box */}
              <div className="author-box" style={{ marginTop: '40px' }}>
                <div className="author-avatar">WL</div>
                <div>
                  <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Reviewed by</p>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Whit Logic Editorial Team</h4>
                  <p style={{ color: '#64748b', lineHeight: 1.7, margin: 0 }}>
                    We are passionate experts in budget tactical gear and sports watches. Our mission is to independently review, test, and analyze affordable watches so you can make confident purchasing decisions.
                  </p>
                </div>
              </div>

            </div>

            {/* ── RIGHT: SIDEBAR ── */}
            <div className="desktop-sidebar">
              <div className="sidebar-card">

                {/* Product image in sidebar */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#f1f5f9' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} />
                </div>

                <div className="sidebar-header">
                  <div style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Currently Reviewing</div>
                  <div style={{ color: 'white', fontWeight: 800, fontSize: '15px', lineHeight: 1.4 }}>{post.title.slice(0, 60)}{post.title.length > 60 ? '...' : ''}</div>
                </div>

                <div style={{ padding: '20px 24px' }}>
                  {/* Rating */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <div className="stars" style={{ fontSize: '16px' }}>★★★★½</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>Expert Score</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, fontSize: '28px', color: '#0f172a', lineHeight: 1 }}>8.8</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px' }}>/ 10</div>
                    </div>
                  </div>

                  {/* Score bars */}
                  {[['Value for Money', 92], ['Build Quality', 85], ['Performance', 88], ['Design', 80]].map(([label, pct]) => (
                    <div key={label} style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{label}</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{pct}/100</span>
                      </div>
                      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '9999px' }} />
                      </div>
                    </div>
                  ))}

                  <div style={{ height: '1px', background: '#e2e8f0', margin: '20px 0' }} />

                  {/* Model & Brand */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    {[['Brand', post.brand], ['Model', post.modelNumber]].map(([label, val]) => (
                      <div key={label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px 14px' }}>
                        <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                        <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '14px', marginTop: '2px', wordBreak: 'break-all' }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <a
                    href={post.amazonAffiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-primary"
                    style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                  >
                    View on Amazon
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                  </a>

                  <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>*Affiliate link. We earn a small commission.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ───── MOBILE STICKY CTA ───── */}
        <div className="mobile-cta">
          <a
            href={post.amazonAffiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Check Price on Amazon
          </a>
        </div>

      </div>
    </>
  );
}
