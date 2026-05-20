import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  return {
    title: `Search results for "${query}" | Whit Logic`,
    description: `Search results for ${query} on Whit Logic budget tactical watch reviews.`,
    robots: { index: false, follow: true }, // Don't index search results pages
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

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';

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
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full mb-4">
            <span className="text-xs font-bold uppercase tracking-widest">Search Results</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 font-outfit tracking-tight">
            Results for <span className="text-primary-500">"{query}"</span>
          </h1>
          <p className="text-slate-500 text-lg">
            {posts.length} {posts.length === 1 ? 'match' : 'matches'} found based on your search criteria.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white p-12 md:p-20 rounded-3xl text-center border border-slate-200 shadow-sm max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-outfit">No reviews found</h2>
            <p className="text-slate-500 mb-8 text-lg">We couldn't find any watches matching your search. Try adjusting your keywords.</p>
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
