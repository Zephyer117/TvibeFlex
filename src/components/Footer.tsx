import Link from "next/link";
import { Instagram, Twitter, Facebook, type LucideIcon } from "lucide-react";
import type { FooterSettings, FooterSocialLink, SocialPlatform } from "@/types";

const SOCIAL_ICONS: Record<SocialPlatform, LucideIcon> = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
};

export default function Footer({ settings }: { settings: FooterSettings }) {
  const {
    brandHighlight,
    brandName,
    tagline,
    shopLinks = [],
    infoLinks = [],
    socialLinks = [],
    copyrightText = "© {year} TVibeFlex. All rights reserved.",
    creditLine = "",
  } = settings;

  const year = new Date().getFullYear();
  const copyright = copyrightText.replace("{year}", String(year));

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Link href="/" className="font-display text-2xl font-semibold mb-4 inline-block">
            <span className="gold-text">{brandHighlight}</span>
            <span className="text-[var(--text-primary)]"> {brandName}</span>
          </Link>
          {tagline && (
            <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs font-body">
              {tagline}
            </p>
          )}
          {socialLinks.length > 0 && (
            <div className="flex gap-4 mt-6">
              {socialLinks.map((link: FooterSocialLink) => {
                const Icon = SOCIAL_ICONS[link.platform];
                if (!Icon || !link.url) return null;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-muted)] hover:text-gold transition-colors"
                    aria-label={link.platform}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {shopLinks.length > 0 && (
          <div>
            <h4 className="text-xs tracking-widest uppercase font-semibold text-[var(--text-primary)] mb-5">
              Shop
            </h4>
            <ul className="space-y-3">
              {shopLinks.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition-colors font-body"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {infoLinks.length > 0 && (
          <div>
            <h4 className="text-xs tracking-widest uppercase font-semibold text-[var(--text-primary)] mb-5">
              Info
            </h4>
            <ul className="space-y-3">
              {infoLinks.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition-colors font-body"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-[var(--border)] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[var(--text-muted)] text-xs font-body">{copyright}</p>
          {creditLine && (
            <p className="text-[var(--text-muted)] text-xs font-body">{creditLine}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
