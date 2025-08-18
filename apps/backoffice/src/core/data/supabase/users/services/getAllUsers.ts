import { supabase } from '@core/data/client';
import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanatizeCreatedAtFromObject';
import { User } from '../users.repository';

export default async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map((user) => sanatizeCreatedAtFromObject(user));
}
