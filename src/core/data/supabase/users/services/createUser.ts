import { supabase } from "@core/data/client";

export default async function createUser(email: string, name: string): Promise<void> {
  const { error } = await supabase.from("users").insert({ email, name });

  if (error) {
    throw error;
  }
}
