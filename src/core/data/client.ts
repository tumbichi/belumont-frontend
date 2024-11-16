import { Database } from "@core/types/supabase";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
  `https://${process.env.SUPABASE_DOMAIN}`,
  String(process.env.SUPABASE_API_KEY)
);
