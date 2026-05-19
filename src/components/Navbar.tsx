'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#reviews', label: 'Reviews' },
    { href: '/#trending', label: 'Trending' },
  ];

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isScrolled
          ? 'rgba(15, 23, 42, 0.95)'
          : 'rgba(15, 23, 42, 1)',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.3s ease',
        boxShadow: isScrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '900', color: 'white',
            }}>W</div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', letterSpacing: '-0.03em' }}>
              WHIT <span style={{ color: '#f59e0b' }}>LOGIC</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: '#94a3b8', textDecoration: 'none', fontWeight: '500',
                  fontSize: '0.9rem', transition: 'color 0.2s', letterSpacing: '0.01em',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/#reviews"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                color: 'white', padding: '8px 20px', borderRadius: '8px',
                fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(245, 158, 11, 0.4)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)'; }}
            >
              🔥 Best Picks
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              style={{
                display: 'none', background: 'none', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'white',
                fontSize: '1.2rem', lineHeight: 1,
              }}
              className="hamburger-btn"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: '16px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                style={{
                  color: '#94a3b8', textDecoration: 'none', padding: '10px 0',
                  fontWeight: '500', fontSize: '0.95rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
