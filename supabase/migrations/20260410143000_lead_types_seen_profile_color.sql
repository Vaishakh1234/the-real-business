-- Lead intent types, admin read tracking, and deterministic avatar palette (set on insert).

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS lead_type TEXT NOT NULL DEFAULT 'enquiry';

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS seen_at TIMESTAMPTZ;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS profile_bg_color TEXT;

-- Backfill existing rows
UPDATE public.leads
SET lead_type = 'general'
WHERE name = 'Newsletter signup';

UPDATE public.leads
SET lead_type = 'site_visit'
WHERE message IS NOT NULL
  AND message LIKE '%[Site visit request]%'
  AND lead_type = 'enquiry';

-- Palette: light pastel backgrounds only (pairs with dark slate initial text in UI)
UPDATE public.leads
SET profile_bg_color = (
  ARRAY[
    '#DBEAFE',
    '#FCE7F3',
    '#D1FAE5',
    '#FEF3C7',
    '#E9D5FF',
    '#FEE2E2',
    '#CCFBF1',
    '#E0E7FF'
  ])[
    1 + (abs(hashtext(id::text)) % 8)
  ]
WHERE profile_bg_color IS NULL;

ALTER TABLE public.leads
  ALTER COLUMN profile_bg_color SET NOT NULL;

ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_lead_type_check;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_lead_type_check CHECK (
    lead_type IN (
      'enquiry',
      'site_visit',
      'contact',
      'list_property',
      'general'
    )
  );

CREATE INDEX IF NOT EXISTS leads_seen_at_idx ON public.leads (seen_at);
CREATE INDEX IF NOT EXISTS leads_lead_type_idx ON public.leads (lead_type);

CREATE OR REPLACE FUNCTION public.set_lead_profile_bg_color()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  palette text[] := ARRAY[
    '#DBEAFE',
    '#FCE7F3',
    '#D1FAE5',
    '#FEF3C7',
    '#E9D5FF',
    '#FEE2E2',
    '#CCFBF1',
    '#E0E7FF'
  ];
  n int;
BEGIN
  IF NEW.profile_bg_color IS NULL OR btrim(NEW.profile_bg_color) = '' THEN
    n := array_length(palette, 1);
    NEW.profile_bg_color := palette[1 + (abs(hashtext(NEW.id::text)) % n)];
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_set_profile_color ON public.leads;

CREATE TRIGGER leads_set_profile_color
  BEFORE INSERT ON public.leads
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_lead_profile_bg_color();
