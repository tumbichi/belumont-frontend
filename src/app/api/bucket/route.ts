import BucketRepository from "@core/data/supabase/bucket/bucket.repository";

export async function GET(request: Request) {
  const singedUrl = await BucketRepository().getSingedUrlFromRecipeEbook();

  return Response.json({ singedUrl });
}
