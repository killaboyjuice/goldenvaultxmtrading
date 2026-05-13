import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { ChartPanel } from "@/components/chart-panel";
import { PriceCard, usePrices } from "@/components/price-ticker";
import { ASSETS } from "@/lib/market-data";
import { Search, Filter, TrendingUp, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/markets")({
  component: MarketsPage,
  head: () => ({
    meta: [
      { title: "Global Trading Markets — GOLDEN VAULT XM" },
      { name: "description", content: "Trade Forex, Crypto, Futures, Commodities, and NFTs with live charts and institutional execution." },
    ],
  }),
});

const TABS = ["All", "Crypto", "Forex", "Stock", "Futures", "Commodity", "NFT"] as const;

function MarketsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string>("BTC/USDT");

  const filtered = ASSETS.filter((a) => {
    const matchesTab = tab === "All" || a.type.toLowerCase() === tab.toLowerCase();
    const matchesQ = !q || a.symbol.toLowerCase().includes(q.toLowerCase()) || a.label.toLowerCase().includes(q.toLowerCase());
    return matchesTab && matchesQ;
  });

  return (
    <SiteLayout>
      <section className="relative bg-hero py-12">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <h1 className="font-display text-4xl font-black sm:text-6xl">
            Global Trading <span className="text-gradient-gold">Markets</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
            Access a comprehensive suite of trading instruments across multiple asset classes with
            institutional-grade execution.
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search markets..."
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Filter className="h-4 w-4 text-gold" />
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded px-4 py-1.5 text-xs font-semibold transition ${
                  tab === t ? "bg-gold text-[oklch(0.15_0.01_60)]" : "border border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <ChartPanel symbol={selected} height={420} />
            

            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {filtered.length} Instruments
              </div>
              <div className="max-h-[480px] space-y-2 overflow-y-auto pr-1">
                {filtered.map((a) => (
                  <button
                    key={a.symbol}
                    onClick={() => setSelected(a.symbol)}
                    className={`flex w-full items-center justify-between rounded border p-3 text-left transition ${
                      selected === a.symbol ? "border-gold bg-gold/5" : "border-border/50 hover:bg-secondary"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{a.symbol}</div>
                      <div className="text-[11px] text-muted-foreground">{a.label}</div>
                    </div>
                    <PriceMini symbol={a.symbol} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["BTC/USDT", "ETH/USDT", "S&P 500", "XAU/USD"].map((s) => (
              <PriceCard key={s} symbol={s} />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function PriceMini({ symbol }: { symbol: string }) {
  const prices = usePrices([symbol]);
  const p = prices[symbol];
  if (!p) return null;
  const up = p.change >= 0;
  return (
    <div className="text-right">
      <div className="text-sm font-semibold tabular-nums">
        {p.price.toLocaleString(undefined, { maximumFractionDigits: p.price < 10 ? 4 : 2 })}
      </div>
      <div className={`flex items-center justify-end text-[11px] ${up ? "text-bull" : "text-bear"}`}>
        {up ? <TrendingUp className="mr-0.5 h-3 w-3" /> : <TrendingDown className="mr-0.5 h-3 w-3" />}
        {((p.change / p.price) * 100).toFixed(2)}%
      </div>
    </div>
  );
}
