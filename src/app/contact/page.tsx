"use client";

import { useState } from "react";
import { Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const CONTACT_EMAIL = "msutsho55@gmail.com";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not send message.");
        return;
      }

      toast.success(data.message || "Message sent!");
      setSubmitted(true);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] py-14 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">
            Get in Touch
          </p>
          <h1 className="section-title">Contact Us</h1>
          <p className="text-[var(--text-muted)] font-body mt-3 text-sm">
            We&apos;d love to hear from you. Our team responds within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-body font-semibold text-[var(--text-primary)] tracking-widest uppercase text-xs mb-6">
                Contact Information
              </h2>
              {[
                {
                  Icon: Mail,
                  title: "Email",
                  info: CONTACT_EMAIL,
                  sub: "We reply within 24 hours",
                },
                {
                  Icon: MapPin,
                  title: "Address",
                  info: "Khulna, Bangladesh",
                  sub: "Khulna, Bangladesh",
                },
                {
                  Icon: Clock,
                  title: "Hours",
                  info: "24/7 Open",
                  sub: "Holiday parcel not available",
                },
              ].map(({ Icon, title, info, sub }) => (
                <div
                  key={title}
                  className="flex gap-4 py-5 border-b border-[var(--border)] last:border-0"
                >
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-[var(--text-primary)] text-sm">
                      {title}
                    </p>
                    {title === "Email" ? (
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-[var(--text-secondary)] text-sm font-body hover:text-gold transition-colors"
                      >
                        {info}
                      </a>
                    ) : (
                      <p className="text-[var(--text-secondary)] text-sm font-body">
                        {info}
                      </p>
                    )}
                    <p className="text-[var(--text-muted)] text-xs font-body">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <div className="card-luxury p-12 text-center">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-3">
                  Message Sent
                </h3>
                <p className="text-[var(--text-muted)] font-body">
                  Thank you for reaching out. We&apos;ll be in touch within 24
                  hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-luxury p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] font-body mb-2">
                      Name *
                    </label>
                    <input
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="input-luxury"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] font-body mb-2">
                      Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="input-luxury"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] font-body mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="input-luxury"
                    disabled={loading}
                  >
                    <option value="">Select a topic...</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="return">Return / Exchange</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] font-body mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="input-luxury resize-none"
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  <Send size={14} />
                  <span>{loading ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
