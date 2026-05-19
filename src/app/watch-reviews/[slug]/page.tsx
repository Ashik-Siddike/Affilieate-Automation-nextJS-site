import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import SpecTable from '@/components/SpecTable';

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

// ISR: Revalidate at most every hour if manual revalidation fails
export const revalidate = 3600;

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) {
    return { title: 'Review Not Found | Whit Logic' };
  }

  return {
    title: `${post.title} | Whit Logic Reviews`,
    description: `Read our comprehensive review of the ${post.brand} ${post.modelNumber} tactical watch. Find the best budget sports watches.`,
    openGraph: {
      title: post.title,
      description: `In-depth review of the ${post.brand} ${post.modelNumber} tactical watch.`,
      url: `https://whitlogic.online/watch-reviews/${post.slug}`,
      siteName: 'Whit Logic',
      images: [
        {
          url: post.imageUrl,
          width: 1080,
          height: 1080,
          alt: post.title,
        },
      ],
      type: 'article',
    },
    alternates: {
      canonical: `https://whitlogic.online/watch-reviews/${post.slug}`,
    },
  };
}

export default async function WatchReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.imageUrl,
    author: {
      '@type': 'Organization',
      name: 'Whit Logic',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Whit Logic',
      logo: {
        '@type': 'ImageObject',
        url: 'https://whitlogic.online/logo.png', // Replace with actual logo URL
      },
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  };

  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: `${post.brand} ${post.modelNumber}`,
    image: post.imageUrl,
    brand: {
      '@type': 'Brand',
      name: post.brand,
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '4.5',
        bestRating: '5',
        worstRating: '1',
      },
      author: {
        '@type': 'Person',
        name: 'Whit Logic Editorial Team',
      },
    },
  };


  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://whitlogic.online',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Watch Reviews',
        item: 'https://whitlogic.online/#reviews',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://whitlogic.online/watch-reviews/${post.slug}`,
      },
    ],
  };

  // Adding generic FAQ schema for SEO
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is the ${post.brand} ${post.modelNumber} a good watch?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, the ${post.brand} ${post.modelNumber} offers excellent durability and features for its budget-friendly price point, making it a highly recommended tactical watch.`,
        },
      },
      {
        '@type': 'Question',
        name: `Where can I buy the ${post.brand} ${post.modelNumber}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can securely purchase the ${post.brand} ${post.modelNumber} directly on Amazon through our verified affiliate link in the review.`,
        },
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <article className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 font-sans">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-slate-500 mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-slate-400">/</span>
                <Link href="/#reviews" className="hover:text-slate-900 transition-colors">Reviews</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-slate-400">/</span>
                <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-xs">{post.brand} {post.modelNumber}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {post.title}
          </h1>
          <div className="flex justify-center items-center space-x-4 text-sm text-slate-500 font-medium">
            <span>By Whit Logic</span>
            <span>&bull;</span>
            <time dateTime={post.createdAt.toISOString()}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-xl mb-12 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          {/* Subtle overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Affiliate CTA - Top */}
        <div className="flex justify-center mb-12">
          <a
            href={post.amazonAffiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-amber-500 rounded-full shadow-lg hover:bg-amber-600 hover:shadow-xl hover:-translate-y-1 focus:ring-4 focus:ring-amber-300"
          >
            Check Latest Price on Amazon
            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </a>
        </div>

        {/* Specification Table */}
        <SpecTable brand={post.brand} modelNumber={post.modelNumber} />

        {/* Rich Content (from Gemini) */}
        <div 
          className="prose prose-lg prose-slate max-w-none mb-12 prose-headings:font-bold prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-2xl prose-h3:mt-8 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-amber-600 prose-a:font-semibold hover:prose-a:text-amber-700 prose-ul:pl-6 prose-li:my-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Affiliate CTA - Bottom */}
        <div className="p-8 mt-12 bg-slate-50 rounded-2xl border border-slate-200 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to upgrade your tactical gear?</h3>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Grab the {post.brand} {post.modelNumber} today and experience premium durability on a budget.
          </p>
          <a
            href={post.amazonAffiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-white transition-all duration-200 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 focus:ring-4 focus:ring-blue-300"
          >
            Buy it now on Amazon
          </a>
          <p className="mt-4 text-xs text-slate-400">
            *As an Amazon Associate, we earn from qualifying purchases at no extra cost to you.
          </p>
        </div>

        {/* Author Bio Box (E-E-A-T) */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-slate-900 flex-shrink-0 flex items-center justify-center text-white text-3xl font-black">
            WL
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-xl font-bold text-slate-900 mb-2">About the Reviewer: Whit Logic Team</h4>
            <p className="text-slate-600 leading-relaxed">
              We are passionate experts in budget tactical gear and sports watches. Our mission is to independently review, test, and analyze affordable watches so you can make confident purchasing decisions for your outdoor adventures.
            </p>
          </div>
        </div>

      </article>

      {/* Sticky Mobile Buy Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1)] sm:hidden z-50 flex justify-center">
        <a
          href={post.amazonAffiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-sm flex items-center justify-center px-6 py-4 text-lg font-bold text-slate-900 bg-amber-500 rounded-xl shadow-md hover:bg-amber-400 active:bg-amber-600 transition-colors"
        >
          View Price on Amazon
        </a>
      </div>
    </>
  );
}
