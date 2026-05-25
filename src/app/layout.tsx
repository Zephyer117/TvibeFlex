import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getFooterSettings,
  DEFAULT_FOOTER_SETTINGS,
} from "@/lib/queries";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "TVibeFlex", template: "%s | TVibeFlex" },
  description: "Premium products curated for the discerning individual.",
  keywords: ["luxury", "ecommerce", "premium", "store"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TVibeFlex",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerSettings =
    (await getFooterSettings().catch(() => null)) ?? DEFAULT_FOOTER_SETTINGS;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable}`}
    >
      <body>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer settings={footerSettings} />
            </div>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "var(--surface)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  fontFamily: "var(--font-dm-sans)",
                },
              }}
            />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
