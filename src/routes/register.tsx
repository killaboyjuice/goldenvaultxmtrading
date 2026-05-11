import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/components/site-layout";
import { externalSupabase } from "@/integrations/external-externalSupabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({ meta: [{ title: "Create Account — GOLDEN VAULT XM" }] }),
});

function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await externalSupabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: username },
        emailRedirectTo: window.location.origin + "/dashboard",
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — check your email to verify.");
    navigate({ to: "/login" });
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) toast.error(result.error.message ?? "Google sign-in failed");
  };

  return (
    <SiteLayout>
      <section className="bg-hero py-12 min-h-[80vh]">
        <div className="mx-auto max-w-md px-6">
          <div className="corner-frame rounded-lg border border-gold/30 bg-card p-8 shadow-glow">
            <span className="corner-tl" /><span className="corner-br" />
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold">Create <span className="text-gradient-gold">Account</span></h1>
              <p className="mt-2 text-sm text-muted-foreground">Start trading in minutes</p>
            </div>

            <button onClick={onGoogle} className="mt-6 flex w-full items-center justify-center gap-2 rounded border border-border/60 bg-secondary py-2.5 text-sm font-medium hover:bg-secondary/70">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username"
                className="w-full rounded border border-border/60 bg-background px-4 py-2.5 text-sm outline-none focus:border-gold" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email"
                className="w-full rounded border border-border/60 bg-background px-4 py-2.5 text-sm outline-none focus:border-gold" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} placeholder="Password (min 6 chars)"
                className="w-full rounded border border-border/60 bg-background px-4 py-2.5 text-sm outline-none focus:border-gold" />
              <button disabled={loading} className="w-full rounded bg-gold py-2.5 text-sm font-bold text-[oklch(0.15_0.01_60)] shadow-gold disabled:opacity-50">
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Already have an account? <Link to="/login" className="font-semibold text-gold">Login</Link>
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
