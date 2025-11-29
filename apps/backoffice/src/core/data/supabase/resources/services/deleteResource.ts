import { supabase } from '@core/data/supabase/client';

export default async function deleteResource(id: string): Promise<void> {
  const { error } = await supabase.from('resources').delete().eq('id', id);

  if (error) {
    throw error;
  }
}
