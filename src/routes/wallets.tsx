import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { useAuth } from "@/lib/auth-context";
import { usePlatformSettings } from "@/lib/use-platform-settings";
import { DepositModal } from "@/components/deposit-modal";
import { Wallet, Landmark, ArrowDownToLine, Radio } from "lucide-react";

export const Route = createFileRoute("/wallets")({
  component: WalletsPage,
  head: () => ({
    meta: [
      { title: "Wallets — GOLDEN VAULT XM" },
      { name: "description", content: "Live deposit wallets and bank accounts." },
    ],
  }),
});

function WalletsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { wallets, banks, loading } = usePlatformSettings();
  const [depositOpen, setDepositOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return <SiteLayout><div className="py-20 text-center text-muted-foreground">Loading…</div></SiteLayout>;
  }

  return (
    <SiteLayout>
      <section className="bg-background py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">
                <span className="text-gold">Wallets</span> & Bank Accounts
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Radio className="h-3.5 w-3.5 animate-pulse text-bull" /> Synced live with the platform.
              </p>
            </div>
            <button
              onClick={() => setDepositOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-[oklch(0.15_0.01_60)] hover:brightness-110"
            >
              <ArrowDownToLine className="h-4 w-4" /> Deposit Funds
            </button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Section title="Crypto Wallets" icon={<Wallet className="h-4 w-4 text-gold" />}>
              {loading ? <Skeleton /> : wallets.length === 0 ? <Empty /> : (
                <ul className="space-y-3">
                  {wallets.map((w) => (
                    <li key={w.id} className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{w.data.label}</div>
                          <div className="text-xs text-muted-foreground">{w.data.symbol} · {w.data.network}</div>
                        </div>
                        <span className="rounded bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">{w.data.symbol}</span>
                      </div>
                      <div className="mt-3 truncate rounded border border-border/40 bg-background/40 px-3 py-2 font-mono text-xs">
                        {w.data.address}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Bank Accounts" icon={<Landmark className="h-4 w-4 text-gold" />}>
              {loading ? <Skeleton /> : banks.length === 0 ? <Empty /> : (
                <ul className="space-y-3">
                  {banks.map((b) => (
                    <li key={b.id} className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur">
                      <div className="font-semibold">{b.data.bank_name}</div>
                      <div className="text-xs text-muted-foreground">{b.data.account_holder}</div>
                      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        {b.data.iban && <Field label="IBAN" value={b.data.iban} mono />}
                        {b.data.swift && <Field label="SWIFT" value={b.data.swift} mono />}
                        {b.data.account_number && <Field label="Account #" value={b.data.account_number} />}
                        {b.data.sort_code && <Field label="Sort code" value={b.data.sort_code} />}
                      </dl>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </div>
        </div>
      </section>

      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />
    </SiteLayout>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-display text-lg font-bold">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded border border-border/40 bg-background/40 px-2.5 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`truncate ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function Skeleton() {
  return <div className="space-y-2">{[0,1,2].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-card/60" />)}</div>;
}
function Empty() {
  return <div className="rounded border border-dashed border-border/50 py-8 text-center text-sm text-muted-foreground">No entries configured yet.</div>;
}
