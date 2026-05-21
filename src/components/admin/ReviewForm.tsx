'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteReviewAction } from '@/app/admin/actions';

export default function ReviewForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    amazonAffiliateLink: '',
    imageUrl: '',
    brand: '',
    modelNumber: '',
    category: 'tactical',
    ratingValue: '4.5',
    ratingCount: '89',
    isDeal: false,
    discountPercentage: '',
    isVsArticle: false,
    tags: '',
    faqs: '',
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/reviews/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch');
          return res.json();
        })
        .then((data) => {
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            content: data.content || '',
            amazonAffiliateLink: data.amazonAffiliateLink || '',
            imageUrl: data.imageUrl || '',
            brand: data.brand || '',
            modelNumber: data.modelNumber || '',
            category: data.category || 'tactical',
            ratingValue: data.ratingValue?.toString() || '4.5',
            ratingCount: data.ratingCount?.toString() || '0',
            isDeal: data.isDeal || false,
            discountPercentage: data.discountPercentage || '',
            isVsArticle: data.isVsArticle || false,
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
            faqs: data.faqs ? JSON.stringify(data.faqs, null, 2) : '',
          });
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      // Auto-generate slug from title
      if (name === 'title' && isNew) {
        const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setFormData((prev) => ({ ...prev, title: value, slug }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? `/api/admin/reviews` : `/api/admin/reviews/${id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save');
      }

      router.push('/admin/reviews');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    setDeleting(true);
    try {
      const res = await deleteReviewAction(id);
      if (!res.success) throw new Error(res.error || 'Failed to delete');
      router.push('/admin/reviews');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{isNew ? 'New Review' : 'Edit Review'}</h1>
        {!isNew && (
          <button 
            type="button" 
            onClick={handleDelete} 
            disabled={deleting}
            style={{ background: '#ef4444', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            {deleting ? 'Deleting...' : 'Delete Review'}
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Title *</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Slug *</label>
            <input required type="text" name="slug" value={formData.slug} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Brand</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Model Number</label>
            <input type="text" name="modelNumber" value={formData.modelNumber} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
              <option value="tactical">Tactical</option>
              <option value="sports">Sports</option>
              <option value="military">Military</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Rating Value</label>
            <input type="number" step="0.1" max="5" name="ratingValue" value={formData.ratingValue} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Rating Count</label>
            <input type="number" name="ratingCount" value={formData.ratingCount} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Image URL</label>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Amazon Affiliate Link</label>
            <input type="text" name="amazonAffiliateLink" value={formData.amazonAffiliateLink} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Tags (comma separated)</label>
          <input type="text" name="tags" value={formData.tags} onChange={handleChange} style={inputStyle} placeholder="e.g. waterproof, durable, g-shock" />
        </div>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer' }}>
            <input type="checkbox" name="isDeal" checked={formData.isDeal} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
            Is Deal?
          </label>
          {formData.isDeal && (
            <input type="text" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} placeholder="e.g. 50%" style={{ ...inputStyle, width: '120px' }} />
          )}
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' }}>
            <input type="checkbox" name="isVsArticle" checked={formData.isVsArticle} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
            Is VS Article?
          </label>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Content (HTML) *</label>
          <textarea required name="content" value={formData.content} onChange={handleChange} style={{ ...inputStyle, height: '400px', fontFamily: 'monospace' }} />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>FAQs (JSON format)</label>
          <textarea name="faqs" value={formData.faqs} onChange={handleChange} style={{ ...inputStyle, height: '150px', fontFamily: 'monospace' }} placeholder='[{"q": "Is it waterproof?", "a": "Yes."}]' />
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button type="submit" disabled={saving} style={{ background: '#10b981', color: 'white', padding: '14px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1.1rem' }}>
            {saving ? 'Saving...' : 'Save Review'}
          </button>
          <button type="button" onClick={() => router.push('/admin/reviews')} style={{ background: '#e2e8f0', color: '#475569', padding: '14px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1.1rem' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '1rem',
  outline: 'none',
};
