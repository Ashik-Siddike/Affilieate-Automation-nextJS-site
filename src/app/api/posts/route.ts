import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Helper to create a slug from a title
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

export async function POST(req: Request) {
  try {
    // 1. Security Check
    const apiSecret = req.headers.get('x-bot-api-secret');
    if (apiSecret !== process.env.BOT_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, amazonAffiliateLink, imageUrl, brand, modelNumber } = body;

    // Validate payload
    if (!title || !content || !amazonAffiliateLink || !imageUrl || !brand || !modelNumber) {
      return NextResponse.json({ error: 'Missing required payload fields' }, { status: 400 });
    }

    // 2. Generate unique clean slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure unique slug
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 3. Upsert/Insert the post into the Database
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        amazonAffiliateLink,
        imageUrl,
        brand,
        modelNumber,
      },
    });

    // 4. Trigger Make.com Webhook asynchronously
    if (process.env.MAKE_WEBHOOK_URL) {
      const websiteUrl = `https://whitlogic.online/watch-reviews/${slug}`;
      fetch(process.env.MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          websiteUrl,
          composedImageUrl: imageUrl,
          facebookCaption: `🔥 Looking for a rugged ${brand} watch? Check out our latest review!\n\nRead more: ${websiteUrl}`,
          pinterestCaption: `Best Budget Tactical Watch: ${title}. Perfect for outdoors! #tacticalwatch #${brand.toLowerCase()}`,
          instagramCaption: `Built for the outdoors. ⛰️\n\n⌚ ${title}\n\nLink in bio!\n#whitlogic #tacticalgear`
        }),
      }).catch(err => console.error('Make Webhook error:', err));
    }

    // 5. On-Demand Revalidation
    revalidatePath('/'); // Revalidate home page
    revalidatePath(`/watch-reviews/${slug}`); // Revalidate specific post

    // 6. Return Success
    return NextResponse.json({ 
      success: true, 
      message: 'Post created and synced successfully',
      post_id: post.id,
      slug: post.slug
    }, { status: 201 });

  } catch (error: any) {
    console.error('API Post Creation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
