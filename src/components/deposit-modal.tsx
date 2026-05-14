import { useState } from "react";
import { Copy, X, Wallet, Landmark, Check } from "lucide-react";
import { toast } from "sonner";
import { usePlatformSettings, type CryptoWallet, type BankAccount } from "@/lib/use-platform-settings";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Glassmorphic deposit modal. Live-syncs wallet/bank data from Supabase
 * via usePlatformSettings — admin edits propagate without a refresh.
 */
export function DepositModal({ open, onClose }: Props) {
  const { wallets, banks, loading } = usePlatformSettings();
  const [tab, setTab] = useState<"crypto" | "bank">("crypto");

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Deposit funds"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl border border-gold/30 bg-[oklch(0.13_0.01_60)/0.85] p-6 shadow-[0_20px_60px_-15px_rgba(201,168,76,0.3)] backdrop-blur-xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full border border-border/50 bg-background/40 p-1.5 hover:bg-background/80"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="font-display text-2xl font-bold text-gold">Deposit Funds</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Live wallet and bank details — updated by the platform in real time.
        </p>

        <div className="mt-5 inline-flex rounded-lg border border-border/50 bg-background/40 p-1">
          <TabButton active={tab === "crypto"} onClick={() => setTab("crypto")} icon={<Wallet className="h-4 w-4" />}>
            Crypto
          </TabButton>
          <TabButton active={tab === "bank"} onClick={() => setTab("bank")} icon={<Landmark className="h-4 w-4" />}>
            Bank Transfer
          </TabButton>
        </div>

        <div className="mt-5 max-h-[60vh] overflow-y-auto pr-1">
          {loading && <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>}

          {!loading && tab === "crypto" && (
            <div className="space-y-3">
              {wallets.map((w) => (
                <WalletCard key={w.id} wallet={w.data} />
              ))}
              {wallets.length === 0 && <Empty label="No crypto wallets configured." />}
            </div>
          )}

          {!loading && tab === "bank" && (
            <div className="space-y-3">
              {banks.map((b) => (
                <BankCard key={b.id} bank={b.data} />
              ))}
              {banks.length === 0 && <Empty label="No bank accounts configured." />}
            </div>
          )}
        </div>

        <div className="mt-5 rounded-lg border border-gold/20 bg-gold/5 p-3 text-xs text-muted-foreground">
          <span className="font-semibold text-gold">Important:</span> after sending funds, submit your
          transaction hash or upload a receipt in the deposit confirmation step so an administrator
          can credit your balance.
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold transition ${
        active ? "bg-gold text-[oklch(0.15_0.01_60)]" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function WalletCard({ wallet }: { wallet: CryptoWallet }) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/30 p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-lg font-bold">{wallet.label}</div>
          <div className="text-xs text-muted-foreground">{wallet.symbol} · {wallet.network}</div>
        </div>
        <span className="rounded bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
          {wallet.symbol}
        </span>
      </div>
      <CopyRow label="Address" value={wallet.address} mono />
    </div>
  );
}

function BankCard({ bank }: { bank: BankAccount }) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/30 p-4 backdrop-blur">
      <div className="font-display text-lg font-bold">{bank.bank_name}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{bank.account_holder}</div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {bank.account_number && <CopyRow label="Account #" value={bank.account_number} />}
        {bank.sort_code && <CopyRow label="Sort code" value={bank.sort_code} />}
        {bank.iban && <CopyRow label="IBAN" value={bank.iban} mono />}
        {bank.swift && <CopyRow label="SWIFT/BIC" value={bank.swift} mono />}
      </div>
      {bank.reference && (
        <div className="mt-3 rounded border border-gold/20 bg-gold/5 px-3 py-2 text-xs text-gold">
          Reference: {bank.reference}
        </div>
      )}
    </div>
  );
}

function CopyRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  };
  return (
    <div className="mt-3 flex items-center justify-between gap-2 rounded border border-border/40 bg-background/40 px-3 py-2">
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className={`truncate text-xs ${mono ? "font-mono" : ""}`}>{value}</div>
      </div>
      <button
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className="shrink-0 rounded-md border border-border/60 bg-background/60 p-1.5 hover:border-gold/40 hover:text-gold"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-bull" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="rounded border border-dashed border-border/50 py-8 text-center text-sm text-muted-foreground">{label}</div>;
}
