-- Free-form tags per listing (admin grouping / related-by-tag).
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS properties_tags_gin_idx
  ON public.properties USING GIN (tags);
