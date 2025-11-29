import { supabase } from '@core/data/supabase/client';
import { Resource } from '../resources.repository';

export default async function updateResource(
  id: string,
  resource: Partial<Omit<Resource, 'id' | 'created_at'>>
): Promise<Resource> {
  const { data, error } = await supabase
    .from('resources')
    .update(resource)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
