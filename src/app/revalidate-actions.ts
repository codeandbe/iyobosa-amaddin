'use server';

import { revalidatePath } from 'next/cache';

export async function revalidatePortfolioPages() {
  revalidatePath('/');
  revalidatePath('/projects');
  revalidatePath('/skills');
  revalidatePath('/experience');
  revalidatePath('/blog');
  revalidatePath('/contact');
}
