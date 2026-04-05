-- Replace Lucide icon-name strings with actual emoji characters.
UPDATE public.amenities SET icon = '🏊' WHERE slug = 'swimming-pool' AND icon NOT SIMILAR TO '[^\x00-\x7F]%';
UPDATE public.amenities SET icon = '🏋️' WHERE slug = 'gym'           AND icon NOT SIMILAR TO '[^\x00-\x7F]%';
UPDATE public.amenities SET icon = '🅿️' WHERE slug = 'parking'       AND icon NOT SIMILAR TO '[^\x00-\x7F]%';
UPDATE public.amenities SET icon = '🛡️' WHERE slug = 'security'      AND icon NOT SIMILAR TO '[^\x00-\x7F]%';
UPDATE public.amenities SET icon = '🌳' WHERE slug = 'garden'        AND icon NOT SIMILAR TO '[^\x00-\x7F]%';
UPDATE public.amenities SET icon = '⚡' WHERE slug = 'power-backup'  AND icon NOT SIMILAR TO '[^\x00-\x7F]%';
UPDATE public.amenities SET icon = '🛗' WHERE slug = 'lift'          AND icon NOT SIMILAR TO '[^\x00-\x7F]%';
UPDATE public.amenities SET icon = '🏛️' WHERE slug = 'clubhouse'     AND icon NOT SIMILAR TO '[^\x00-\x7F]%';
UPDATE public.amenities SET icon = '🎮' WHERE slug = 'play-area'     AND icon NOT SIMILAR TO '[^\x00-\x7F]%';
UPDATE public.amenities SET icon = '🛎️' WHERE slug = 'concierge'     AND icon NOT SIMILAR TO '[^\x00-\x7F]%';
UPDATE public.amenities SET icon = '📶' WHERE slug = 'wifi'          AND icon NOT SIMILAR TO '[^\x00-\x7F]%';
UPDATE public.amenities SET icon = '❄️' WHERE slug = 'ac'            AND icon NOT SIMILAR TO '[^\x00-\x7F]%';
