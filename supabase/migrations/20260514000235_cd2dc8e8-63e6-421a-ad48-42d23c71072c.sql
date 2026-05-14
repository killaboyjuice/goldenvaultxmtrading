-- Harden handle_new_user: pin search_path and lock down execute privileges
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
begin
  insert into public.profiles (id, username, display_name, balance, total_profit, account_type, verification_status, win_rate, active_positions)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    125430.50,
    12543.20,
    'premium',
    'verified',
    68.5,
    12
  );
  return new;
end;
$function$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
-- The auth trigger runs as the function owner (SECURITY DEFINER), so revoking
-- broad EXECUTE here does not break signup.