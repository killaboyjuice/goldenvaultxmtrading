import { useEffect, useState } from "react";
import { externalSupabase } from "@/integrations/external-supabase/client";

/**
 * CryptoWallet — admin-managed deposit destination address.
 */
export interface CryptoWallet {
  label: string;        // e.g. "Bitcoin"
  symbol: string;       // e.g. "BTC"
  network: string;      // e.g. "ERC-20", "TRC-20"
  address: string;      // on-chain address
}

/**
 * BankAccount — admin-managed wire/transfer remittance details.
 * Fields are loosely typed because banks vary by jurisdiction.
 */
export interface BankAccount {
  bank_name: string;
  account_holder: string;
  account_number?: string;
  sort_code?: string;
  iban?: string;
  swift?: string;
  reference?: string;
}

interface SettingRow<T> {
  id: string;
  key: string;
  data: T;
  is_active: boolean;
  sort_order: number;
}

interface PlatformSettingsState {
  wallets: SettingRow<CryptoWallet>[];
  banks: SettingRow<BankAccount>[];
  loading: boolean;
  error: string | null;
}

/**
 * Reactive global hook for platform-level deposit configuration.
 *
 * Fetches the current wallet & bank rows from Supabase, then subscribes to
 * postgres_changes on `public.platform_settings`. Any admin mutation is
 * pushed live and the consuming component re-renders without polling.
 */
export function usePlatformSettings(): PlatformSettingsState {
  const [state, setState] = useState<PlatformSettingsState>({
    wallets: [],
    banks: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await externalSupabase
        .from("platform_settings")
        .select("id, kind, key, data, is_active, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (cancelled) return;
      if (error) {
        setState((s) => ({ ...s, loading: false, error: error.message }));
        return;
      }
      const wallets = (data ?? []).filter((r: any) => r.kind === "crypto_wallet") as SettingRow<CryptoWallet>[];
      const banks = (data ?? []).filter((r: any) => r.kind === "bank_account") as SettingRow<BankAccount>[];
      setState({ wallets, banks, loading: false, error: null });
    };

    load();

    // Live push: any INSERT/UPDATE/DELETE on platform_settings re-fetches.
    // Re-fetching (vs. patching local state) keeps sort_order & active flags
    // consistent with what RLS lets the user see.
    const channel = externalSupabase
      .channel("platform_settings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "platform_settings" },
        () => { load(); },
      )
      .subscribe();

    return () => {
      cancelled = true;
      externalSupabase.removeChannel(channel);
    };
  }, []);

  return state;
}
