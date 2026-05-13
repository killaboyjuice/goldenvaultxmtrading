import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, type IChartApi, type ISeriesApi } from "lightweight-charts";
import {
  ASSETS,
  generateInitialCandles,
  nextSimulatedTick,
  type Candle,
} from "@/lib/market-data";

export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "D";

const TF_SECONDS: Record<Timeframe, number> = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "1h": 3600,
  "4h": 14400,
  D: 86400,
};

const TF_BINANCE: Record<Timeframe, string> = {
  "1m": "1m",
  "5m": "5m",
  "15m": "15m",
  "1h": "1h",
  "4h": "4h",
  D: "1d",
};

interface Props {
  symbol: string;
  height?: number;
  timeframe?: Timeframe;
}

export function LiveChart({ symbol, height = 380, timeframe = "1m" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const asset = ASSETS.find((a) => a.symbol === symbol) ?? ASSETS[0];
    const intervalSec = TF_SECONDS[timeframe];

    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { color: "transparent" },
        textColor: "#a8a29e",
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        vertLines: { color: "rgba(168, 162, 158, 0.06)" },
        horzLines: { color: "rgba(168, 162, 158, 0.06)" },
      },
      timeScale: { timeVisible: timeframe !== "D", secondsVisible: false, borderColor: "rgba(168,162,158,0.1)" },
      rightPriceScale: { borderColor: "rgba(168,162,158,0.1)" },
      crosshair: { mode: 1 },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderUpColor: "#10b981",
      borderDownColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    let candles: Candle[] = generateInitialCandlesForInterval(asset.basePrice, asset.volatility, intervalSec, 200);
    series.setData(candles as any);
    chart.timeScale().fitContent();

    let ws: WebSocket | null = null;
    let simInterval: ReturnType<typeof setInterval> | null = null;

    if (asset.binanceSymbol) {
      try {
        ws = new WebSocket(
          `wss://stream.binance.com:9443/ws/${asset.binanceSymbol}@kline_${TF_BINANCE[timeframe]}`,
        );
        ws.onmessage = (ev) => {
          try {
            const msg = JSON.parse(ev.data);
            const k = msg.k;
            if (!k) return;
            const candle: Candle = {
              time: Math.floor(k.t / 1000),
              open: parseFloat(k.o),
              high: parseFloat(k.h),
              low: parseFloat(k.l),
              close: parseFloat(k.c),
            };
            const last = candles[candles.length - 1];
            if (last && candle.time === last.time) {
              candles[candles.length - 1] = candle;
            } else if (last && candle.time > last.time) {
              candles.push(candle);
              if (candles.length > 400) candles.shift();
            }
            series.update(candle as any);
          } catch {}
        };
        ws.onerror = () => startSim();
      } catch {
        startSim();
      }
    } else {
      startSim();
    }

    function startSim() {
      simInterval = setInterval(() => {
        const last = candles[candles.length - 1];
        const updated = nextSimulatedTick(last, asset.volatility);
        candles[candles.length - 1] = updated;
        series.update(updated as any);
        if (Math.random() < 0.05) {
          const next: Candle = {
            time: updated.time + intervalSec,
            open: updated.close,
            high: updated.close,
            low: updated.close,
            close: updated.close,
          };
          candles.push(next);
          if (candles.length > 400) candles.shift();
        }
      }, 1000);
    }

    const onResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (ws) ws.close();
      if (simInterval) clearInterval(simInterval);
      chart.remove();
    };
  }, [symbol, height, timeframe]);

  return <div ref={containerRef} className="w-full" style={{ height }} />;
}

function generateInitialCandlesForInterval(base: number, vol: number, intervalSec: number, count: number): Candle[] {
  const candles: Candle[] = [];
  let price = base;
  const now = Math.floor(Date.now() / 1000);
  const aligned = now - (now % intervalSec);
  for (let i = count; i > 0; i--) {
    const time = aligned - i * intervalSec;
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
