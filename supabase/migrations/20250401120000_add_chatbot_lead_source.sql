-- Allow chatbot widget submissions on public.leads.source
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_source_check;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_source_check CHECK (
    source IN (
      'website',
      'meta_ads',
      'google_ads',
      'manual',
      'chatbot'
    )
  );
