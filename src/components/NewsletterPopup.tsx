'use client';

import { useState, useEffect } from 'react';

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Show after 10 seconds if they haven't seen it recently
    const hasSeen = localStorage.getItem('hasSeenNewsletter');
    if (!hasSeen) {
      const timer = setTimeout(() => setShow(true), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('hasSeenNewsletter', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Subscribed!');
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to connect.');
    }
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)',
      padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', width: 'calc(100% - 48px)', maxWidth: '380px',
      color: 'white', animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      <button onClick={handleClose} style={{
        position: 'absolute', top: '12px', right: '12px', background: 'transparent',
        border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem'
      }}>✕</button>
      
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📬</div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
        Get the best deals first
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
        Join 50,000+ others and get our weekly roundup of the best budget watch reviews & deals.
      </p>
      
      {status === 'success' ? (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="Your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
            style={{
              padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.9rem', outline: 'none'
            }}
          />
          <button type="submit" disabled={status === 'loading'} style={{
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            color: 'white', fontWeight: 700, padding: '12px', borderRadius: '8px', border: 'none',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer', fontSize: '0.9rem', transition: 'opacity 0.2s',
            opacity: status === 'loading' ? 0.7 : 1
          }}>
            {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
          </button>
          {status === 'error' && <div style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>{message}</div>}
        </form>
      )}
    </div>
  );
}
