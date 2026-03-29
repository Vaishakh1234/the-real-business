-- Enforce short_description length in line with Zod (lib/validations/property.schema.ts).
ALTER TABLE public.properties
  ADD CONSTRAINT properties_short_description_max_250
  CHECK (short_description IS NULL OR char_length(short_description) <= 250);
