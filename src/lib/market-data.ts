// Market data: simulated prices + Binance WebSocket for crypto
export type Candle = { time: number; open: number; high: number; low: number; close: number };

export type AssetSpec = {
  symbol: string;
  label: string;
  type: "crypto" | "forex" | "futures" | "commodity" | "nft" | "stock";
  basePrice: number;
  volatility: number; // 0..1 fraction per tick
  binanceSymbol?: string; // e.g. "btcusdt"
};

export const ASSETS: AssetSpec[] = [
  { symbol: "BTC/USDT", label: "Bitcoin", type: "crypto", basePrice: 67500, volatility: 0.001, binanceSymbol: "btcusdt" },
  { symbol: "ETH/USDT", label: "Ethereum", type: "crypto", basePrice: 3500, volatility: 0.0012, binanceSymbol: "ethusdt" },
  { symbol: "SOL/USDT", label: "Solana", type: "crypto", basePrice: 165, volatility: 0.0015, binanceSymbol: "solusdt" },
  { symbol: "EUR/USD", label: "Euro / Dollar", type: "forex", basePrice: 1.0875, volatility: 0.0002 },
  { symbol: "GBP/USD", label: "Pound / Dollar", type: "forex", basePrice: 1.2640, volatility: 0.00025 },
  { symbol: "USD/JPY", label: "Dollar / Yen", type: "forex", basePrice: 154.32, volatility: 0.0003 },
  { symbol: "XAU/USD", label: "Gold", type: "commodity", basePrice: 2380, volatility: 0.0006 },
  { symbol: "WTI", label: "Crude Oil", type: "commodity", basePrice: 78.40, volatility: 0.0008 },
  { symbol: "S&P 500", label: "S&P 500", type: "futures", basePrice: 4713.83, volatility: 0.0004 },
  { symbol: "NASDAQ", label: "Nasdaq 100", type: "futures", basePrice: 16420.5, volatility: 0.0005 },
  { symbol: "DOW 30", label: "Dow Jones", type: "futures", basePrice: 38950.2, volatility: 0.0004 },
  { symbol: "NFT-BLUE", label: "NFT Index", type: "nft", basePrice: 1240, volatility: 0.002 },
];

export function generateInitialCandles(base: number, vol: number, count = 120): Candle[] {
  const candles: Candle[] = [];
  let price = base;
  const now = Math.floor(Date.now() / 1000);
  const interval = 60; // 1 min
  for (let i = count; i > 0; i--) {
    const time = now - i * interval;
    const open = price;
    const change = (Math.random() - 0.5) * 2 * vol * price;
    const close = Math.max(0.0001, open + change);
    const high = Math.max(open, close) + Math.random() * vol * price * 0.5;
    const low = Math.min(open, close) - Math.random() * vol * price * 0.5;
    candles.push({ time, open, high, low, close });
    price = close;
  }
  return candles;
}

export function nextSimulatedTick(prev: Candle, vol: number): Candle {
  const change = (Math.random() - 0.49) * 2 * vol * prev.close;
  const close = Math.max(0.0001, prev.close + change);
  const high = Math.max(prev.high, close);
  const low = Math.min(prev.low, close);
  return { ...prev, high, low, close };
}

export function newCandleAfter(prev: Candle): Candle {
  return { time: prev.time + 60, open: prev.close, high: prev.close, low: prev.close, close: prev.close };
}
