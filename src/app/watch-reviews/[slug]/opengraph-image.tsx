import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const alt = 'Watch Review | Whit Logic';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post) {
    return new ImageResponse(
      (
        <div style={{ background: '#0f172a', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'white', fontSize: 60, fontWeight: 900 }}>Review Not Found</div>
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          padding: 60,
          fontFamily: 'Inter',
        }}
      >
        {/* Left side: Text Content */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '60%', justifyContent: 'center', paddingRight: 60 }}>
          <div
            style={{
              color: '#f59e0b',
              fontSize: 28,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 24,
            }}
          >
            🔥 In-Depth Review
          </div>
          <h1
            style={{
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.1,
              margin: 0,
              marginBottom: 32,
              color: 'white',
            }}
          >
            {post.brand} {post.modelNumber}
          </h1>
          <div style={{ fontSize: 36, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#fbbf24' }}>★★★★½</span>
            <span>Expert Verdict</span>
          </div>
        </div>

        {/* Right side: Product Image */}
        <div
          style={{
            width: '40%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            borderRadius: 32,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            border: '8px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: 40,
            }}
            alt="Watch"
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
