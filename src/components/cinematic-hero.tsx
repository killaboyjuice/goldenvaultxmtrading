import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Target } from "lucide-react";
import cyborg from "@/assets/hero-cyborg.jpg";
import network from "@/assets/hero-network.mp4";

/**
 * CinematicHero — Luxury Tech hero section.
 * - Cyborg still + ambient network video composited via mix-blend-mode
 * - Gold-dominant color grade via SVG color-matrix + amber overlays
 * - Mouse parallax (3D look-into-screen) on the cyborg
 * - Breathing gold-glow oscillation
 * - Radial vignette + backdrop-blur to keep typography razor-sharp
 */
export function CinematicHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: cx, y: cy });
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative isolate overflow-hidden bg-[#0a0705]"
      style={{ minHeight: "min(100vh, 920px)" }}
      aria-label="Hero"
    >
      {/* SVG color-matrix: blue→gold remap */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="liquidGold" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                1.25 0.45 0.10 0 0.04
                0.85 0.65 0.10 0 0.02
                0.20 0.30 0.20 0 0
                0    0    0    1 0"
            />
            <feComponentTransfer>
              <feFuncR type="gamma" amplitude="1" exponent="0.85" />
              <feFuncG type="gamma" amplitude="1" exponent="0.95" />
              <feFuncB type="gamma" amplitude="1" exponent="1.5" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* Layer 1 — ambient gold network video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        style={{
          filter: "url(#liquidGold) saturate(1.2) contrast(1.1)",
          mixBlendMode: "screen",
        }}
      >
        <source src={network} type="video/mp4" />
      </video>

      {/* Layer 2 — cyborg with parallax + gold remap */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          perspective: "1400px",
        }}
      >
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
          style={{
            transform: mounted
              ? `translate3d(${tilt.x * -28}px, ${tilt.y * -22}px, 0) rotateX(${tilt.y * -3}deg) rotateY(${tilt.x * 4}deg) scale(1.06)`
              : "scale(1.06)",
          }}
        >
          <img
            src={cyborg}
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-[center_20%] opacity-90"
            style={{
              filter:
                "url(#liquidGold) saturate(1.15) contrast(1.05) brightness(0.92)",
            }}
          />
        </div>
      </div>

      {/* Layer 3 — golden network re-pulse OVER cyborg (plus-lighter) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40 [animation:hero-breathe_7s_ease-in-out_infinite]"
        style={{
          filter: "url(#liquidGold) blur(0.5px)",
          mixBlendMode: "plus-lighter",
        }}
      >
        <source src={network} type="video/mp4" />
      </video>

      {/* Amber wash + breathing gold glow */}
      <div
        className="pointer-events-none absolute inset-0 [animation:hero-breathe_6s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, rgba(255,180,60,0.22), transparent 65%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Deep radial vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 30%, rgba(8,4,2,0.55) 65%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {/* Bottom fade into page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0a0705]" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[inherit] max-w-7xl flex-col justify-center px-6 py-24 sm:py-32">
        <div
          className="mx-auto max-w-3xl rounded-2xl border border-amber-200/10 bg-black/15 p-8 text-center shadow-2xl sm:p-12"
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div className="text-[10px] font-semibold uppercase tracking-[0.4em] text-amber-200/80">
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300 align-middle shadow-[0_0_10px_rgba(252,211,77,0.9)]" />
            Liquid Gold Protocol — Live
          </div>

          <h1
            className="mt-6 font-display text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl"
            style={{ fontFamily: "'Sora', 'Inter', system-ui, sans-serif" }}
          >
            <span className="block">PRECISION.</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(110deg, #fff3c4 0%, #f6c663 35%, #b8862a 60%, #f6c663 85%, #fff3c4 100%)",
                filter: "drop-shadow(0 0 24px rgba(246,198,99,0.35))",
              }}
            >
              VELOCITY.
            </span>
            <span className="block">INSIGHT.</span>
          </h1>

          <p
            className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-zinc-300/90 sm:text-base"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Institutional-grade infrastructure for Forex, Crypto, Futures, Commodities and NFTs —
            engineered for traders who demand sub-millisecond execution and uncompromising security.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#1a1208] transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, #fff1c2 0%, #f3c45a 45%, #b8862a 100%)",
                boxShadow:
                  "0 0 0 1px rgba(255,225,150,0.4), 0 8px 32px -4px rgba(246,198,99,0.55), 0 0 60px -8px rgba(246,198,99,0.65), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-70 transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative">Get Started</span>
              <ArrowRight className="relative h-4 w-4" />
            </Link>

            <Link
              to="/markets"
              className="inline-flex items-center gap-2 rounded-lg border border-amber-200/30 bg-white/5 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-100 backdrop-blur transition hover:border-amber-200/60 hover:bg-white/10"
            >
              Explore Markets <Target className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-zinc-400">
            <span>FCA · CySEC · ASIC Aligned</span>
            <span className="hidden sm:inline">·</span>
            <span>$2.4B+ Daily Volume</span>
            <span className="hidden sm:inline">·</span>
            <span>150K+ Traders</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-breathe {
          0%, 100% { opacity: var(--from, 0.35); }
          50% { opacity: var(--to, 0.7); }
        }
      `}</style>
    </section>
  );
}
