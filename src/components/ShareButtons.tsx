'use client';

import { useState, useEffect } from 'react';

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
        </svg>
      ),
      color: '#1877F2',
      hoverColor: '#166fe5'
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
      color: '#000000',
      hoverColor: '#333333'
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 0C5.385 0 .002 5.385.002 12.033c0 2.126.551 4.202 1.597 6.034L.027 24l6.103-1.602c1.77.94 3.753 1.436 5.897 1.436h.004c6.645 0 12.031-5.386 12.031-12.032S18.676 0 12.031 0zm0 21.84c-1.799 0-3.565-.483-5.112-1.401l-.367-.217-3.8.997.997-3.702-.238-.378C2.553 15.541 2.015 13.805 2.015 12.033c0-5.53 4.502-10.033 10.034-10.033 2.68 0 5.197 1.045 7.091 2.94 1.896 1.894 2.938 4.414 2.938 7.093 0 5.53-4.503 10.031-10.032 10.031..."/>
        </svg>
      ),
      color: '#25D366',
      hoverColor: '#20bd5a'
    }
  ];

  // Simplified WhatsApp Path since standard doesn't fit exactly in string above without making it massive
  const whatsappIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );

  shareLinks[2].icon = whatsappIcon;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (!url) return null; // Avoid hydration mismatch

  return (
    <>
      <div className="floating-share hidden lg:flex">
        <span className="share-text">SHARE</span>
        
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
            className="share-btn"
            style={{ '--hover-bg': link.color } as React.CSSProperties}
          >
            {link.icon}
          </a>
        ))}
        
        <button
          onClick={copyToClipboard}
          aria-label="Copy Link"
          className="share-btn copy-btn"
          title="Copy Link"
        >
          {copied ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>

      <div className="mobile-share flex lg:hidden">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
            className="mobile-share-btn"
            style={{ background: link.color }}
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          aria-label="Copy Link"
          className="mobile-share-btn"
          style={{ background: copied ? '#25D366' : '#64748b' }}
        >
          {copied ? 'Copied!' : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>

      <style jsx>{`
        .floating-share {
          position: fixed;
          left: 24px;
          top: 50%;
          transform: translateY(-50%);
          flex-direction: column;
          gap: 12px;
          z-index: 50;
          background: white;
          padding: 16px 12px;
          border-radius: 99px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.15);
          border: 1px solid #f1f5f9;
        }

        .share-text {
          font-size: 10px;
          font-weight: 800;
          color: #94a3b8;
          text-align: center;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }

        .share-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          background: #f8fafc;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .share-btn:hover {
          background: var(--hover-bg, #0f172a);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .copy-btn:hover {
          background: #0f172a;
        }

        .mobile-share {
          position: fixed;
          bottom: 96px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 12px 20px;
          border-radius: 99px;
          gap: 16px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.25);
          z-index: 50;
          border: 1px solid #f1f5f9;
        }

        .mobile-share-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: none;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
}
