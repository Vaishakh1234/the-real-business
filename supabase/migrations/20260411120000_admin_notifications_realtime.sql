-- Realtime: stream admin_notifications to authenticated clients (JWT from app).
-- RLS SELECT matches auth.jwt() ->> 'email' to admin_email (see realtime-token API).

ALTER TABLE public.admin_notifications REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;

CREATE POLICY admin_notifications_select_own_jwt_email
  ON public.admin_notifications
  FOR SELECT
  TO authenticated
  USING (admin_email = (auth.jwt() ->> 'email'));
