import { useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { LiveChart, type Timeframe } from "@/components/live-chart";
import { ASSETS } from "@/lib/market-data";

const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "D"];

interface Props {
  symbol: string;
  height?: number;
  title?: string;
}

export function ChartPanel({ symbol, height = 380, title }: Props) {
  const [tf, setTf] = useState<Timeframe>("1m");
  const [zoomed, setZoomed] = useState(false);
  const asset = ASSETS.find((a) => a.symbol === symbol);
  const heading = title ?? symbol;

  // Lock body scroll while zoomed
  useEffect(() => {
    if (!zoomed) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [zoomed]);

  return (
    <>
      <div className="rounded-lg border border-border/50 bg-card p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-base font-bold sm:text-lg">{heading}</div>
            {asset?.label && (
              <div className="truncate text-[11px] text-muted-foreground">{asset.label}</div>
            )}
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            <TimeframeButtons tf={tf} onTf={setTf} />
          </div>
          <button
            onClick={() => setZoomed(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Open full screen"
            title="Full screen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <LiveChart symbol={symbol} height={height} timeframe={tf} />
      </div>

      {zoomed && (
        <FullscreenChartModal
          symbol={symbol}
          heading={heading}
          subtitle={asset?.label}
          tf={tf}
          onTf={setTf}
          onClose={() => setZoomed(false)}
        />
      )}
    </>
  );
}

function FullscreenChartModal({
  symbol,
  heading,
  subtitle,
  tf,
  onTf,
  onClose,
}: {
  symbol: string;
  heading: string;
  subtitle?: string;
  tf: Timeframe;
  onTf: (t: Timeframe) => void;
  onClose: () => void;
}) {
  const [h, setH] = useState(() =>
    typeof window === "undefined" ? 600 : Math.max(320, window.innerHeight - 130),
  );

  useEffect(() => {
    const handler = () => setH(Math.max(320, window.innerHeight - 130));
    window.addEventListener("resize", handler);
    handler();
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      <div className="flex items-center justify-between gap-2 border-b border-border/50 px-3 py-2 sm:px-5">
        <div className="min-w-0">
          <div className="truncate font-display text-base font-bold sm:text-xl">{heading}</div>
          {subtitle && (
            <div className="truncate text-[11px] text-muted-foreground sm:text-xs">{subtitle}</div>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Close full screen"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border/50 px-3 py-2 sm:px-5">
        <TimeframeButtons tf={tf} onTf={onTf} />
        <span className="ml-auto shrink-0 rounded bg-bull/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-bull">
          ● LIVE
        </span>
      </div>
      <div className="flex-1 px-2 pb-3 pt-2 sm:px-4">
        <LiveChart symbol={symbol} height={h} timeframe={tf} />
      </div>
    </div>
  );
}

function TimeframeButtons({ tf, onTf }: { tf: Timeframe; onTf: (t: Timeframe) => void }) {
  return (
    <>
      {TIMEFRAMES.map((t) => (
        <button
          key={t}
          onClick={() => onTf(t)}
          className={`shrink-0 rounded px-2.5 py-1 text-[11px] font-semibold transition ${
            tf === t
              ? "bg-gold text-[oklch(0.15_0.01_60)]"
              : "border border-border/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          {t}
        </button>
      ))}
    </>
  );
}
