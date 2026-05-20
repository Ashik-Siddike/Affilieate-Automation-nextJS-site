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
    <span aria-label={`${rating} out of 5 stars`} className="text-primary-500 text-sm tracking-widest">
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
      <span className="text-slate-500 text-xs ml-1 tracking-normal font-medium">({rating})</span>
    </span>
  );
}

function ReadingTime({ content }: { content?: string }) {
  const words = content?.replace(/<[^>]*>/g, '').split(' ').length || 800;
  const mins = Math.max(3, Math.ceil(words / 200));
  return <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">⏱ {mins} min read</span>;
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

  const categories = [
    { name: 'All', href: '#reviews' },
    { name: 'Tactical', href: '/watches/tactical' },
    { name: 'Sports', href: '/watches/sports' },
    { name: 'Under $20', href: '/watches/budget-under-20' },
    { name: 'Waterproof', href: '/watches/waterproof' },
  ];

  return (
    <div className="bg-slate-50">

      {/* ══ HERO SECTION ══ */}
      <section className="relative overflow-hidden bg-slate-900 pt-24 pb-32 px-6 lg:px-8 border-b border-slate-800">
        
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:40px_40px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
          
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="text-xs font-bold text-primary-500 tracking-widest uppercase">
              🔥 Trusted by 50,000+ Shoppers
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 font-outfit">
            Find Your Perfect Watch.{' '}
            <span className="bg-gradient-to-r from-primary-400 to-brand-red text-transparent bg-clip-text">
              Spend Less.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Independent, hands-on reviews of the best budget tactical and sports watches. 
            Real tests. Honest verdicts. No fluff.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="#reviews" className="bg-gradient-to-r from-primary-500 to-brand-red text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-1 transition-all duration-300">
              Browse Reviews →
            </a>
            <a href="#trending" className="bg-white/5 text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/10 hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm">
              🔥 Trending
            </a>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative z-10 max-w-5xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-panel rounded-2xl p-6 text-center group hover:bg-slate-800/80 transition-colors">
              <div className="text-3xl md:text-4xl font-black text-primary-400 font-outfit tracking-tight group-hover:scale-105 transition-transform">{stat.value}</div>
              <div className="text-xs md:text-sm text-slate-400 mt-2 font-semibold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURED POST ══ */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 -mt-12 relative z-20">
          <Link href={`/watch-reviews/${featuredPost.slug}`} className="block group">
            <article className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row border border-slate-100 group-hover:shadow-slate-300/60 transition-shadow">
              
              <div className="relative w-full md:w-3/5 aspect-video md:aspect-auto md:min-h-[450px] bg-slate-100 overflow-hidden">
                <Image
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                  Top Pick
                </div>
                {featuredPost.isDeal && (
                  <div className="absolute top-6 right-6 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-brand-red/30">
                    {featuredPost.discountPercentage ? `🔥 ${featuredPost.discountPercentage}% OFF` : '🔥 HOT DEAL'}
                  </div>
                )}
              </div>

              <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest">{featuredPost.brand}</span>
                  <ReadingTime content={featuredPost.content} />
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-4 font-outfit group-hover:text-primary-600 transition-colors">
                  {featuredPost.title}
                </h2>
                
                <div className="mb-6">
                  <StarRating rating={featuredPost.ratingValue} />
                </div>
                
                <p className="text-slate-600 text-lg line-clamp-3 mb-8 leading-relaxed">
                  {featuredPost.content.replace(/<[^>]*>/g, '').substring(0, 180)}...
                </p>
                
                <div className="mt-auto inline-flex items-center gap-2 text-primary-600 font-bold text-lg group-hover:gap-4 transition-all">
                  Read Full Review <span aria-hidden="true">→</span>
                </div>
              </div>

            </article>
          </Link>
        </section>
      )}

      {/* ══ LATEST REVIEWS GRID ══ */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 font-outfit mb-3">Latest Reviews</h2>
            <p className="text-slate-500 text-lg">In-depth tests of the newest budget watches.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-slate-50 hover:text-primary-600 transition-colors shadow-sm"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridPosts.map((post) => (
            <Link key={post.id} href={`/watch-reviews/${post.slug}`} className="block group h-full">
              <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 card-hover h-full flex flex-col relative">
                
                <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {post.isDeal && (
                    <div className="absolute top-4 right-4 bg-brand-red text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm">
                      {post.discountPercentage ? `🔥 ${post.discountPercentage}% OFF` : '🔥 DEAL'}
                    </div>
                  )}
                  
                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Read Review
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-primary-600 text-xs font-bold uppercase tracking-widest bg-primary-50 px-2 py-1 rounded">{post.brand}</span>
                    <StarRating rating={post.ratingValue} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400">
                    <ReadingTime content={post.content} />
                    <span className="text-xs font-medium">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

              </article>
            </Link>
          ))}
        </div>

        {gridPosts.length > 0 && (
          <div className="mt-16 text-center">
            <Link href="/watches/tactical" className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 hover:shadow-md transition-all">
              View All Watches <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </section>

    </div>
  );
}
