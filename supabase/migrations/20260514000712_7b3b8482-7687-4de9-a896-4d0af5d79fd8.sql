-- ============================================================
-- platform_settings: admin-managed deposit configuration
-- ============================================================

CREATE TABLE IF NOT EXISTS public.platform_settings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind        text NOT NULL CHECK (kind IN ('crypto_wallet','bank_account')),
  key         text NOT NULL,
  data        jsonb NOT NULL,
  is_active   boolean NOT NULL DEFAULT true,
  sort_order  int NOT NULL DEFAULT 0,
  updated_by  uuid,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, key)
);

CREATE INDEX IF NOT EXISTS platform_settings_kind_idx
  ON public.platform_settings(kind, sort_order);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Read: any authenticated user
CREATE POLICY "platform_settings readable by authenticated"
  ON public.platform_settings FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- Roles (separate table — best practice)
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role    public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE POLICY "user_roles self-select"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "user_roles admin-manage"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Admin-only writes on platform_settings
CREATE POLICY "platform_settings admin insert"
  ON public.platform_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "platform_settings admin update"
  ON public.platform_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "platform_settings admin delete"
  ON public.platform_settings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_platform_settings_touch ON public.platform_settings;
CREATE TRIGGER trg_platform_settings_touch
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Realtime push
ALTER TABLE public.platform_settings REPLICA IDENTITY FULL;
DO $$ BEGIN
  PERFORM 1 FROM pg_publication_tables
   WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='platform_settings';
  IF NOT FOUND THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.platform_settings';
  END IF;
END $$;

-- ============================================================
-- Seed (placeholders — admin should replace via dashboard)
-- ============================================================
INSERT INTO public.platform_settings (kind, key, sort_order, data) VALUES
  ('crypto_wallet','BTC',         1, '{"label":"Bitcoin","symbol":"BTC","network":"Bitcoin","address":"bc1qexampleexampleexampleexampleexample00"}'),
  ('crypto_wallet','ETH',         2, '{"label":"Ethereum","symbol":"ETH","network":"ERC-20","address":"0xExampleExampleExampleExampleExampleExample"}'),
  ('crypto_wallet','USDT_TRC20',  3, '{"label":"Tether","symbol":"USDT","network":"TRC-20","address":"TExampleExampleExampleExampleExample00"}'),
  ('crypto_wallet','BNB',         4, '{"label":"BNB","symbol":"BNB","network":"BEP-20","address":"0xExampleExampleExampleExampleExampleBNB00"}'),
  ('crypto_wallet','TRX',         5, '{"label":"TRON","symbol":"TRX","network":"TRC-20","address":"TExampleExampleExampleExampleExampleTRX0"}'),
  ('bank_account','PRIMARY',      1, '{"bank_name":"HSBC United Kingdom","account_holder":"Golden Vault XM Ltd","account_number":"00000000","sort_code":"00-00-00","iban":"GB00HBUK00000000000000","swift":"HBUKGB4B","reference":"Use your account email as reference"}'),
  ('bank_account','SECONDARY',    2, '{"bank_name":"Deutsche Bank AG","account_holder":"Golden Vault XM GmbH","iban":"DE00000000000000000000","swift":"DEUTDEFF","reference":"Use your account email as reference"}'),
  ('bank_account','TERTIARY',     3, '{"bank_name":"DBS Bank Singapore","account_holder":"Golden Vault XM Pte","account_number":"000-000000-0","swift":"DBSSSGSG","reference":"Use your account email as reference"}')
ON CONFLICT (kind, key) DO NOTHING;