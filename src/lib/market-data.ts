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

// Comprehensive market list across all major asset classes.
// Add or edit tickers here — UI sources everything from this catalog.
export const ASSETS: AssetSpec[] = [
  // ===== FOREX — MAJORS =====
  { symbol: "EUR/USD", label: "Euro / US Dollar", type: "forex", basePrice: 1.0875, volatility: 0.0002 },
  { symbol: "GBP/USD", label: "British Pound / US Dollar", type: "forex", basePrice: 1.2640, volatility: 0.00025 },
  { symbol: "USD/JPY", label: "US Dollar / Japanese Yen", type: "forex", basePrice: 154.32, volatility: 0.0003 },
  { symbol: "USD/CHF", label: "US Dollar / Swiss Franc", type: "forex", basePrice: 0.9050, volatility: 0.0002 },
  { symbol: "AUD/USD", label: "Australian Dollar / US Dollar", type: "forex", basePrice: 0.6580, volatility: 0.00025 },
  { symbol: "USD/CAD", label: "US Dollar / Canadian Dollar", type: "forex", basePrice: 1.3680, volatility: 0.00022 },
  { symbol: "NZD/USD", label: "New Zealand Dollar / US Dollar", type: "forex", basePrice: 0.6020, volatility: 0.00028 },

  // ===== FOREX — MINORS (Crosses) =====
  { symbol: "EUR/GBP", label: "Euro / British Pound", type: "forex", basePrice: 0.8595, volatility: 0.00018 },
  { symbol: "EUR/JPY", label: "Euro / Japanese Yen", type: "forex", basePrice: 167.85, volatility: 0.00035 },
  { symbol: "EUR/CHF", label: "Euro / Swiss Franc", type: "forex", basePrice: 0.9840, volatility: 0.0002 },
  { symbol: "EUR/AUD", label: "Euro / Australian Dollar", type: "forex", basePrice: 1.6520, volatility: 0.0003 },
  { symbol: "EUR/CAD", label: "Euro / Canadian Dollar", type: "forex", basePrice: 1.4880, volatility: 0.00028 },
  { symbol: "GBP/JPY", label: "British Pound / Japanese Yen", type: "forex", basePrice: 195.10, volatility: 0.0004 },
  { symbol: "GBP/CHF", label: "British Pound / Swiss Franc", type: "forex", basePrice: 1.1440, volatility: 0.00028 },
  { symbol: "GBP/AUD", label: "British Pound / Australian Dollar", type: "forex", basePrice: 1.9210, volatility: 0.0003 },
  { symbol: "AUD/JPY", label: "Australian Dollar / Japanese Yen", type: "forex", basePrice: 101.55, volatility: 0.00035 },
  { symbol: "AUD/NZD", label: "Australian Dollar / New Zealand Dollar", type: "forex", basePrice: 1.0930, volatility: 0.00022 },
  { symbol: "AUD/CAD", label: "Australian Dollar / Canadian Dollar", type: "forex", basePrice: 0.9000, volatility: 0.00025 },
  { symbol: "CAD/JPY", label: "Canadian Dollar / Japanese Yen", type: "forex", basePrice: 112.85, volatility: 0.0003 },
  { symbol: "CHF/JPY", label: "Swiss Franc / Japanese Yen", type: "forex", basePrice: 170.50, volatility: 0.0003 },
  { symbol: "NZD/JPY", label: "New Zealand Dollar / Japanese Yen", type: "forex", basePrice: 92.90, volatility: 0.00035 },

  // ===== FOREX — EXOTICS =====
  { symbol: "USD/TRY", label: "US Dollar / Turkish Lira", type: "forex", basePrice: 32.45, volatility: 0.0015 },
  { symbol: "USD/ZAR", label: "US Dollar / South African Rand", type: "forex", basePrice: 18.65, volatility: 0.0012 },
  { symbol: "USD/MXN", label: "US Dollar / Mexican Peso", type: "forex", basePrice: 17.05, volatility: 0.001 },
  { symbol: "USD/SGD", label: "US Dollar / Singapore Dollar", type: "forex", basePrice: 1.3450, volatility: 0.0003 },
  { symbol: "USD/HKD", label: "US Dollar / Hong Kong Dollar", type: "forex", basePrice: 7.8200, volatility: 0.00015 },
  { symbol: "USD/SEK", label: "US Dollar / Swedish Krona", type: "forex", basePrice: 10.65, volatility: 0.0006 },
  { symbol: "USD/NOK", label: "US Dollar / Norwegian Krone", type: "forex", basePrice: 10.85, volatility: 0.0007 },
  { symbol: "USD/DKK", label: "US Dollar / Danish Krone", type: "forex", basePrice: 6.8500, volatility: 0.0004 },
  { symbol: "USD/PLN", label: "US Dollar / Polish Zloty", type: "forex", basePrice: 4.0200, volatility: 0.0008 },
  { symbol: "USD/CNH", label: "US Dollar / Chinese Yuan (Offshore)", type: "forex", basePrice: 7.2400, volatility: 0.0004 },
  { symbol: "USD/INR", label: "US Dollar / Indian Rupee", type: "forex", basePrice: 83.45, volatility: 0.0005 },
  { symbol: "USD/THB", label: "US Dollar / Thai Baht", type: "forex", basePrice: 36.20, volatility: 0.0006 },
  { symbol: "USD/BRL", label: "US Dollar / Brazilian Real", type: "forex", basePrice: 5.0800, volatility: 0.0012 },

  // ===== COMMODITIES — METALS =====
  { symbol: "XAU/USD", label: "Gold Spot", type: "commodity", basePrice: 2380, volatility: 0.0006 },
  { symbol: "XAG/USD", label: "Silver Spot", type: "commodity", basePrice: 28.50, volatility: 0.0012 },
  { symbol: "XPT/USD", label: "Platinum Spot", type: "commodity", basePrice: 945, volatility: 0.001 },
  { symbol: "XPD/USD", label: "Palladium Spot", type: "commodity", basePrice: 1015, volatility: 0.0015 },
  { symbol: "COPPER", label: "Copper Futures", type: "commodity", basePrice: 4.55, volatility: 0.001 },
  { symbol: "ALUMINUM", label: "Aluminum Futures", type: "commodity", basePrice: 2480, volatility: 0.0009 },

  // ===== COMMODITIES — ENERGY =====
  { symbol: "WTI", label: "WTI Crude Oil", type: "commodity", basePrice: 78.40, volatility: 0.0008 },
  { symbol: "BRENT", label: "Brent Crude Oil", type: "commodity", basePrice: 82.10, volatility: 0.0008 },
  { symbol: "NGAS", label: "Natural Gas", type: "commodity", basePrice: 2.65, volatility: 0.002 },
  { symbol: "GASOLINE", label: "RBOB Gasoline", type: "commodity", basePrice: 2.45, volatility: 0.0012 },
  { symbol: "HEATING-OIL", label: "Heating Oil", type: "commodity", basePrice: 2.55, volatility: 0.0011 },

  // ===== COMMODITIES — AGRICULTURE =====
  { symbol: "WHEAT", label: "Wheat Futures", type: "commodity", basePrice: 6.20, volatility: 0.001 },
  { symbol: "CORN", label: "Corn Futures", type: "commodity", basePrice: 4.45, volatility: 0.001 },
  { symbol: "SOYBEANS", label: "Soybean Futures", type: "commodity", basePrice: 11.80, volatility: 0.001 },
  { symbol: "COFFEE", label: "Coffee Futures", type: "commodity", basePrice: 2.25, volatility: 0.0015 },
  { symbol: "SUGAR", label: "Sugar Futures", type: "commodity", basePrice: 0.21, volatility: 0.0014 },
  { symbol: "COCOA", label: "Cocoa Futures", type: "commodity", basePrice: 9850, volatility: 0.002 },

  // ===== CRYPTO =====
  { symbol: "BTC/USDT", label: "Bitcoin", type: "crypto", basePrice: 67500, volatility: 0.001, binanceSymbol: "btcusdt" },
  { symbol: "ETH/USDT", label: "Ethereum", type: "crypto", basePrice: 3500, volatility: 0.0012, binanceSymbol: "ethusdt" },
  { symbol: "BNB/USDT", label: "BNB", type: "crypto", basePrice: 595, volatility: 0.0014, binanceSymbol: "bnbusdt" },
  { symbol: "SOL/USDT", label: "Solana", type: "crypto", basePrice: 165, volatility: 0.0015, binanceSymbol: "solusdt" },
  { symbol: "XRP/USDT", label: "XRP", type: "crypto", basePrice: 0.52, volatility: 0.0016, binanceSymbol: "xrpusdt" },
  { symbol: "ADA/USDT", label: "Cardano", type: "crypto", basePrice: 0.46, volatility: 0.0018, binanceSymbol: "adausdt" },
  { symbol: "DOGE/USDT", label: "Dogecoin", type: "crypto", basePrice: 0.155, volatility: 0.0022, binanceSymbol: "dogeusdt" },
  { symbol: "TRX/USDT", label: "TRON", type: "crypto", basePrice: 0.118, volatility: 0.0015, binanceSymbol: "trxusdt" },
  { symbol: "TON/USDT", label: "Toncoin", type: "crypto", basePrice: 6.85, volatility: 0.0018, binanceSymbol: "tonusdt" },
  { symbol: "AVAX/USDT", label: "Avalanche", type: "crypto", basePrice: 36.50, volatility: 0.002, binanceSymbol: "avaxusdt" },
  { symbol: "DOT/USDT", label: "Polkadot", type: "crypto", basePrice: 7.20, volatility: 0.0018, binanceSymbol: "dotusdt" },
  { symbol: "MATIC/USDT", label: "Polygon", type: "crypto", basePrice: 0.72, volatility: 0.002, binanceSymbol: "maticusdt" },
  { symbol: "LINK/USDT", label: "Chainlink", type: "crypto", basePrice: 14.85, volatility: 0.0018, binanceSymbol: "linkusdt" },
  { symbol: "LTC/USDT", label: "Litecoin", type: "crypto", basePrice: 84.20, volatility: 0.0015, binanceSymbol: "ltcusdt" },
  { symbol: "BCH/USDT", label: "Bitcoin Cash", type: "crypto", basePrice: 445, volatility: 0.0017, binanceSymbol: "bchusdt" },
  { symbol: "UNI/USDT", label: "Uniswap", type: "crypto", basePrice: 8.40, volatility: 0.002, binanceSymbol: "uniusdt" },
  { symbol: "ATOM/USDT", label: "Cosmos", type: "crypto", basePrice: 8.95, volatility: 0.002, binanceSymbol: "atomusdt" },
  { symbol: "XLM/USDT", label: "Stellar", type: "crypto", basePrice: 0.115, volatility: 0.0018, binanceSymbol: "xlmusdt" },
  { symbol: "ETC/USDT", label: "Ethereum Classic", type: "crypto", basePrice: 27.40, volatility: 0.0018, binanceSymbol: "etcusdt" },
  { symbol: "FIL/USDT", label: "Filecoin", type: "crypto", basePrice: 5.85, volatility: 0.0022, binanceSymbol: "filusdt" },
  { symbol: "NEAR/USDT", label: "NEAR Protocol", type: "crypto", basePrice: 6.20, volatility: 0.0022, binanceSymbol: "nearusdt" },
  { symbol: "APT/USDT", label: "Aptos", type: "crypto", basePrice: 8.95, volatility: 0.0024, binanceSymbol: "aptusdt" },
  { symbol: "ARB/USDT", label: "Arbitrum", type: "crypto", basePrice: 1.05, volatility: 0.0024, binanceSymbol: "arbusdt" },
  { symbol: "OP/USDT", label: "Optimism", type: "crypto", basePrice: 2.15, volatility: 0.0024, binanceSymbol: "opusdt" },
  { symbol: "SHIB/USDT", label: "Shiba Inu", type: "crypto", basePrice: 0.0000245, volatility: 0.0028, binanceSymbol: "shibusdt" },
  { symbol: "PEPE/USDT", label: "Pepe", type: "crypto", basePrice: 0.0000115, volatility: 0.0035, binanceSymbol: "pepeusdt" },

  // ===== FUTURES — INDICES =====
  { symbol: "S&P 500", label: "S&P 500 Index", type: "futures", basePrice: 4713.83, volatility: 0.0004 },
  { symbol: "NASDAQ", label: "Nasdaq 100", type: "futures", basePrice: 16420.5, volatility: 0.0005 },
  { symbol: "DOW 30", label: "Dow Jones Industrial", type: "futures", basePrice: 38950.2, volatility: 0.0004 },
  { symbol: "RUSSELL 2000", label: "Russell 2000", type: "futures", basePrice: 2050.4, volatility: 0.0005 },
  { symbol: "VIX", label: "Volatility Index", type: "futures", basePrice: 14.85, volatility: 0.003 },
  { symbol: "DAX 40", label: "Germany DAX 40", type: "futures", basePrice: 17820, volatility: 0.0005 },
  { symbol: "FTSE 100", label: "UK FTSE 100", type: "futures", basePrice: 7755, volatility: 0.0004 },
  { symbol: "CAC 40", label: "France CAC 40", type: "futures", basePrice: 7620, volatility: 0.0005 },
  { symbol: "NIKKEI 225", label: "Japan Nikkei 225", type: "futures", basePrice: 38450, volatility: 0.0006 },
  { symbol: "HANG SENG", label: "Hong Kong Hang Seng", type: "futures", basePrice: 17280, volatility: 0.0008 },
  { symbol: "ASX 200", label: "Australia ASX 200", type: "futures", basePrice: 7680, volatility: 0.0005 },

  // ===== STOCKS — US TECH & MEGA-CAP =====
  { symbol: "AAPL", label: "Apple Inc.", type: "stock", basePrice: 192.50, volatility: 0.0008 },
  { symbol: "MSFT", label: "Microsoft Corp.", type: "stock", basePrice: 415.20, volatility: 0.0008 },
  { symbol: "GOOGL", label: "Alphabet Inc. Class A", type: "stock", basePrice: 158.40, volatility: 0.001 },
  { symbol: "AMZN", label: "Amazon.com Inc.", type: "stock", basePrice: 178.20, volatility: 0.001 },
  { symbol: "META", label: "Meta Platforms Inc.", type: "stock", basePrice: 485.40, volatility: 0.0012 },
  { symbol: "NVDA", label: "NVIDIA Corp.", type: "stock", basePrice: 875.30, volatility: 0.0018 },
  { symbol: "TSLA", label: "Tesla Inc.", type: "stock", basePrice: 198.40, volatility: 0.002 },
  { symbol: "AMD", label: "Advanced Micro Devices", type: "stock", basePrice: 168.50, volatility: 0.0018 },
  { symbol: "NFLX", label: "Netflix Inc.", type: "stock", basePrice: 612.40, volatility: 0.0014 },
  { symbol: "INTC", label: "Intel Corp.", type: "stock", basePrice: 42.30, volatility: 0.0012 },
  { symbol: "ORCL", label: "Oracle Corp.", type: "stock", basePrice: 122.50, volatility: 0.001 },
  { symbol: "CRM", label: "Salesforce Inc.", type: "stock", basePrice: 295.20, volatility: 0.0012 },
  { symbol: "ADBE", label: "Adobe Inc.", type: "stock", basePrice: 528.40, volatility: 0.0012 },

  // ===== STOCKS — FINANCIALS / INDUSTRIALS / CONSUMER =====
  { symbol: "JPM", label: "JPMorgan Chase", type: "stock", basePrice: 198.20, volatility: 0.0009 },
  { symbol: "BAC", label: "Bank of America", type: "stock", basePrice: 38.40, volatility: 0.001 },
  { symbol: "GS", label: "Goldman Sachs", type: "stock", basePrice: 415.20, volatility: 0.001 },
  { symbol: "V", label: "Visa Inc.", type: "stock", basePrice: 278.40, volatility: 0.0008 },
  { symbol: "MA", label: "Mastercard Inc.", type: "stock", basePrice: 465.20, volatility: 0.0008 },
  { symbol: "BRK.B", label: "Berkshire Hathaway", type: "stock", basePrice: 412.50, volatility: 0.0006 },
  { symbol: "WMT", label: "Walmart Inc.", type: "stock", basePrice: 60.20, volatility: 0.0007 },
  { symbol: "DIS", label: "Walt Disney Co.", type: "stock", basePrice: 112.40, volatility: 0.001 },
  { symbol: "KO", label: "Coca-Cola Co.", type: "stock", basePrice: 60.50, volatility: 0.0006 },
  { symbol: "PEP", label: "PepsiCo Inc.", type: "stock", basePrice: 172.40, volatility: 0.0007 },
  { symbol: "MCD", label: "McDonald's Corp.", type: "stock", basePrice: 285.20, volatility: 0.0007 },
  { symbol: "NKE", label: "Nike Inc.", type: "stock", basePrice: 92.40, volatility: 0.0011 },
  { symbol: "BA", label: "Boeing Co.", type: "stock", basePrice: 178.20, volatility: 0.0014 },
  { symbol: "XOM", label: "Exxon Mobil Corp.", type: "stock", basePrice: 115.40, volatility: 0.0009 },
  { symbol: "CVX", label: "Chevron Corp.", type: "stock", basePrice: 158.20, volatility: 0.0009 },
  { symbol: "PFE", label: "Pfizer Inc.", type: "stock", basePrice: 27.80, volatility: 0.001 },
  { symbol: "JNJ", label: "Johnson & Johnson", type: "stock", basePrice: 152.40, volatility: 0.0007 },
  { symbol: "UNH", label: "UnitedHealth Group", type: "stock", basePrice: 495.20, volatility: 0.0009 },

  // ===== NFT COLLECTIONS & INDICES =====
  { symbol: "NFT-BLUE", label: "Blue-Chip NFT Index", type: "nft", basePrice: 1240, volatility: 0.002 },
  { symbol: "BAYC", label: "Bored Ape Yacht Club (Floor)", type: "nft", basePrice: 18.5, volatility: 0.003 },
  { symbol: "MAYC", label: "Mutant Ape Yacht Club (Floor)", type: "nft", basePrice: 3.6, volatility: 0.0035 },
  { symbol: "CRYPTOPUNKS", label: "CryptoPunks (Floor)", type: "nft", basePrice: 42.5, volatility: 0.0028 },
  { symbol: "AZUKI", label: "Azuki (Floor)", type: "nft", basePrice: 6.8, volatility: 0.003 },
  { symbol: "DOODLES", label: "Doodles (Floor)", type: "nft", basePrice: 1.8, volatility: 0.0035 },
  { symbol: "MOONBIRDS", label: "Moonbirds (Floor)", type: "nft", basePrice: 1.4, volatility: 0.0035 },
  { symbol: "PUDGY", label: "Pudgy Penguins (Floor)", type: "nft", basePrice: 12.2, volatility: 0.003 },
  { symbol: "CLONEX", label: "CloneX (Floor)", type: "nft", basePrice: 1.1, volatility: 0.0035 },
  { symbol: "ART-BLOCKS", label: "Art Blocks Curated Index", type: "nft", basePrice: 4.5, volatility: 0.0032 },
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
