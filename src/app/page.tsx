import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Whit Logic | Budget Tactical & Sports Watches',
  description: 'Discover the best budget tactical and sports watches. We review top brands like SKMEI and CURREN to help you find durable gear without breaking the bank.',
};

export const revalidate = 3600; // ISR revalidation

export default async function Home() {
  // Fetch latest 12 posts from Database
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 12,
  });

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Gear Up. <span className="text-amber-500">Spend Less.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Expert reviews of the best budget tactical and sports watches. Discover premium durability from brands like SKMEI and CURREN for under $50.
          </p>
          <a href="#reviews" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-slate-900 bg-amber-500 rounded-md hover:bg-amber-400 transition-colors">
            Read Latest Reviews
          </a>
        </div>
      </section>

      {/* Reviews Grid */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10 border-b border-slate-200 pb-4">
          <h2 className="text-3xl font-bold text-slate-900">Latest Tactical Watch Reviews</h2>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl text-slate-600">No reviews published yet. Check back soon!</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <Link href={`/watch-reviews/${post.slug}`} className="block relative h-64 w-full overflow-hidden group">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-sm uppercase tracking-wider">
                      {post.brand}
                    </span>
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
                    <span>Model: {post.modelNumber}</span>
                    <time dateTime={post.createdAt.toISOString()}>
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 hover:text-amber-600 transition-colors">
                    <Link href={`/watch-reviews/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link 
                      href={`/watch-reviews/${post.slug}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Read Full Review &rarr;
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
