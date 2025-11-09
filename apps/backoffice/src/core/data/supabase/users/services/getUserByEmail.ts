import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanatizeCreatedAtFromObject';
import { supabase } from '../../client';
import { User } from '../users.repository';
export default async function getUserByEmail(
  email: string
): Promise<User | null> {
  const { data } = await supabase.from('users').select().eq('email', email);
  return data && data.length > 0 && data[0]
    ? sanatizeCreatedAtFromObject(data[0])
    : null;
}
