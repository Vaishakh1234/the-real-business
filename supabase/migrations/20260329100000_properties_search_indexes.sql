-- Wider substring search + indexes for ILIKE-style lookups (pg_trgm).
-- Adds generated `price_search_text` so numeric price is searchable as text.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Must be IMMUTABLE for GENERATED STORED; to_char/regexp_replace are not (locale-dependent).
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS price_search_text text
  GENERATED ALWAYS AS (
    CASE
      WHEN price IS NULL THEN ''
      ELSE price::text
    END
  ) STORED;

-- Speed up %term% filters on commonly searched columns
CREATE INDEX IF NOT EXISTS properties_title_trgm_idx
  ON public.properties USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_short_description_trgm_idx
  ON public.properties USING gin (short_description gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_description_trgm_idx
  ON public.properties USING gin (description gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_address_trgm_idx
  ON public.properties USING gin (address gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_city_trgm_idx
  ON public.properties USING gin (city gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_state_trgm_idx
  ON public.properties USING gin (state gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_zip_code_trgm_idx
  ON public.properties USING gin (zip_code gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_country_trgm_idx
  ON public.properties USING gin (country gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_listing_ref_trgm_idx
  ON public.properties USING gin (listing_ref gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_plot_number_trgm_idx
  ON public.properties USING gin (plot_number gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_slug_trgm_idx
  ON public.properties USING gin (slug gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_facing_trgm_idx
  ON public.properties USING gin (facing gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_meta_title_trgm_idx
  ON public.properties USING gin (meta_title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_meta_description_trgm_idx
  ON public.properties USING gin (meta_description gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_meta_keywords_trgm_idx
  ON public.properties USING gin (meta_keywords gin_trgm_ops);

CREATE INDEX IF NOT EXISTS properties_price_search_text_trgm_idx
  ON public.properties USING gin (price_search_text gin_trgm_ops);
