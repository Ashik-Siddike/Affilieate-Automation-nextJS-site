'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteReviewAction(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });
    revalidatePath('/admin/reviews');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete review:', error);
    return { success: false, error: 'Failed to delete review' };
  }
}
