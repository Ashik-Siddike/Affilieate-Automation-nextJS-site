import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://whitlogic.online/watch-reviews/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://whitlogic.online',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postEntries,
  ];
}
