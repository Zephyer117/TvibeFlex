"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import type { NewsletterSettings } from "@/types";

interface Props {
  settings: NewsletterSettings;
}

export default function NewsletterSection({ settings }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not subscribe.");
        return;
      }
      toast.success(
        data.message || settings.successMessage || "Thank you for subscribing!"
      );
      setEmail("");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        {settings.eyebrow && (
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            {settings.eyebrow}
          </p>
        )}
        <h2 className="section-title mb-4">{settings.title}</h2>
        {settings.description && (
          <p className="text-[var(--text-muted)] font-body mb-8">
            {settings.description}
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-0 max-w-sm mx-auto"
        >
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={settings.emailPlaceholder || "Your email address"}
            className="input-luxury flex-1 sm:border-r-0"
            required
            disabled={loading}
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-gold px-6 flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <span>{settings.buttonLabel || "Subscribe"}</span>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
