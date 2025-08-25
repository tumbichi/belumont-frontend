import { Database } from '@core/data/supabase/types/supabase';
import { createClient } from '@supabase/supabase-js';

const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:54321'
    : `https://${process.env.SUPABASE_DOMAIN}`;

export const supabase = createClient<Database>(
  url,
  String(process.env.SUPABASE_API_KEY)
);
