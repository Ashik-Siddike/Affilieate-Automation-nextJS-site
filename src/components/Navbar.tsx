'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/watches/tactical', label: 'Tactical' },
    { href: '/watches/budget-under-20', label: 'Under $20' },
    { href: '/watches/waterproof', label: 'Waterproof' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 1) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isScrolled
          ? 'rgba(15, 23, 42, 0.75)'
          : 'rgba(15, 23, 42, 1)',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isScrolled ? '0 10px 30px -10px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Whit Logic" style={{ height: '44px', width: 'auto', borderRadius: '8px' }} />
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: '#94a3b8', textDecoration: 'none', fontWeight: '600',
                  fontSize: '0.9rem', transition: 'color 0.2s', letterSpacing: '0.02em',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search, CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="desktop-search" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search watches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '999px',
                  padding: '8px 16px 8px 36px',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '200px',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.15)';
                  e.target.style.borderColor = '#f59e0b';
                  e.target.style.width = '240px';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.08)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.width = '200px';
                }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '14px' }}>🔍</span>
            </form>

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
            padding: '16px 0',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Search watches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  padding: '12px 16px 12px 36px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  width: '100%',
                }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '16px' }}>🔍</span>
            </form>
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
          .desktop-search { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
