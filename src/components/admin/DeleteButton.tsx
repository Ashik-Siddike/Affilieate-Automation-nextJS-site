'use client';

import { useState } from 'react';
import { deleteReviewAction } from '@/app/admin/actions';

export default function DeleteButton({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    setDeleting(true);
    const res = await deleteReviewAction(id);
    
    if (!res.success) {
      alert(res.error || 'Failed to delete');
      setDeleting(false);
    }
    // If successful, the server action revalidates the path, so the UI will automatically update!
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      style={{
        background: 'transparent',
        color: '#ef4444',
        border: 'none',
        cursor: deleting ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        opacity: deleting ? 0.5 : 1,
      }}
    >
      {deleting ? '...' : 'Delete'}
    </button>
  );
}
