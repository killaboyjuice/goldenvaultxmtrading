import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Maps our internal symbol -> Twelve Data symbol (when different).
// For symbols not listed here, we pass through as-is.
const SYMBOL_MAP: Record<string, string> = {
  "BTC/USDT": "BTC/USD",
  "ETH/USDT": "ETH/USD",
  "BNB/USDT": "BNB/USD",
  "XRP/USDT": "XRP/USD",
  "ADA/USDT": "ADA/USD",
  "SOL/USDT": "SOL/USD",
  "DOGE/USDT": "DOGE/USD",
  "TRX/USDT": "TRX/USD",
  "AVAX/USDT": "AVAX/USD",
  "DOT/USDT": "DOT/USD",
  "MATIC/USDT": "MATIC/USD",
  "LINK/USDT": "LINK/USD",
  "LTC/USDT": "LTC/USD",
  "BCH/USDT": "BCH/USD",
  "UNI/USDT": "UNI/USD",
  "ATOM/USDT": "ATOM/USD",
  "XLM/USDT": "XLM/USD",
  "ETC/USDT": "ETC/USD",
  "FIL/USDT": "FIL/USD",
  "NEAR/USDT": "NEAR/USD",
  "APT/USDT": "APT/USD",
  "ARB/USDT": "ARB/USD",
  "OP/USDT": "OP/USD",
  "SHIB/USDT": "SHIB/USD",
  "WTI": "WTI/USD",
  "BRENT": "BRENT/USD",
  "NGAS": "NG=F",
};

export const fetchLivePrices = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ symbols: z.array(z.string()).min(1).max(50) }).parse(d))
  .handler(async ({ data }): Promise<{ prices: Record<string, number>; error: string | null }> => {
    const apiKey = process.env.TWELVE_DATA_API_KEY;
    if (!apiKey) return { prices: {}, error: "Missing TWELVE_DATA_API_KEY" };

    const tdSymbols = data.symbols.map((s) => SYMBOL_MAP[s] ?? s);
    const reverse = new Map<string, string>();
    data.symbols.forEach((s, i) => reverse.set(tdSymbols[i], s));

    const url = `https://api.twelvedata.com/price?symbol=${encodeURIComponent(tdSymbols.join(","))}&apikey=${apiKey}`;
    try {
      const res = await fetch(url);
      if (!res.ok) return { prices: {}, error: `HTTP ${res.status}` };
      const json: any = await res.json();

      const prices: Record<string, number> = {};
      // Single-symbol response: { price: "..." }
      if (json && typeof json.price === "string") {
        const orig = reverse.get(tdSymbols[0]) ?? data.symbols[0];
        const v = parseFloat(json.price);
        if (!isNaN(v)) prices[orig] = v;
        return { prices, error: null };
      }
      // Multi-symbol response: { "EUR/USD": { price: "..." }, ... }
      if (json && typeof json === "object") {
        for (const [tdSym, payload] of Object.entries<any>(json)) {
          const orig = reverse.get(tdSym) ?? tdSym;
          const v = parseFloat(payload?.price ?? "");
          if (!isNaN(v)) prices[orig] = v;
        }
      }
      return { prices, error: null };
    } catch (e: any) {
      return { prices: {}, error: e?.message ?? "fetch failed" };
    }
  });
