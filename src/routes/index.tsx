import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { ChartPanel } from "@/components/chart-panel";
import { PriceCard } from "@/components/price-ticker";
import { CinematicHero } from "@/components/cinematic-hero";
import { ArrowRight, Globe, TrendingUp, BarChart3, Zap, Shield, Users, Target, Activity } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "GOLDEN VAULT XM — Precision. Velocity. Insight." },
      { name: "description", content: "Trade Forex, Crypto, Futures, Commodities and NFTs on institutional-grade infrastructure." },
    ],
  }),
});

function HomePage() {
  return (
    <SiteLayout>
      <CinematicHero />
      <FeaturedChart />
      <MarketViz />
      <Steps />
      <Stats />
      <Infrastructure />
      <MultiAsset />
      <CTA />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="text-center">
          <div className="text-xs tracking-[0.3em] text-muted-foreground">
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-bull align-middle" />
            System Online // Live Data
          </div>
          <h1 className="mt-6 font-display text-5xl font-black leading-[0.95] sm:text-7xl">
            <div>PRECISION</div>
            <div className="text-gradient-gold">VELOCITY</div>
            <div>INSIGHT.</div>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl border-l-2 border-gold/60 pl-4 text-left text-sm leading-relaxed text-muted-foreground sm:text-base">
            Experience access to institutional-grade trading infrastructure engineered for precision,
            performance, and global market reach. Engage seamlessly across multiple financial markets,
            including Forex, Cryptocurrency, Futures, Commodities, and NFT ecosystems, all within a
            unified and advanced trading environment. Built with a strong emphasis on security,
            reliability, and execution speed.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="rounded-md bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-wider text-background transition hover:bg-gold"
            >
              Initialize Trading
            </Link>
            <Link
              to="/markets"
              className="flex items-center gap-2 rounded-md bg-purple px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
            >
              Explore Markets <Target className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 shadow-glow">
          <ChartPanel symbol="S&P 500" height={360} />
        </div>
      </div>
    </section>
  );
}

function MarketViz() {
  const items = [
    { sym: "BTC/USDT", sub: "Perpetual Futures", img: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=70" },
    { sym: "ETH/USDT", sub: "Spot Trading", img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=70" },
    { sym: "EUR/USD", sub: "Forex Pairs", img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=70" },
  ];
  return (
    <section className="relative overflow-hidden bg-dark-gradient py-16 sm:py-20">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded border border-gold/40 bg-gold/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold">
            <BarChart3 className="h-4 w-4" /> Market Intelligence <ArrowRight className="h-3 w-3" />
          </div>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            Real-Time Trading <span className="text-gradient-gold">Visualization</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm italic text-muted-foreground">
            Advanced charting tools and market analytics powered by institutional-grade data feeds.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.sym} className="group relative overflow-hidden rounded-lg border border-border/50 bg-card">
              <div
                className="h-56 bg-cover bg-center transition group-hover:scale-105"
                style={{ backgroundImage: `url(${it.img})` }}
              />
              <div className="p-4">
                <div className="font-display text-lg font-bold">{it.sym}</div>
                <div className="text-xs text-muted-foreground">{it.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="overflow-hidden rounded-lg border border-border/50 bg-card p-6">
            <div className="text-gradient-gold font-display text-xl font-bold">Global Trading Markets</div>
            <p className="mt-2 text-sm text-muted-foreground">Access 200+ trading pairs across all major asset classes</p>
          </div>
          <div className="overflow-hidden rounded-lg border border-border/50 bg-card p-6">
            <div className="font-display text-xl font-bold">NFT Marketplace</div>
            <p className="mt-2 text-sm text-muted-foreground">Trade digital assets and collectibles on our secure platform</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Steps() {
  const steps = [
    { n: "01", icon: Users, t: "Register Your Account", d: "Create a secure account in minutes. Provide your email, set a strong password, and verify your identity to get started." },
    { n: "02", icon: TrendingUp, t: "Deposit Funds", d: "Fund your account using multiple payment methods including bank transfers, credit cards, and cryptocurrency deposits." },
    { n: "03", icon: BarChart3, t: "Start Trading", d: "Access real-time market data, execute trades across multiple asset classes, and monitor your positions with advanced tools." },
    { n: "04", icon: ArrowRight, t: "Withdraw Profits", d: "Easily withdraw your earnings through your preferred payment method. Fast processing with minimal fees." },
  ];
  return (
    <section className="relative bg-hero py-16 sm:py-20">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded border border-gold/40 bg-gold/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold">
            <Zap className="h-4 w-4" /> Quick Start <ArrowRight className="h-3 w-3" />
          </div>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            Get Started in <span className="text-gradient-gold">Four Simple Steps</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Follow our streamlined onboarding process to register, deposit, trade, and withdraw with ease.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {steps.map((s) => (
            <div key={s.n} className="corner-frame rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur">
              <span className="corner-tl" /><span className="corner-br" />
              <div className="font-display text-3xl font-bold text-gold/40">{s.n}</div>
              <div className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded bg-gold/10 text-gold">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-lg font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-md bg-purple px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
          >
            Start Your Journey <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: "$2.4B+", l: "Daily Trading Volume" },
    { v: "150K+", l: "Active Traders" },
    { v: "200+", l: "Trading Pairs" },
    { v: "24/7", l: "Support Available" },
  ];
  return (
    <section className="border-y border-border/50 bg-[oklch(0.10_0.01_60)] py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl font-black sm:text-4xl">{s.v}</div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Infrastructure() {
  const features = [
    { icon: TrendingUp, t: "Advanced Trading", d: "Access global markets with institutional-grade trading tools and real-time analytics" },
    { icon: Shield, t: "Bank-Level Security", d: "Multi-layer encryption and cold storage protection for your digital assets" },
    { icon: Zap, t: "Lightning Execution", d: "Sub-millisecond order routing across deep liquidity pools" },
    { icon: Globe, t: "Global Access", d: "Trade 24/7 across forex, crypto, equities, and commodities" },
  ];
  return (
    <section className="relative bg-hero py-16 sm:py-20">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="inline-flex items-center gap-2 rounded border border-gold/40 bg-gold/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gold">
          <Activity className="h-3 w-3" /> Core Architecture
        </div>
        <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
          Enterprise-Grade<br /><span className="text-gradient-gold">Infrastructure.</span>
        </h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Built on cutting-edge technology to deliver unmatched performance, security, and reliability
          for institutional and retail traders alike.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.t} className="rounded-lg border border-border/50 bg-card/60 p-6 backdrop-blur">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded bg-gold/10 text-gold">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-lg font-bold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MultiAsset() {
  const list = [
    { n: "01", t: "Forex Trading" },
    { n: "02", t: "Cryptocurrency" },
    { n: "03", t: "Futures Contracts" },
    { n: "04", t: "Commodities" },
    { n: "05", t: "NFT Marketplace" },
  ];
  const previews = ["BTC/USDT", "ETH/USDT", "EUR/USD", "S&P 500"];
  return (
    <section className="bg-dark-gradient py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Multi-Asset <span className="text-gradient-gold">Trading Ecosystem</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Access a comprehensive suite of trading instruments across global markets. From traditional
            Forex and commodities to cutting-edge cryptocurrency and NFT markets.
          </p>
        </div>

        <div className="mt-10 divide-y divide-border/40 border-y border-border/40">
          {list.map((it) => (
            <Link
              key={it.n}
              to="/markets"
              className="flex items-center justify-between py-5 transition hover:bg-gold/5 hover:px-2"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs text-gold/70">{it.n}</span>
                <span className="font-display text-lg font-medium">{it.t}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <Link to="/markets" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
          View Full Market Data <ArrowRight className="h-3 w-3" />
        </Link>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {previews.map((s) => <PriceCard key={s} symbol={s} />)}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="corner-frame relative rounded-lg border border-gold/30 bg-card p-10 shadow-glow">
          <span className="corner-tl" /><span className="corner-br" />
          <div className="text-center">
            <h2 className="font-display text-4xl font-black sm:text-5xl">
              INITIATE YOUR<br /><span className="text-gradient-gold">TRADING SEQUENCE</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
              Join thousands of institutional and retail traders who trust GOLDEN VAULT XM for their financial execution.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-xs font-bold uppercase tracking-wider text-[oklch(0.15_0.01_60)] shadow-gold">
                Create Account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/support" className="rounded-md border border-border bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-secondary">
                Contact Support
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-gold" /> Secure & Encrypted</span>
              <span className="flex items-center gap-1.5"><Target className="h-3 w-3 text-gold" /> Regulated</span>
              <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-gold" /> 24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
