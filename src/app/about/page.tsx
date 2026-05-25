import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <section className="relative py-28 px-6 overflow-hidden bg-[var(--bg-secondary)] border-b border-[var(--border)]">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--gold) 1px, transparent 0)", backgroundSize: "48px 48px" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-[var(--text-primary)] leading-[0.95] mb-6">
            Where Craft Meets{" "}
            <span className="italic gold-text">Obsession</span>
          </h1>
          <p className="text-[var(--text-secondary)] font-body text-lg leading-relaxed max-w-2xl mx-auto">
            Luxe Store was born from a simple belief: the things we surround ourselves with should be extraordinary.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="aspect-[4/5] bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center">
              <span className="font-display text-8xl text-gold/20">L</span>
            </div>
          </div>
          <div>
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-5">Since 2009</p>
            <h2 className="section-title mb-6">Built on Uncompromising Standards</h2>
            <div className="space-y-4 text-[var(--text-secondary)] font-body leading-relaxed">
              <p>
                What started as a passion project in a small studio has grown into a destination for those who demand the finest. Every product in our collection is personally selected, tested, and vetted.
              </p>
              <p>
                We work directly with makers, artisans, and brands who share our obsession with quality — building long-term relationships that ensure authenticity in every transaction.
              </p>
              <p>
                Our team travels the world seeking out products that combine exceptional craftsmanship with timeless design. We believe luxury is not about price alone, but about intention, quality, and meaning.
              </p>
            </div>
            <Link href="/shop" className="btn-gold inline-flex items-center gap-3 mt-8">
              <span>Explore the Collection</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-[var(--bg-secondary)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">What Drives Us</p>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Authenticity", desc: "Every product is genuine, every story is true. We never compromise on integrity." },
              { num: "02", title: "Craftsmanship", desc: "We celebrate makers who pour their expertise into every detail, no matter how small." },
              { num: "03", title: "Longevity", desc: "We champion objects built to last — to accumulate meaning rather than be discarded." },
            ].map(({ num, title, desc }) => (
              <div key={title} className="card-luxury p-8">
                <p className="font-display text-4xl gold-text font-semibold mb-4">{num}</p>
                <h3 className="font-body font-semibold text-[var(--text-primary)] text-lg mb-3 tracking-wide">{title}</h3>
                <p className="text-[var(--text-muted)] font-body text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">The People</p>
          <h2 className="section-title mb-14">Meet the Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Elena Marchetti", role: "Founder & Curator" },
              { name: "James Okafor", role: "Head of Sourcing" },
              { name: "Mei Lin", role: "Creative Director" },
              { name: "Thomas Berger", role: "Client Experience" },
            ].map(({ name, role }) => (
              <div key={name} className="text-center">
                <div className="aspect-square bg-[var(--bg-secondary)] border border-[var(--border)] mb-4 flex items-center justify-center">
                  <span className="font-display text-4xl text-gold/30">{name[0]}</span>
                </div>
                <h3 className="font-body font-semibold text-[var(--text-primary)] text-sm">{name}</h3>
                <p className="text-[var(--text-muted)] text-xs font-body mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
