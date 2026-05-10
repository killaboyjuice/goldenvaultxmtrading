import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-[oklch(0.10_0.01_60)]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-[oklch(0.78_0.16_75)] to-[oklch(0.55_0.13_60)]">
                <span className="font-display text-base font-black text-[oklch(0.15_0.01_60)]">PT</span>
              </div>
              <div>
                <div className="font-display text-base font-bold text-foreground">GOLDEN VAULT XM</div>
                <div className="text-[10px] tracking-[0.3em] text-muted-foreground">CHAIN</div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Enterprise-grade trading platform providing access to global financial markets with
              institutional-level security and performance.
            </p>
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> support@primetraderchain.com</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> 24/7 Trading Desk</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Global Trading Hub</div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-base font-bold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/markets" className="hover:text-gold">Markets</Link></li>
              <li><Link to="/markets" className="hover:text-gold">Trading</Link></li>
              <li><Link to="/support" className="hover:text-gold">Support</Link></li>
            </ul>
            <h4 className="mb-4 mt-8 font-display text-base font-bold">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-gold">Login</Link></li>
              <li><Link to="/register" className="hover:text-gold">Register</Link></li>
              <li><Link to="/dashboard" className="hover:text-gold">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-base font-bold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/support" className="hover:text-gold">Support Center</Link></li>
              <li><Link to="/markets" className="hover:text-gold">Trading Guide</Link></li>
              <li><Link to="/markets" className="hover:text-gold">Market Analysis</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row">
          <div>© 2026 GOLDEN VAULT XM. All rights reserved.</div>
          <div className="flex gap-5">
            <span>Privacy Policy</span><span>Terms of Service</span><span>Risk Disclosure</span>
          </div>
        </div>

        <div className="mt-4 rounded border border-border/50 p-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Risk Warning:</span> Trading in financial
          instruments carries a high level of risk and may not be suitable for all investors. Please
          ensure you fully understand the risks involved and seek independent advice if necessary.
        </div>
      </div>
    </footer>
  );
}
