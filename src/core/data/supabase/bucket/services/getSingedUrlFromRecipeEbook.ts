import { supabase } from "@core/data/client";

export default async function getSingedUrlFromRecipeEbook() {
  const { data } = await supabase.storage
    .from("private-assets")
    .createSignedUrl("recipe-ebooks/Recetario para Fiestas Saludable (1).pdf", 3600);

  if (!data) {
    throw new Error("Asset not founded");
  }

  return data.signedUrl;
}
