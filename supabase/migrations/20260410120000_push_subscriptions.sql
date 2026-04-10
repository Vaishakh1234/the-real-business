-- Push subscription storage for Web Push (admin devices only; service role from API).

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email  TEXT NOT NULL,
  endpoint     TEXT NOT NULL UNIQUE,
  p256dh       TEXT NOT NULL,
  auth         TEXT NOT NULL,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS push_subscriptions_admin_email_idx
  ON public.push_subscriptions (admin_email);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
-- No policies: anon/authenticated cannot read/write; service role bypasses RLS.
