import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import SpecTable from '@/components/SpecTable';
import ShareButtons from '@/components/ShareButtons';

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

  // Fetch 3 related posts based on category (excluding current post)
  const relatedPosts = await prisma.post.findMany({
    where: {
      category: post.category,
      NOT: { slug: post.slug }
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(post.ratingValue ?? 4.5),
      bestRating: '5',
      worstRating: '1',
      ratingCount: String(post.ratingCount ?? 89),
    },
    review: {
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: String(post.ratingValue ?? 4.5), bestRating: '5', worstRating: '1' },
      author: { '@type': 'Person', name: 'Whit Logic Editorial Team' },
    },
  };

  // FAQ Schema
  const faqList = Array.isArray(post.faqs) ? post.faqs as { question: string; answer: string }[] : [];
  const faqJsonLd = faqList.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

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
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

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
          position: relative; width: 100%; min-height: 80vh;
          display: flex; align-items: flex-end; padding: 80px 24px 60px;
          overflow: hidden; background: #0f172a;
        }
        .hero-bg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          background-size: cover; background-position: center;
          background-attachment: fixed; filter: blur(6px) brightness(0.45);
          transform: scale(1.05);
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, #0f172a 0%, rgba(15,23,42,0.6) 60%, rgba(15,23,42,0.2) 100%),
                      radial-gradient(circle at center, transparent 0%, rgba(15,23,42,0.8) 100%);
        }
        .hero-content {
          position: relative; z-index: 10; width: 100%; max-width: 1200px; margin: 0 auto;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          display: grid; gap: 40px; align-items: center;
        }
        @media (min-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr 400px;
            gap: 60px;
          }
        }
        
        .hero-image-wrapper {
          position: relative;
          display: flex; justify-content: center; align-items: center;
          padding: 20px;
          min-height: 400px; /* Ensure wrapper has enough height for the frame */
        }
        
        /* Decorative Square Frame */
        .hero-image-frame {
          position: absolute;
          width: 320px; height: 320px;
          border: 2px dashed rgba(245, 158, 11, 0.4);
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(245,158,11,0.15) 100%);
          box-shadow: 0 0 30px rgba(245, 158, 11, 0.15), inset 0 0 20px rgba(245, 158, 11, 0.1);
          transform: rotate(8deg);
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 0;
        }

        .hero-image-frame::after {
          content: '';
          position: absolute;
          inset: -10px;
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 24px;
          transform: rotate(-12deg);
          transition: all 0.5s ease;
        }

        .hero-image-wrapper:hover .hero-image-frame {
          transform: rotate(0deg) scale(1.05);
          border: 2px solid rgba(245, 158, 11, 0.6);
        }
        
        .hero-image-wrapper:hover .hero-image-frame::after {
          transform: rotate(0deg) scale(1.02);
          border-color: rgba(245, 158, 11, 0.4);
        }
        
        .hero-watch-image {
          position: relative; z-index: 1;
          width: 100%; max-width: 320px;
          height: auto;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5));
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .hero-watch-image:hover {
          transform: scale(1.08) rotate(-5deg) translateY(-10px);
        }

        /* Badge */
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          background: rgba(15, 23, 42, 0.6); color: #fbbf24;
          border: 1px solid rgba(245,158,11,0.5);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 0 15px rgba(245,158,11,0.15);
          margin-bottom: 24px;
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
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        .verdict-card::before {
          content: ''; position: absolute; top: -50%; right: -20%;
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%);
        }

        /* Sidebar card */
        .sidebar-card {
          background: rgba(255,255,255,0.8); backdrop-filter: blur(16px);
          border-radius: 20px; border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          overflow: hidden; position: sticky; top: 100px;
        }
        .sidebar-header {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 20px 24px;
        }

        /* Article Content */
        .article-content {
          font-size: 1.125rem; line-height: 1.85; color: #334155;
          margin-top: 32px;
        }
        .article-content h2 {
          font-size: 1.8rem; font-weight: 800; color: #0f172a;
          margin: 48px 0 20px; letter-spacing: -0.02em;
          border-bottom: 3px solid #f59e0b;
          display: flex; align-items: center; gap: 10px;
        }
        .article-content h3 {
          font-size: 1.4rem; font-weight: 700; color: #1e293b;
          margin: 32px 0 16px;
        }
        .article-content p { margin-bottom: 24px; }
        .article-content img { border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin: 32px 0; }
        .article-content ul, .article-content ol { padding-left: 24px; margin-bottom: 24px; }
        .article-content li { margin-bottom: 8px; }
        .article-content a { color: #f59e0b; text-decoration: underline; font-weight: 500; }
        .article-content strong { color: #0f172a; }
        .article-content table { width: 100%; border-collapse: collapse; margin: 24px 0; border-radius: 12px; overflow: hidden; }
        .article-content th { background: #0f172a; color: white; padding: 14px 18px; text-align: left; font-weight: 700; }
        .article-content td { padding: 12px 18px; border-bottom: 1px solid #e2e8f0; color: #475569; }
        .article-content tr:nth-child(even) td { background: #f8fafc; }

        /* Responsive Layout */
        .main-layout {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .main-layout {
            grid-template-columns: 1fr 340px;
          }
        }

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

        /* Star Rating Widget */
        .star-rating-widget { display: flex; align-items: center; gap: 6px; cursor: pointer; }
        .star-rating-widget .star {
          font-size: 28px; color: #d1d5db;
          transition: color 0.15s ease, transform 0.15s ease;
          cursor: pointer;
        }
        .star-rating-widget .star.filled { color: #fbbf24; }
        .star-rating-widget .star:hover { transform: scale(1.2); }
        .rating-box {
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          border: 1px solid #fde68a; border-radius: 16px;
          padding: 20px 24px; margin-bottom: 32px;
          display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
        }
        .rating-score { font-size: 52px; font-weight: 900; color: #0f172a; line-height: 1; }
        .rating-label { color: #92400e; font-size: 13px; font-weight: 600; margin-top: 4px; }

        /* FAQ Accordion */
        .faq-section { margin-top: 48px; }
        .faq-item {
          border: 1px solid #e2e8f0; border-radius: 12px;
          margin-bottom: 10px; overflow: hidden;
          transition: box-shadow 0.2s ease;
        }
        .faq-item:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .faq-question {
          padding: 18px 20px; font-weight: 700; font-size: 15px;
          color: #0f172a; cursor: pointer; display: flex;
          justify-content: space-between; align-items: center; gap: 12px;
          background: white; user-select: none;
        }
        .faq-question:hover { background: #f8fafc; }
        .faq-chevron { font-size: 18px; color: #f59e0b; transition: transform 0.3s ease; flex-shrink: 0; }
        .faq-chevron.open { transform: rotate(180deg); }
        .faq-answer {
          max-height: 0; overflow: hidden;
          transition: max-height 0.35s ease, padding 0.35s ease;
          background: #f8fafc; color: #475569; line-height: 1.75; font-size: 15px;
          padding: 0 20px;
        }
        .faq-answer.open { max-height: 300px; padding: 16px 20px; }
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

      {/* Star Rating Interaction Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('DOMContentLoaded', function() {
            var widget = document.getElementById('user-star-rating');
            var thanks = document.getElementById('rating-thanks');
            if (!widget) return;
            var stars = widget.querySelectorAll('.star');
            var saved = localStorage.getItem('wl-rating-${post.slug}');
            if (saved) {
              highlightStars(parseInt(saved));
              if(thanks) thanks.style.display = 'block';
            }
            stars.forEach(function(star) {
              star.addEventListener('mouseenter', function() {
                var val = parseInt(this.getAttribute('data-value'));
                stars.forEach(function(s, idx) {
                  s.style.color = idx < val ? '#fbbf24' : '#d1d5db';
                });
              });
              star.addEventListener('mouseleave', function() {
                var s2 = localStorage.getItem('wl-rating-${post.slug}');
                highlightStars(s2 ? parseInt(s2) : 0);
              });
              star.addEventListener('click', function() {
                var val = parseInt(this.getAttribute('data-value'));
                localStorage.setItem('wl-rating-${post.slug}', val);
                highlightStars(val);
                if(thanks) thanks.style.display = 'block';
              });
            });
            function highlightStars(val) {
              stars.forEach(function(s, idx) {
                s.style.color = idx < val ? '#fbbf24' : '#d1d5db';
              });
            }
          });
        `
      }} />

      <ShareButtons title={post.title} />

      <div className="review-page bg-slate-50 min-h-screen pb-24 lg:pb-0">

        {/* ───── HERO SECTION ───── */}
        <div className="hero-section">
          <div
            className="hero-bg"
            style={{ backgroundImage: `url('${post.imageUrl}')` }}
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            
            {/* ── LEFT: Text Content ── */}
            <div>
              {/* Breadcrumb */}
              <div className="breadcrumb mb-6">
                <Link href="/">Home</Link>
                <span className="sep">›</span>
                <Link href="/#reviews">Reviews</Link>
                <span className="sep">›</span>
                <span style={{ color: '#fbbf24' }}>{post.brand}</span>
              </div>

              <div className="badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {post.brand}
              </div>

              <h1 style={{ 
                fontSize: 'clamp(1.3rem, 2.5vw, 2.2rem)', 
                fontWeight: 800, 
                color: 'white', 
                lineHeight: 1.3, 
                marginBottom: '24px', 
                maxWidth: '900px',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}>
                {post.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px', background: 'rgba(15,23,42,0.4)', padding: '12px 20px', borderRadius: '12px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)' }}>
                <div style={{ display: 'flex', gap: '4px', color: '#fbbf24', fontSize: '16px' }}>
                  ★★★★½
                </div>
                <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>{post.ratingCount ?? 89} Reviews</span>
                <span style={{ color: '#334155' }}>|</span>
                <span style={{ color: '#cbd5e1', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  {publishedDate}
                </span>
                <span style={{ color: '#334155' }}>|</span>
                <span style={{ color: '#cbd5e1', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  Whit Logic Team
                </span>
              </div>

              <a href={post.amazonAffiliateLink} target="_blank" rel="noopener noreferrer" className="cta-primary">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                Check Price on Amazon
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </a>
            </div>

            {/* ── RIGHT: Watch Image ── */}
            <div className="hero-image-wrapper">
              <div className="hero-image-frame"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.imageUrl} alt={post.title} className="hero-watch-image" />
            </div>

          </div>
        </div>

        {/* ───── MAIN LAYOUT ───── */}
        <div className="main-layout">

            {/* ── LEFT: ARTICLE CONTENT ── */}
            <div style={{ minWidth: 0 }}>

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

              {/* ── Star Rating Widget ── */}
              <div className="rating-box" style={{ marginTop: '40px' }}>
                <div>
                  <div className="rating-score">{(post.ratingValue ?? 4.5).toFixed(1)}</div>
                  <div className="stars" style={{ fontSize: '22px', marginTop: '4px' }}>★★★★½</div>
                  <div className="rating-label">Out of 5 — Based on {post.ratingCount ?? 89} reviews</div>
                </div>
                <div style={{ height: '60px', width: '1px', background: '#fde68a' }} />
                <div>
                  <p style={{ color: '#92400e', fontWeight: 700, marginBottom: '8px', fontSize: '14px' }}>Rate this watch:</p>
                  <div className="star-rating-widget" id="user-star-rating">
                    {[1,2,3,4,5].map(n => (
                      <span key={n} className="star" data-value={n}>★</span>
                    ))}
                  </div>
                  <p id="rating-thanks" style={{ color: '#059669', fontSize: '13px', fontWeight: 600, marginTop: '8px', display: 'none' }}>
                    Thanks for rating! ⭐
                  </p>
                </div>
              </div>

              {/* ── FAQ Section ── */}
              {faqList.length > 0 && (
                <div className="faq-section">
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', paddingBottom: '10px', borderBottom: '3px solid #f59e0b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    ❓ Frequently Asked Questions
                  </h2>
                  {faqList.map((faq, i) => (
                    <div key={i} className="faq-item">
                      <div className="faq-question" onClick={() => {
                        const answer = document.getElementById(`faq-answer-${i}`);
                        const chevron = document.getElementById(`faq-chevron-${i}`);
                        if (answer && chevron) {
                          answer.classList.toggle('open');
                          chevron.classList.toggle('open');
                        }
                      }}>
                        <span>{faq.question}</span>
                        <span className="faq-chevron" id={`faq-chevron-${i}`}>▾</span>
                      </div>
                      <div className="faq-answer" id={`faq-answer-${i}`}>
                        {faq.answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom CTA Banner */}
              <div style={{
                marginTop: '48px', padding: '40px 36px', borderRadius: '24px', textAlign: 'center',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 80%, #0f172a 100%)',
                border: '1px solid rgba(245,158,11,0.25)', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Ready to Buy?</p>
                  <h3 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
                    {post.isDeal ? <span style={{ color: '#ef4444' }}>🔥 {post.discountPercentage} OFF: </span> : ''}
                    Get the {post.brand} {post.modelNumber}
                  </h3>
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
            <aside className="desktop-sidebar">
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

                  {/* Deal Badge Sidebar */}
                  {post.isDeal && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px', marginBottom: '16px', textAlign: 'center' }}>
                      <div style={{ color: '#ef4444', fontWeight: 900, fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        🔥 PRICE DROP: {post.discountPercentage} OFF
                      </div>
                      <div style={{ color: '#991b1b', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>Limited Time Deal Detected</div>
                    </div>
                  )}

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
            </aside>
        </div>

        {/* ───── RELATED WATCHES SECTION ───── */}
        {relatedPosts.length > 0 && (
          <div style={{ maxWidth: '1200px', margin: '0 auto 60px', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                You May Also Like
              </h2>
              <div style={{ height: '3px', flex: 1, background: 'linear-gradient(90deg, #f59e0b, transparent)' }} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/watch-reviews/${related.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', 
                    overflow: 'hidden', transition: 'all 0.3s ease', height: '100%',
                    display: 'flex', flexDirection: 'column', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' 
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)'; }}
                  >
                    <div style={{ height: '220px', background: '#f8fafc', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {related.isDeal && (
                        <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#ef4444', color: 'white', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px', zIndex: 2 }}>
                          {related.discountPercentage} OFF
                        </div>
                      )}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={related.imageUrl} alt={related.title} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <span style={{ color: '#fbbf24', fontSize: '13px' }}>★★★★½</span>
                        <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>({related.ratingCount})</span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px', lineHeight: 1.4, flex: 1 }}>
                        {related.title.length > 60 ? related.title.substring(0, 60) + '...' : related.title}
                      </h3>
                      <div style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Read Review <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ───── MOBILE STICKY CTA ───── */}
        <div className="mobile-cta">
          {post.isDeal && (
            <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: 'white', padding: '4px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 900, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)', whiteSpace: 'nowrap' }}>
              🔥 {post.discountPercentage} OFF DEAL
            </div>
          )}
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
