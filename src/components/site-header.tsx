import { Link } from "@tanstack/react-router";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import logo from "@/assets/logo.png";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  const links = [
    { to: "/", label: "Home" },
    { to: "/markets", label: "Markets" },
    { to: "/support", label: "Support" },
    ...(user ? [{ to: "/dashboard", label: "Dashboard" }, { to: "/wallets", label: "Wallets" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-[oklch(0.78_0.16_75)] to-[oklch(0.55_0.13_60)] shadow-gold">
            <img src={logo} alt="Golden Vault XM logo" className="h-full w-full object-cover" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-wider text-gold">GOLDEN VAULT XM</div>
            <div className="text-[10px] tracking-[0.25em] text-gold/60">ELITE TRADING</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-muted-foreground transition hover:text-gold"
              activeProps={{ className: "text-gold" }}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 rounded-md border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold hover:bg-gold/10"
            >
              <LogOut className="h-3 w-3" /> Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-gradient-to-r from-[oklch(0.78_0.16_75)] to-[oklch(0.65_0.15_70)] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[oklch(0.15_0.01_60)] shadow-gold"
            >
              Login
            </Link>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="text-gold" /> : <Menu className="text-gold" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="rounded px-3 py-2 text-left text-sm text-gold"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded bg-gold px-3 py-2 text-center text-sm font-semibold text-[oklch(0.15_0.01_60)]"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
