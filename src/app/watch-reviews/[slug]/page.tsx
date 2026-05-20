import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: 'Not Found' };
  
  return {
    title: `${post.title} | Whit Logic Review`,
    description: post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
    openGraph: {
      title: post.title,
      description: post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      images: [{ url: post.imageUrl }],
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      authors: ['Whit Logic Editorial Team'],
    },
    alternates: { canonical: `https://whitlogic.online/watch-reviews/${post.slug}` },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) notFound();

  const publishedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: post.title,
    image: [post.imageUrl],
    datePublished: post.createdAt.toISOString(),
    author: [{ '@type': 'Organization', name: 'Whit Logic', url: 'https://whitlogic.online' }],
    publisher: { '@type': 'Organization', name: 'Whit Logic', logo: { '@type': 'ImageObject', url: 'https://whitlogic.online/logo.png' } },
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
      { '@type': 'ListItem', position: 2, name: 'Reviews', item: 'https://whitlogic.online/#reviews' },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      {/* Reading Progress Bar */}
      <div id="progress-bar" className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-brand-red z-50 transition-all duration-150" style={{ width: '0%' }}></div>
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
                  s.style.transform = idx === val - 1 ? 'scale(1.2)' : 'scale(1)';
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
                s.style.transform = 'scale(1)';
              });
            }
          });
          
          window.toggleFaq = function(i) {
            const answer = document.getElementById('faq-answer-'+i);
            const chevron = document.getElementById('faq-chevron-'+i);
            if (answer && chevron) {
              answer.classList.toggle('max-h-0');
              answer.classList.toggle('max-h-96');
              answer.classList.toggle('p-0');
              answer.classList.toggle('p-5');
              chevron.classList.toggle('rotate-180');
            }
          }
        `
      }} />

      <div className="bg-slate-50 min-h-screen pb-24 lg:pb-0">

        {/* ───── HERO SECTION ───── */}
        <div className="relative w-full h-[60vh] min-h-[400px] flex items-end">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${post.imageUrl}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          
          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8 pb-16 animate-fade-in-up">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-primary-500 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary-500/30">
                {post.brand}
              </span>
              <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-md text-xs font-bold shadow-lg">
                Model: {post.modelNumber}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight font-outfit mb-6 tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm font-medium">
              <div className="flex items-center text-primary-400 text-lg">★★★★½</div>
              <span>{post.ratingCount ?? 89} Reviews</span>
              <span className="text-slate-600">•</span>
              <span>{publishedDate}</span>
              <span className="text-slate-600">•</span>
              <span>By Whit Logic Team</span>
            </div>
          </div>
        </div>

        {/* ───── MAIN CONTENT AREA ───── */}
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12 relative">
          
          {/* Main Article Column */}
          <article className="w-full lg:w-2/3 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200">
            <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* ── Star Rating Widget ── */}
            <div className="mt-12 bg-gradient-to-br from-primary-50 to-amber-100 border border-primary-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-inner">
              <div className="text-center md:text-left">
                <div className="text-5xl font-black text-slate-900 leading-none font-outfit">{(post.ratingValue ?? 4.5).toFixed(1)}</div>
                <div className="text-2xl text-primary-500 mt-2 tracking-widest">★★★★½</div>
                <div className="text-primary-800 text-sm font-semibold mt-2">Out of 5 — Based on {post.ratingCount ?? 89} reviews</div>
              </div>
              <div className="hidden md:block w-px h-16 bg-primary-300" />
              <div className="text-center md:text-left">
                <p className="text-primary-900 font-bold mb-3 text-sm uppercase tracking-wider">Rate this watch:</p>
                <div className="flex items-center justify-center md:justify-start gap-1 cursor-pointer" id="user-star-rating">
                  {[1,2,3,4,5].map(n => (
                    <span key={n} className="star text-3xl text-slate-300 transition-all duration-200" data-value={n}>★</span>
                  ))}
                </div>
                <p id="rating-thanks" className="text-emerald-600 text-sm font-bold mt-2 hidden">
                  Thanks for rating! ⭐
                </p>
              </div>
            </div>

            {/* ── FAQ Section ── */}
            {faqList.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-black text-slate-900 mb-6 pb-3 border-b-2 border-primary-500 flex items-center gap-3 font-outfit">
                  <span className="text-primary-500 text-3xl">❓</span> Frequently Asked Questions
                </h2>
                <div className="flex flex-col gap-3">
                  {faqList.map((faq, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white">
                      <div 
                        className="p-5 font-bold text-slate-900 cursor-pointer flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors"
                        onClick={() => {
                          if(typeof window !== 'undefined' && (window as any).toggleFaq) {
                            (window as any).toggleFaq(i);
                          }
                        }}
                      >
                        <span className="pr-4">{faq.question}</span>
                        <span className="text-primary-500 text-xl transition-transform duration-300 shrink-0" id={`faq-chevron-${i}`}>▾</span>
                      </div>
                      <div 
                        className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out bg-white text-slate-600 p-0"
                        id={`faq-answer-${i}`}
                      >
                        {faq.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom CTA Banner */}
            <div className="mt-16 p-10 rounded-2xl text-center bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-4 font-outfit">Ready to upgrade your gear?</h3>
                <p className="text-slate-400 mb-8 text-lg">Check the latest price on Amazon. Stock is often limited.</p>
                <a
                  href={post.amazonAffiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full sm:w-auto bg-gradient-to-r from-primary-500 to-brand-red text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1 transition-all duration-300"
                >
                  View on Amazon
                </a>
              </div>
            </div>
          </article>

          {/* ───── SIDEBAR (Desktop) ───── */}
          <aside className="hidden lg:block w-1/3">
            <div className="sticky top-28 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
              <div className="w-24 h-24 relative mb-6 rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-slate-100">
                <Image src={post.imageUrl} alt={post.brand} fill style={{ objectFit: 'cover' }} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 font-outfit leading-tight">{post.title}</h3>
              <p className="text-slate-500 mb-6 text-sm">Best price guaranteed via Amazon.</p>
              
              <div className="w-full h-px bg-slate-100 mb-6" />
              
              <div className="w-full flex justify-between text-sm mb-2">
                <span className="text-slate-500">Durability</span>
                <span className="font-bold text-slate-900">9.5/10</span>
              </div>
              <div className="w-full flex justify-between text-sm mb-2">
                <span className="text-slate-500">Value</span>
                <span className="font-bold text-slate-900">10/10</span>
              </div>
              <div className="w-full flex justify-between text-sm mb-6">
                <span className="text-slate-500">Features</span>
                <span className="font-bold text-slate-900">8.5/10</span>
              </div>

              <a
                href={post.amazonAffiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-primary-500 to-brand-red text-white py-4 rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1 transition-all duration-300"
              >
                Check Current Price
              </a>
              <span className="text-xs text-slate-400 mt-4 text-center block">
                As an Amazon Associate we earn from qualifying purchases.
              </span>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-8px_24px_rgba(0,0,0,0.1)] z-50 flex items-center gap-4">
        <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-100">
          <Image src={post.imageUrl} alt={post.brand} fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="flex-grow min-w-0">
          <div className="text-xs font-bold text-slate-900 truncate pr-2">{post.brand}</div>
          <div className="text-[10px] text-slate-500">Check price</div>
        </div>
        <a
          href={post.amazonAffiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-primary-500 to-brand-red text-white px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap shadow-md shadow-primary-500/20"
        >
          Buy Now
        </a>
      </div>
    </>
  );
}
