import { supabase } from '@core/data/client';
import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanatizeCreatedAtFromObject';
import { User } from '../users.repository';

export default async function createUser(
  email: string,
  name: string
): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert({ email, name })
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length === 0 || !data[0]) {
    throw new Error('Error al obtener usuario creado');
  }

  return sanatizeCreatedAtFromObject(data[0]);
}
