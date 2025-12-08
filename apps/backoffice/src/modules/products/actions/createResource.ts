'use server';

import SupabaseRepository from '@core/data/supabase/supabase.repository';

export async function createResource(data: {
  folder: string;
  url: string;
  provider: 'SUPABASE' | 'CLOUDFLARE_R2';
  bucket: 'products' | 'public-assets' | string;
}) {
  const repo = SupabaseRepository();
  await repo.resources.create(data);
}
