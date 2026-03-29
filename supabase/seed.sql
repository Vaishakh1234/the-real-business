-- Amenities (10) ────────────────────────────────────────────────────────
INSERT INTO public.amenities (id, name, slug, icon, sort_order, is_active, created_at, updated_at) VALUES
  (uuid_generate_v4(), 'Swimming Pool', 'swimming-pool', 'pool', 1, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Gym', 'gym', 'gym', 2, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Parking', 'parking', 'parking', 3, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Security', 'security', 'security', 4, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Garden', 'garden', 'garden', 5, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Power Backup', 'power-backup', 'power', 6, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Lift', 'lift', 'lift', 7, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Clubhouse', 'clubhouse', 'clubhouse', 8, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Play Area', 'play-area', 'play', 9, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Concierge', 'concierge', 'concierge', 10, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;


  