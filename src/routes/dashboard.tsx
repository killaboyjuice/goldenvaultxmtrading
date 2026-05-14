import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { useAuth } from "@/lib/auth-context";
import { externalSupabase } from "@/integrations/external-supabase/client";
import { Wallet, TrendingUp, Activity, BarChart3, ArrowDownToLine, ArrowUpFromLine, ChevronUp, X } from "lucide-react";
import { toast } from "sonner";
import { DepositModal } from "@/components/deposit-modal";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — GOLDEN VAULT XM" }] }),
});

interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  balance: number;
  total_profit: number;
  account_type: string;
  verification_status: string;
  win_rate: number;
  active_positions: number;
}

const HOLDINGS = [
  { sym: "BTC/USDT", amount: 45230.50, change: 5.4, profit: 2310.50 },
  { sym: "EUR/USD", amount: 32100.00, change: -2.1, profit: -689.20 },
  { sym: "Gold Futures", amount: 28500.00, change: 3.8, profit: 1045.30 },
  { sym: "ETH/USDT", amount: 19600.00, change: 8.2, profit: 1486.70 },
];

function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [voted, setVoted] = useState<string | null>(null);
  const [showVote, setShowVote] = useState(true);
  const [sentiment, setSentiment] = useState({ bullish: 38, bearish: 24 });

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    externalSupabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setProfile(data as Profile);
    });

    const channel = externalSupabase
      .channel("profile-changes")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}` }, (p) => {
        setProfile(p.new as Profile);
      })
      .subscribe();

    return () => { externalSupabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    externalSupabase.from("sentiment_votes").select("vote").then(({ data }) => {
      if (!data) return;
      const b = data.filter((d) => d.vote === "bullish").length;
      const r = data.filter((d) => d.vote === "bearish").length;
      setSentiment({ bullish: 38 + b, bearish: 24 + r });
    });
  }, []);

  const onVote = async (vote: "bullish" | "bearish") => {
    if (!user) return;
    setVoted(vote);
    setSentiment((s) => ({ ...s, [vote]: s[vote] + 1 }));
    const { error } = await externalSupabase.from("sentiment_votes").insert({ user_id: user.id, vote });
    if (error) toast.error(error.message);
    else toast.success(`Vote recorded: ${vote}`);
  };

  const onAction = (action: string) => toast.info(`${action} — feature coming soon`);

  if (authLoading || !user) {
    return <SiteLayout><div className="py-20 text-center text-muted-foreground">Loading...</div></SiteLayout>;
  }

  const name = profile?.display_name ?? profile?.username ?? user.email?.split("@")[0] ?? "Trader";
  const bars = Array.from({ length: 30 }, (_, i) => 30 + Math.sin(i * 0.4) * 20 + Math.random() * 30);

  return (
    <SiteLayout>
      <section className="bg-background py-10">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Welcome Back, <span className="text-gold">{name}</span>
          </h1>
          <p className="mt-1 text-sm italic text-purple">Here's your trading overview for today</p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={Wallet} label="Total Balance" value={`$${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} change="+5.2%" />
            <Stat icon={TrendingUp} label="Total Profit" value={`$${(profile?.total_profit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} change="+11.2%" />
            <Stat icon={Activity} label="Active Positions" value={String(profile?.active_positions ?? 0)} change="+3" />
            <Stat icon={BarChart3} label="Win Rate" value={`${(profile?.win_rate ?? 0).toFixed(1)}%`} change="+2.3%" />
          </div>

          <div className="mt-6 rounded-lg border border-border/50 bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Portfolio Performance</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BarChart3 className="h-3.5 w-3.5 text-gold" /> Last 30 Days
              </div>
            </div>
            <div className="mt-4 flex h-48 items-end gap-1.5">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-gold/30 to-gold" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border/50 pt-4 text-xs">
              <div>
                <div className="text-muted-foreground">Total Invested</div>
                <div className="font-semibold">${((profile?.balance ?? 0) - (profile?.total_profit ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Current Value</div>
                <div className="font-semibold text-bull">${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-card p-5">
              <h3 className="font-display text-lg font-bold">Quick Actions</h3>
              <div className="mt-4 space-y-3">
                <button onClick={() => onAction("Deposit Funds")} className="flex w-full items-center justify-center gap-2 rounded bg-gold py-2.5 text-sm font-bold text-[oklch(0.15_0.01_60)]">
                  <ArrowDownToLine className="h-4 w-4" /> Deposit Funds
                </button>
                <button onClick={() => onAction("Withdraw Funds")} className="flex w-full items-center justify-center gap-2 rounded border border-gold/60 py-2.5 text-sm font-bold text-gold">
                  <ArrowUpFromLine className="h-4 w-4" /> Withdraw Funds
                </button>
                <Link to="/markets" className="flex w-full items-center justify-center gap-2 rounded border border-border/60 py-2.5 text-sm font-medium">
                  <BarChart3 className="h-4 w-4" /> View Reports
                </Link>
              </div>

              <h3 className="mt-6 font-display text-lg font-bold">Account Status</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Verification</span>
                  <span className="rounded bg-bull/10 px-2 py-0.5 text-xs font-semibold text-bull">{profile?.verification_status ?? "Verified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="rounded bg-gold/10 px-2 py-0.5 text-xs font-semibold text-gold capitalize">{profile?.account_type ?? "Premium"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-5">
              <h3 className="font-display text-lg font-bold">Portfolio Holdings</h3>
              <div className="mt-3 space-y-3">
                {HOLDINGS.map((h) => {
                  const up = h.change >= 0;
                  return (
                    <div key={h.sym} className="border-b border-border/30 pb-3 last:border-0">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">{h.sym}</span>
                        <span className={`text-xs font-semibold ${up ? "text-bull" : "text-bear"}`}>{up ? "+" : ""}{h.change}%</span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">${h.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <span className={up ? "text-bull" : "text-bear"}>{up ? "+" : ""}${h.profit.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-border/50 bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold">Market Sentiment</h3>
              <ChevronUp className="text-muted-foreground" />
            </div>

            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div>
                <div className="text-center">
                  <div className="font-display text-5xl font-black text-bear">{sentiment.bearish < sentiment.bullish ? sentiment.bearish : sentiment.bullish}</div>
                  <div className="text-sm font-semibold text-bear">Fear</div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-bull" style={{ flexGrow: sentiment.bullish }} />
                  <div className="h-2 flex-1 rounded-full bg-bear" style={{ flexGrow: sentiment.bearish }} />
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-bull">Bullish {sentiment.bullish}</span>
                  <span className="text-bear">Bearish {sentiment.bearish}</span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">ETH Gas</div>
                  <div className="font-semibold">0.127188145 GWei <span className="text-xs text-muted-foreground">≈ 0.006 USD</span></div>
                </div>
                <div>
                  <div className="text-muted-foreground">BTC Long/Short Ratio</div>
                  <div className="font-semibold"><span className="text-bull">66.0</span> / <span className="text-bear">34.0</span></div>
                </div>
              </div>
            </div>

            {showVote && (
              <div className="relative mt-6 rounded-lg border border-border/50 bg-background p-5">
                <button onClick={() => setShowVote(false)} className="absolute right-3 top-3 rounded-full bg-secondary p-1"><X className="h-3 w-3" /></button>
                <h4 className="font-display text-lg font-bold">How do you feel about the Market today?</h4>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button disabled={!!voted} onClick={() => onVote("bullish")}
                    className={`rounded-full py-3 font-display text-lg font-bold ${voted === "bullish" ? "bg-bull text-background" : "bg-bull/15 text-bull"} disabled:opacity-60`}>
                    Bullish
                  </button>
                  <button disabled={!!voted} onClick={() => onVote("bearish")}
                    className={`rounded-full py-3 font-display text-lg font-bold ${voted === "bearish" ? "bg-bear text-background" : "bg-bear/15 text-bear"} disabled:opacity-60`}>
                    Bearish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Stat({ icon: Icon, label, value, change }: any) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded bg-bull/10 text-bull">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-semibold text-bull">↗ {change}</span>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-bold tabular-nums">{value}</div>
    </div>
  );
}
