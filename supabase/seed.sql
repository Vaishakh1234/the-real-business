-- Amenities (12) ────────────────────────────────────────────────────────
INSERT INTO public.amenities (id, name, slug, icon, sort_order, is_active, created_at, updated_at) VALUES
  (uuid_generate_v4(), 'Swimming Pool', 'swimming-pool', '🏊', 1, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Gym', 'gym', '🏋️', 2, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Parking', 'parking', '🅿️', 3, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Security', 'security', '🛡️', 4, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Garden', 'garden', '🌳', 5, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Power Backup', 'power-backup', '⚡', 6, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Lift', 'lift', '🛗', 7, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Clubhouse', 'clubhouse', '🏛️', 8, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Play Area', 'play-area', '🎮', 9, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Concierge', 'concierge', '🛎️', 10, true, NOW(), NOW()),
  (uuid_generate_v4(), 'WiFi', 'wifi', '📶', 11, true, NOW(), NOW()),
  (uuid_generate_v4(), 'AC', 'ac', '❄️', 12, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
