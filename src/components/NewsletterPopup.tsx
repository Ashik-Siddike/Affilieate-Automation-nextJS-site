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
      position: 'fixed',
      bottom: '24px',
      right: '24px', // Align to right for standard, professional desktop layout
      zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '28px',
      borderRadius: '24px',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 24px 60px -15px rgba(0,0,0,0.7)',
      width: 'calc(100% - 32px)',
      maxWidth: '380px',
      color: 'white',
      boxSizing: 'border-box',
      animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      // Responsive adjustments for mobile: center it nicely
      margin: '0 auto',
      left: 'auto',
      transform: 'none',
    }}
    className="newsletter-popup-container"
    >
      {/* Dynamic CSS for CSS Transitions, Hover Effects, and Responsive Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .close-btn-popup {
          transition: all 0.2s ease;
        }
        .close-btn-popup:hover {
          color: white !important;
          transform: rotate(90deg);
        }
        
        .popup-input-field {
          transition: all 0.2s ease;
        }
        .popup-input-field:focus {
          border-color: #f59e0b !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
          background: rgba(255,255,255,0.08) !important;
        }
        
        .popup-submit-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .popup-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -6px rgba(239, 68, 68, 0.5);
          filter: brightness(1.1);
        }
        .popup-submit-btn:active {
          transform: translateY(0);
        }

        /* Responsive Mobile Specific override */
        @media (max-width: 640px) {
          .newsletter-popup-container {
            right: 16px !important;
            bottom: 16px !important;
            width: calc(100% - 32px) !important;
            max-width: 100% !important;
            padding: 24px !important;
            border-radius: 20px !important;
          }
        }
      `}</style>

      <button 
        onClick={handleClose} 
        className="close-btn-popup"
        style={{
          position: 'absolute', 
          top: '16px', 
          right: '16px', 
          background: 'rgba(255,255,255,0.05)',
          border: 'none', 
          color: '#94a3b8', 
          cursor: 'pointer', 
          fontSize: '14px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          lineHeight: '1'
        }}
      >
        ✕
      </button>
      
      <div style={{ fontSize: '2.5rem', marginBottom: '12px', display: 'inline-block' }}>📬</div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.025em' }}>
        Get the best deals first
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '20px', lineHeight: 1.6, fontWeight: 400 }}>
        Join 50,000+ others and get our weekly roundup of the best budget watch reviews & deals.
      </p>
      
      {status === 'success' ? (
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.08)', 
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: '#34d399', 
          padding: '16px', 
          borderRadius: '12px', 
          fontSize: '0.9rem', 
          fontWeight: 600, 
          textAlign: 'center' 
        }}>
          ✨ {message}
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
            className="popup-input-field"
            style={{
              padding: '14px 16px', 
              borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)', 
              color: 'white', 
              fontSize: '0.9rem', 
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          <button 
            type="submit" 
            disabled={status === 'loading'} 
            className="popup-submit-btn"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: 'white', 
              fontWeight: 700, 
              padding: '14px', 
              borderRadius: '12px', 
              border: 'none',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer', 
              fontSize: '0.95rem',
              opacity: status === 'loading' ? 0.7 : 1,
              width: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
          </button>
          {status === 'error' && (
            <div style={{ 
              color: '#f87171', 
              fontSize: '0.8rem', 
              textAlign: 'center', 
              background: 'rgba(239, 68, 68, 0.08)',
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.15)'
            }}>
              {message}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
