-- Allow duplicate listing titles (e.g. multiple owner submissions with generic titles).
-- Slug remains unique; public submission API generates slugify(title) + short suffix.
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_title_unique;
