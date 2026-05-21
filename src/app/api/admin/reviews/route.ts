import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Basic validation
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    // Process faqs if it comes as a string from the form
    let faqs = data.faqs;
    if (typeof faqs === 'string' && faqs.trim().length > 0) {
      try {
        faqs = JSON.parse(faqs);
      } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON format for FAQs' }, { status: 400 });
      }
    } else if (typeof faqs === 'string') {
      faqs = null;
    }

    // Process tags
    let tags = data.tags || [];
    if (typeof tags === 'string') {
      tags = tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const newPost = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        amazonAffiliateLink: data.amazonAffiliateLink || '',
        imageUrl: data.imageUrl || '',
        brand: data.brand || '',
        modelNumber: data.modelNumber || '',
        isDeal: !!data.isDeal,
        discountPercentage: data.discountPercentage || null,
        ratingValue: parseFloat(data.ratingValue) || 4.5,
        ratingCount: parseInt(data.ratingCount, 10) || 0,
        category: data.category || 'tactical',
        isVsArticle: !!data.isVsArticle,
        faqs: faqs,
        tags: tags,
      },
    });

    return NextResponse.json(newPost);
  } catch (error: any) {
    console.error('Error creating post:', error);
    // Handle unique constraint violation for slug
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A review with this slug already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
