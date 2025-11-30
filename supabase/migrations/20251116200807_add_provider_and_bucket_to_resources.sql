ALTER TABLE public.resources
ADD COLUMN provider TEXT NOT NULL DEFAULT 'SUPABASE',
ADD COLUMN bucket TEXT NOT NULL DEFAULT 'public-assets';

CREATE TYPE public.resource_provider AS ENUM (
    'SUPABASE',
    'CLOUDFLARE_R2'
);

ALTER TABLE public.resources
ALTER COLUMN provider DROP DEFAULT,
ALTER COLUMN provider TYPE public.resource_provider USING (provider::public.resource_provider),
ALTER COLUMN provider SET DEFAULT 'SUPABASE';
