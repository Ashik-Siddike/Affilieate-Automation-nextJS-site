import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();

    // Basic validation
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    // Process faqs
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

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
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

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error('Error updating post:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A review with this slug already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.post.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
