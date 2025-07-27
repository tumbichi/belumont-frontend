import { supabase } from '@core/data/client';
import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanatizeCreatedAtFromObject';
import { User } from '../users.repository';

export default async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select().eq('id', id);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0 || !data[0]) {
    return null;
  }

  return sanatizeCreatedAtFromObject(data[0]);
}
