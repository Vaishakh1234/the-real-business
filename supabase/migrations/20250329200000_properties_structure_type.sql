-- Physical listing kind (house vs land plot). Distinct from `type` (sale/rent).
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS structure_type TEXT NOT NULL DEFAULT 'house'
  CHECK (structure_type IN ('house', 'plot'));

CREATE INDEX IF NOT EXISTS properties_structure_type_idx ON public.properties (structure_type);
