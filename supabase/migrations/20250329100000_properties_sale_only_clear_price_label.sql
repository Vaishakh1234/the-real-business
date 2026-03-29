-- Catalog is sale-focused: strip legacy rental suffix text and normalize type.
UPDATE public.properties
SET price_label = NULL;

UPDATE public.properties
SET type = 'sale'
WHERE type = 'rent';
