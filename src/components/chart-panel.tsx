import { useState } from "react";
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

  return (
    <>
      <div className="rounded-lg border border-border/50 bg-card p-3 sm:p-4">
        <Toolbar
          heading={heading}
          subtitle={asset?.label}
          tf={tf}
          onTf={setTf}
          onZoom={() => setZoomed(true)}
        />
        <LiveChart symbol={symbol} height={height} timeframe={tf} />
      </div>

      {zoomed && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background">
          <div className="flex items-center justify-between gap-2 border-b border-border/50 px-3 py-2 sm:px-5">
            <div className="min-w-0">
              <div className="truncate font-display text-base font-bold sm:text-xl">{heading}</div>
              {asset?.label && (
                <div className="truncate text-[11px] text-muted-foreground sm:text-xs">{asset.label}</div>
              )}
            </div>
            <button
              onClick={() => setZoomed(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Close full screen"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto border-b border-border/50 px-3 py-2 sm:px-5">
            <TimeframeButtons tf={tf} onTf={setTf} />
            <span className="ml-auto rounded bg-bull/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-bull">
              ● LIVE
            </span>
          </div>
          <div className="flex-1 px-2 pb-3 pt-2 sm:px-4">
            <div className="h-full w-full">
              <FullscreenChart symbol={symbol} timeframe={tf} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Toolbar({
  heading,
  subtitle,
  tf,
  onTf,
  onZoom,
}: {
  heading: string;
  subtitle?: string;
  tf: Timeframe;
  onTf: (t: Timeframe) => void;
  onZoom: () => void;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-base font-bold sm:text-lg">{heading}</div>
        {subtitle && <div className="truncate text-[11px] text-muted-foreground">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-1 overflow-x-auto">
        <TimeframeButtons tf={tf} onTf={onTf} />
      </div>
      <button
        onClick={onZoom}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
        aria-label="Open full screen"
        title="Full screen"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </button>
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
          className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${
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

function FullscreenChart({ symbol, timeframe }: { symbol: string; timeframe: Timeframe }) {
  // Use viewport height minus header+toolbar (~110px) for responsive sizing.
  const [h, setH] = useState(() =>
    typeof window === "undefined" ? 600 : Math.max(320, window.innerHeight - 130),
  );
  if (typeof window !== "undefined") {
    // update on resize
    if (typeof (FullscreenChart as any)._bound === "undefined") {
      (FullscreenChart as any)._bound = true;
    }
  }
  // Bind a resize listener once per mount via effect-like pattern
  // (kept simple — LiveChart also internally resizes)
  return <ResizingChart symbol={symbol} timeframe={timeframe} h={h} setH={setH} />;
}

function ResizingChart({
  symbol,
  timeframe,
  h,
  setH,
}: {
  symbol: string;
  timeframe: Timeframe;
  h: number;
  setH: (n: number) => void;
}) {
  if (typeof window !== "undefined") {
    // attach once
    const key = "__gv_zoom_resize";
    if (!(window as any)[key]) {
      (window as any)[key] = true;
    }
  }
  // Use a window resize handler via React effect
  useWindowResize(() => setH(Math.max(320, window.innerHeight - 130)));
  return <LiveChart symbol={symbol} height={h} timeframe={timeframe} />;
}

function useWindowResize(cb: () => void) {
  if (typeof window === "undefined") return;
  // simple useEffect substitute
  const { useEffect } = require("react") as typeof import("react");
  useEffect(() => {
    const handler = () => cb();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
