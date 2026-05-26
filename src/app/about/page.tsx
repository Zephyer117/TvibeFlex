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
          <p className="text-gold text-lg tracking-[0.4em] uppercase font-semibold mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-[var(--text-primary)] leading-[0.95] mb-6">
            Where Fashion Meets{" "}
            <span className="italic gold-text">Obsession</span>
          </h1>
          <p className="text-[var(--text-secondary)] font-body text-lg leading-relaxed max-w-2xl mx-auto">
          At TvibeFlex, we create premium-quality clothing designed for people who value style, comfort, and individuality. 
          <br /> 
          <br /> 
          Specializing in high-quality DFT printed apparel and print-on-demand fashion, we focus on delivering modern designs with exceptional fabric quality and lasting comfort.
          <br /> 
          <br /> 
          Every piece is crafted to combine creativity, durability, and premium finishing 
          making everyday wear feel unique and expressive.
          <br /> 
          <br /> 
          Whether it's bold statement graphics or clean minimal aesthetics, TvibeFlex is built to bring quality and personality into every outfit. 
          <br />    
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="aspect-[4/5] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)]">
              {/* File: public/images/about-1.jpg → use /images/about-1.jpg */}
              <img
                src="/images/asset-1.png"
                alt="TvibeFlex apparel"
                className="h-full w-full object-contain p-7"
              />
            </div>
          </div>
          <div>
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-5"></p>
            <h2 className="section-title mb-6">Crafted for the Premium Few</h2>
            <div className="space-y-4 text-[var(--text-secondary)] font-body leading-relaxed">
            <p>
              At TvibeFlex, we believe premium clothing should do more than simply look good it should make you feel confident, comfortable, and effortlessly distinct. What started as a passion for elevated streetwear has grown into a brand dedicated to people who value quality, individuality, and timeless style.
            </p>

            <p>
              Every piece we create is designed with our customers in mind. From carefully selected premium fabrics to high-definition DFT printing and precision finishing, each product is crafted to deliver a luxury feel, lasting comfort, and standout detail in every wear.
            </p>

            <p>
              We are committed to creating more than apparel we create experiences. Whether you prefer bold statement designs or refined minimal aesthetics, TvibeFlex is built to help you express yourself with confidence while enjoying the quality and attention to detail you truly deserve.
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
            <p className="text-gold text-lg tracking-[0.4em] uppercase font-semibold mb-3">What Drives Us</p>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
  { 
    num: "01", 
    title: "Authenticity", 
    desc: "Every piece we deliver is rooted in genuine craftsmanship and honest design. For us, integrity isn’t a promise it’s the standard behind everything we create." 
  },
  { 
    num: "02", 
    title: "Craftsmanship", 
    desc: "We design and create every detail in-house with precision and intent, ensuring each product reflects uncompromised quality and refined execution." 
  },
  { 
    num: "03", 
    title: "Longevity", 
    desc: "We design with purpose creating apparel meant to last, evolve with you, and hold meaning beyond trends or seasons." 
  },
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
              { name: "Tahir Ali Sardar", role: "Founder & Designer", image: "/images/tahir.jpg" },
              { name: "Mostofa Shahriar", role: "Designer & Planner", image: "/images/mostofa.jpg" },
              { name: "Rex Shuvo", role: "Creative Director & Marketing", image: "/images/rex.jpg" },
              { name: "Sazzadur Rahman Ohe", role: "Quality Control & Sales Manager", image: "/images/sazzadur.jpg" },
            ].map(({ name, role, image }) => (
              <div key={name} className="text-center">
                <div className="aspect-square overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] mb-4">
                  <img src={image} alt={name} className="h-full w-full object-cover" />
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
