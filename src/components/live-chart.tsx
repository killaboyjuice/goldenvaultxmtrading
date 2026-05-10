import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, type IChartApi, type ISeriesApi } from "lightweight-charts";
import {
  ASSETS,
  generateInitialCandles,
  nextSimulatedTick,
  newCandleAfter,
  type Candle,
} from "@/lib/market-data";

interface Props {
  symbol: string;
  height?: number;
}

export function LiveChart({ symbol, height = 380 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const asset = ASSETS.find((a) => a.symbol === symbol) ?? ASSETS[0];

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
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: "rgba(168,162,158,0.1)" },
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

    let candles: Candle[] = generateInitialCandles(asset.basePrice, asset.volatility, 150);
    series.setData(candles as any);

    let ws: WebSocket | null = null;
    let simInterval: ReturnType<typeof setInterval> | null = null;

    if (asset.binanceSymbol) {
      try {
        ws = new WebSocket(`wss://stream.binance.com:9443/ws/${asset.binanceSymbol}@kline_1m`);
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
              if (candles.length > 300) candles.shift();
            }
            series.update(candle as any);
          } catch {}
        };
        ws.onerror = () => {
          // fallback to simulation
          startSim();
        };
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
        // new candle every 60 ticks
        if (Math.random() < 0.05) {
          const next = newCandleAfter(updated);
          candles.push(next);
          if (candles.length > 300) candles.shift();
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

    return () => {
      window.removeEventListener("resize", onResize);
      if (ws) ws.close();
      if (simInterval) clearInterval(simInterval);
      chart.remove();
    };
  }, [symbol, height]);

  return <div ref={containerRef} className="w-full" style={{ height }} />;
}
