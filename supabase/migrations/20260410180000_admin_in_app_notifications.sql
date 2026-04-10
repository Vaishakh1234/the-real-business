-- In-app lead notification feed (per admin) + settings toggle

ALTER TABLE public.admin_settings
  ADD COLUMN IF NOT EXISTS in_app_lead_notifications BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email TEXT NOT NULL,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (lead_id, admin_email)
);

CREATE INDEX IF NOT EXISTS admin_notifications_admin_created_idx
  ON public.admin_notifications (admin_email, created_at DESC);

CREATE INDEX IF NOT EXISTS admin_notifications_admin_unread_idx
  ON public.admin_notifications (admin_email)
  WHERE read_at IS NULL;

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
