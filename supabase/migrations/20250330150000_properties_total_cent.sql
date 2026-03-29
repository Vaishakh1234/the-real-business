-- Land extent in cents (common in Kerala/south India); optional for all listing types.
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS total_cent NUMERIC(12, 4);

COMMENT ON COLUMN public.properties.total_cent IS 'Total land extent in cents (decimal allowed, e.g. 3.5).';
