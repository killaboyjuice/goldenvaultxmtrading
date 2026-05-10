import { useEffect, useState } from "react";
import { ASSETS } from "@/lib/market-data";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceState {
  price: number;
  change: number;
}

export function usePrices(symbols: string[]) {
  const [prices, setPrices] = useState<Record<string, PriceState>>(() => {
    const init: Record<string, PriceState> = {};
    symbols.forEach((s) => {
      const a = ASSETS.find((x) => x.symbol === s);
      if (a) init[s] = { price: a.basePrice, change: 0 };
    });
    return init;
  });

  useEffect(() => {
    const id = setInterval(() => {
      setPrices((prev) => {
        const next = { ...prev };
        for (const sym of symbols) {
          const asset = ASSETS.find((a) => a.symbol === sym);
          if (!asset) continue;
          const cur = prev[sym]?.price ?? asset.basePrice;
          const change = (Math.random() - 0.49) * 2 * asset.volatility * cur;
          next[sym] = { price: Math.max(0.0001, cur + change), change };
        }
        return next;
      });
    }, 1500);
    return () => clearInterval(id);
  }, [symbols.join(",")]);

  return prices;
}

export function PriceCard({ symbol }: { symbol: string }) {
  const prices = usePrices([symbol]);
  const p = prices[symbol];
  const asset = ASSETS.find((a) => a.symbol === symbol);
  if (!p || !asset) return null;
  const up = p.change >= 0;
  const pct = (p.change / p.price) * 100;
  return (
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{asset.label}</div>
          <div className="font-display text-base font-bold">{symbol}</div>
        </div>
        <span className="rounded bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          LIVE
        </span>
      </div>
      <div className="mt-3 text-xl font-bold tabular-nums">
        {p.price.toLocaleString(undefined, { maximumFractionDigits: p.price < 10 ? 4 : 2 })}
      </div>
      <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${up ? "text-bull" : "text-bear"}`}>
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {up ? "+" : ""}
        {pct.toFixed(2)}% today
      </div>
    </div>
  );
}
