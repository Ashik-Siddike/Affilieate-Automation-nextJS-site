"use client";
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  const links = {
    Reviews: [
      { label: 'Tactical Watches', href: '/#reviews' },
      { label: 'Sports Watches', href: '/#reviews' },
      { label: 'SKMEI Reviews', href: '/#reviews' },
      { label: 'CURREN Reviews', href: '/#reviews' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Affiliate Disclosure', href: '/disclosure' },
    ],
  };

  return (
    <footer style={{ background: '#0a0f1d', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Main Footer Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 40px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px', flexWrap: 'wrap' }}>
          {/* Brand Column */}
          <div>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Whit Logic" style={{ height: '56px', width: 'auto', borderRadius: '12px' }} />
            </Link>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '300px', margin: '24px 0' }}>
              Your trusted source for independent budget tactical and sports watch reviews. 
              We test, analyze, and report — so you can shop with confidence.
            </p>
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: '📘', label: 'Facebook', href: 'https://facebook.com/whitlogic' },
                { icon: '📌', label: 'Pinterest', href: 'https://pinterest.com/whitlogic' },
                { icon: '📸', label: 'Instagram', href: 'https://instagram.com/whitlogic' },
                { icon: '🐦', label: 'Twitter/X', href: 'https://x.com/whitlogic' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.2)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.4)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h3 style={{ color: '#fde68a', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                {section}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s', fontWeight: '500' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#94a3b8')}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.6, maxWidth: '700px' }}>
            ⚠️ <strong style={{ color: '#94a3b8' }}>Affiliate Disclosure:</strong>{' '}
            Whit Logic is a participant in the Amazon Services LLC Associates Program. 
            We earn commissions from qualifying purchases at no extra cost to you.
          </p>
          <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>
            © {year} Whit Logic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
