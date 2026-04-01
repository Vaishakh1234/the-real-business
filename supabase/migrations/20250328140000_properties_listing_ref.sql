-- Human-readable listing reference (e.g. TRB-000001) for admin/public display and lookup.
-- Generated on INSERT; immutable after insert.

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS listing_ref TEXT;

WITH numbered AS (
  SELECT id, row_number() OVER (ORDER BY created_at ASC, id ASC) AS n
  FROM public.properties
  WHERE listing_ref IS NULL
)
UPDATE public.properties p
SET listing_ref = 'TRB-' || lpad(n.n::text, 6, '0')
FROM numbered n
WHERE p.id = n.id;

CREATE UNIQUE INDEX IF NOT EXISTS properties_listing_ref_key ON public.properties (listing_ref);

ALTER TABLE public.properties
  ALTER COLUMN listing_ref SET NOT NULL;

CREATE SEQUENCE IF NOT EXISTS properties_listing_ref_seq;

SELECT setval(
  'properties_listing_ref_seq',
  COALESCE(
    (
      SELECT MAX((regexp_match(listing_ref, '^TRB-([0-9]+)$'))[1]::bigint)
      FROM public.properties
    ),
    1
  ),
  COALESCE(
    (
      SELECT MAX((regexp_match(listing_ref, '^TRB-([0-9]+)$'))[1]::bigint)
      FROM public.properties
    ) IS NOT NULL,
    false
  )
);

CREATE OR REPLACE FUNCTION public.set_properties_listing_ref()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.listing_ref IS NULL OR TRIM(COALESCE(NEW.listing_ref, '')) = '' THEN
    NEW.listing_ref := 'TRB-' || lpad(nextval('properties_listing_ref_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_set_listing_ref ON public.properties;
CREATE TRIGGER properties_set_listing_ref
  BEFORE INSERT ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.set_properties_listing_ref();

CREATE OR REPLACE FUNCTION public.freeze_properties_listing_ref()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.listing_ref IS DISTINCT FROM OLD.listing_ref THEN
    NEW.listing_ref := OLD.listing_ref;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_freeze_listing_ref ON public.properties;
CREATE TRIGGER properties_freeze_listing_ref
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.freeze_properties_listing_ref();
