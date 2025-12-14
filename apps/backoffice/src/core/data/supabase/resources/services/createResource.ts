import { supabase } from '@core/data/supabase/client';
import { Resource } from '../resources.repository';

export default async function createResource(
  resource: Omit<Resource, 'id' | 'created_at'>
): Promise<Resource> {
  const { data, error } = await supabase
    .from('resources')
    .insert(resource)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
