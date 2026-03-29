-- Allow admin "closed" status: hidden from public listings (same visibility rule as non-active).
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_status_check;
ALTER TABLE public.properties
  ADD CONSTRAINT properties_status_check
  CHECK (status IN ('active', 'sold', 'rented', 'draft', 'closed'));
