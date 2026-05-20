import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

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
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-16 text-center max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full mb-6 border border-primary-100">
            <span className="text-xs font-bold uppercase tracking-widest">Category</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-outfit tracking-tight leading-tight">
            {pageTitle}
          </h1>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
            Discover our top picks and in-depth reviews for {pageTitle.toLowerCase()}. Tested for durability, features, and true value for money.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white p-12 md:p-20 rounded-3xl text-center border border-slate-200 shadow-sm max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🕒</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-outfit">Coming Soon</h2>
            <p className="text-slate-500 mb-8 text-lg">We are currently testing watches for this category. Check back soon for in-depth reviews!</p>
            <Link href="/" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 hover:shadow-lg transition-all">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/watch-reviews/${post.slug}`} className="block group h-full">
                <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 card-hover h-full flex flex-col relative">
                  
                  <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                    <Image src={post.imageUrl} alt={post.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 300px" className="group-hover:scale-105 transition-transform duration-500 ease-out" />
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
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-primary-600 text-[10px] font-bold uppercase tracking-widest bg-primary-50 px-2 py-1 rounded">{post.brand}</span>
                      <StarRating rating={post.ratingValue} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2 font-outfit">
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
