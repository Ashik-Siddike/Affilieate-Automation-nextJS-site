'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  brand: string;
  ratingValue: number;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
          const data = await res.json();
          setSearchResults(data.results?.slice(0, 5) || []);
          setShowDropdown(true);
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/category/tactical', label: 'Tactical' },
    { href: '/category/sports', label: 'Sports' },
    { href: '/category/military', label: 'Military' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
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
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: isActive ? '#ffffff' : '#94a3b8', textDecoration: 'none', fontWeight: isActive ? '700' : '600',
                    fontSize: '0.9rem', transition: 'all 0.2s', letterSpacing: '0.02em', position: 'relative'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? '#ffffff' : '#94a3b8')}
                >
                  {link.label}
                  {isActive && (
                    <div style={{ position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '2px', background: '#f59e0b', borderRadius: '2px' }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search, CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* Desktop Search */}
            <div ref={searchRef} className="desktop-search" style={{ position: 'relative' }}>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search watches..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim().length > 0) setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) setShowDropdown(true);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: showDropdown && searchResults.length > 0 ? '20px 20px 0 0' : '999px',
                    padding: '8px 16px 8px 36px',
                    color: 'white',
                    fontSize: '0.85rem',
                    outline: 'none',
                    width: showDropdown ? '300px' : '220px',
                    transition: 'all 0.3s ease',
                  }}
                />
                <span style={{ position: 'absolute', left: '12px', top: '9px', opacity: 0.5, fontSize: '14px' }}>🔍</span>
              </form>
              
              {/* Desktop Live Search Dropdown */}
              {showDropdown && searchQuery.trim().length >= 2 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.15)', borderTop: 'none',
                  borderRadius: '0 0 16px 16px', overflow: 'hidden',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', zIndex: 100,
                }}>
                  {isSearching ? (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((res) => (
                        <Link key={res.id} href={`/watch-reviews/${res.slug}`} onClick={() => setShowDropdown(false)} style={{
                          display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', textDecoration: 'none',
                          borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, background: '#f1f5f9' }}>
                            <Image src={res.imageUrl} alt={res.title} fill style={{ objectFit: 'cover' }} sizes="36px" />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                              {res.title}
                            </span>
                            <span style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                              {res.brand} • ★ {res.ratingValue}
                            </span>
                          </div>
                        </Link>
                      ))}
                      <div style={{ padding: '8px', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
                        <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} onClick={() => setShowDropdown(false)} style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                          View all results →
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>No results found.</div>
                  )}
                </div>
              )}
            </div>

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
            <div ref={mobileSearchRef} style={{ position: 'relative', marginBottom: '12px' }}>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search watches..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim().length > 0) setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) setShowDropdown(true);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: showDropdown && searchResults.length > 0 ? '8px 8px 0 0' : '8px',
                    padding: '12px 16px 12px 36px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    width: '100%',
                  }}
                />
                <span style={{ position: 'absolute', left: '12px', top: '13px', opacity: 0.5, fontSize: '16px' }}>🔍</span>
              </form>
              
              {/* Mobile Live Search Dropdown */}
              {showDropdown && searchQuery.trim().length >= 2 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.15)', borderTop: 'none',
                  borderRadius: '0 0 8px 8px', overflow: 'hidden',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', zIndex: 100,
                }}>
                  {isSearching ? (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((res) => (
                        <Link key={res.id} href={`/watch-reviews/${res.slug}`} onClick={() => { setShowDropdown(false); setIsOpen(false); }} style={{
                          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', textDecoration: 'none',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                        }}>
                          <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, background: '#f1f5f9' }}>
                            <Image src={res.imageUrl} alt={res.title} fill style={{ objectFit: 'cover' }} sizes="40px" />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                              {res.title}
                            </span>
                            <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                              {res.brand} • ★ {res.ratingValue}
                            </span>
                          </div>
                        </Link>
                      ))}
                      <div style={{ padding: '12px', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
                        <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} onClick={() => { setShowDropdown(false); setIsOpen(false); }} style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
                          View all results →
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No results found.</div>
                  )}
                </div>
              )}
            </div>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    color: isActive ? '#f59e0b' : '#94a3b8', 
                    textDecoration: 'none', 
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(245,158,11,0.05)' : 'transparent',
                    fontWeight: isActive ? '700' : '500', 
                    fontSize: '0.95rem',
                    display: 'block'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
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
