'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

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

export async function loginAction(password: string) {
  // Use environment variable or fallback to a default for local development safety
  const correctPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (password === correctPassword) {
    cookies().set('admin_token', 'authenticated_admin_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return { success: true };
  }
  
  return { success: false, error: 'Incorrect password' };
}

export async function logoutAction() {
  cookies().delete('admin_token');
  return { success: true };
}
