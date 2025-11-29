import { supabase } from '@core/data/supabase/client';
import { Resource } from '../resources.repository';

export default async function getResourceByUrl(
  url: string
): Promise<Resource | null> {
  const { data, error } = await supabase
    .from('resources')
    .select()
    .eq('url', url)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
}
