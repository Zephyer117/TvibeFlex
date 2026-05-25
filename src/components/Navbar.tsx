"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingBag, Heart, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useCartStore } from "@/context/cartStore";
import { useWishlistStore } from "@/context/wishlistStore";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.totalItems());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = (href: string, mobile = false) =>
    cn(
      mobile
        ? "text-sm tracking-widest uppercase font-body font-medium py-1 transition-colors"
        : "text-xs tracking-widest uppercase font-body font-medium transition-colors duration-200",
      pathname === href || (href !== "/" && pathname.startsWith(href))
        ? "text-gold"
        : mobile
          ? "text-[var(--text-secondary)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
    );

  const navLinks = (
    <>
      {publicLinks.map(({ href, label }) => (
        <Link key={href} href={href} className={linkClass(href)}>
          {label}
        </Link>
      ))}
      <SignedIn>
        <Link href="/account/orders" className={linkClass("/account/orders")}>
          My Orders
        </Link>
      </SignedIn>
    </>
  );

  const mobileNavLinks = (
    <>
      {publicLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setMobileOpen(false)}
          className={linkClass(href, true)}
        >
          {label}
        </Link>
      ))}
      <SignedIn>
        <Link
          href="/account/orders"
          onClick={() => setMobileOpen(false)}
          className={linkClass("/account/orders", true)}
        >
          My Orders
        </Link>
      </SignedIn>
      <Link
        href="/wishlist"
        onClick={() => setMobileOpen(false)}
        className={linkClass("/wishlist", true)}
      >
        Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
      </Link>
      <SignedOut>
        <Link
          href="/sign-in"
          onClick={() => setMobileOpen(false)}
          className={linkClass("/sign-in", true)}
        >
          Sign In
        </Link>
      </SignedOut>
    </>
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-luxury"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold tracking-wider shrink-0">
          <span className="gold-text">TVibe</span>
          <span className="text-[var(--text-primary)]">Flex</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">{navLinks}</nav>

        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-[var(--text-secondary)] hover:text-gold transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}

          <SignedOut>
            <Link
              href="/sign-in"
              className="hidden md:inline-flex text-xs tracking-widest uppercase font-body font-medium text-[var(--text-secondary)] hover:text-gold transition-colors"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <Link
            href="/wishlist"
            className="relative text-[var(--text-secondary)] hover:text-gold transition-colors"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-obsidian text-2xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative text-[var(--text-secondary)] hover:text-gold transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-obsidian text-2xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          <button
            className="md:hidden text-[var(--text-primary)] ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 bg-[var(--bg)] border-t border-[var(--border)]",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="px-6 py-5 flex flex-col gap-4">{mobileNavLinks}</nav>
      </div>
    </header>
  );
}
