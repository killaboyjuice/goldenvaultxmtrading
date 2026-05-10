import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Mail, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Support Center — GOLDEN VAULT XM" },
      { name: "description", content: "Get help from our 24/7 trading support team." },
    ],
  }),
});

function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Please fill out all fields");
      return;
    }
    toast.success("Message received — we'll respond within 24 hours.");
    setName(""); setEmail(""); setSubject(""); setMessage("");
  };

  return (
    <SiteLayout>
      <section className="bg-hero py-14">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-display text-5xl font-black sm:text-6xl">
            Support <span className="text-gradient-gold">Center</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            Our dedicated support team is here to help you 24/7. Get in touch with us and we'll
            respond as soon as possible.
          </p>
        </div>
      </section>

      <section className="bg-background py-10">
        <div className="mx-auto max-w-4xl space-y-5 px-6">
          <Card icon={Mail} title="Email Support" desc="Send us an email and we'll get back to you within 24 hours.">
            <a href="mailto:support@primetraderchain.com" className="text-sm text-gold hover:underline">
              support@primetraderchain.com
            </a>
          </Card>
          <Card icon={MessageCircle} title="Live Chat" desc="Chat with our support team in real-time for immediate assistance.">
            <span className="text-xs text-muted-foreground">Available 24/7</span>
          </Card>

          <div className="rounded-lg border border-gold/30 bg-gradient-to-br from-card to-card/50 p-6">
            <h3 className="font-display text-xl font-bold">Quick Response</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We typically respond to all inquiries within 2-4 hours during business hours and within
              24 hours on weekends.
            </p>
          </div>

          <form onSubmit={onSubmit} className="rounded-lg border border-border/50 bg-card p-6">
            <h3 className="font-display text-2xl font-bold">Contact Us</h3>
            <p className="mt-1 text-sm text-muted-foreground">Fill out the form below and we'll respond promptly</p>

            <div className="mt-5 space-y-4">
              <Field label="Your Name *">
                <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="John Doe" />
              </Field>
              <Field label="Email Address *">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" placeholder="your.email@example.com" />
              </Field>
              <Field label="Subject *">
                <input value={subject} onChange={(e) => setSubject(e.target.value)} className="input" placeholder="How can we help?" />
              </Field>
              <Field label="Message *">
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="input resize-none" placeholder="Tell us more about your inquiry..." />
              </Field>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded bg-gold py-3 text-sm font-bold text-[oklch(0.15_0.01_60)] shadow-gold">
                Send Message <Send className="h-4 w-4" />
              </button>
              <div className="text-center text-[11px] text-muted-foreground">We typically respond within 24 hours</div>
            </div>
          </form>
        </div>
      </section>

      <style>{`
        .input {
          width: 100%;
          background: oklch(0.10 0.01 60);
          border: 1px solid oklch(0.28 0.02 70 / 60%);
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 14px;
          color: var(--color-foreground);
          outline: none;
        }
        .input:focus { border-color: var(--gold); }
      `}</style>
    </SiteLayout>
  );
}

function Card({ icon: Icon, title, desc, children }: any) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-6">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded bg-gold/10 text-gold">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 font-display text-xl font-bold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
