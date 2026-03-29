-- Reject any attempt to change the primary key on update (defense in depth vs. service role / raw SQL).

CREATE OR REPLACE FUNCTION public.freeze_properties_id_on_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'properties.id cannot be changed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_freeze_id_on_update ON public.properties;
CREATE TRIGGER properties_freeze_id_on_update
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.freeze_properties_id_on_update();
