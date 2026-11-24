import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import VisitorRecorder from "@/components/VisitorRecorder";
import { getUniqueVisitorCount } from "@/lib/visitors";

export const dynamic = "force-dynamic";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap"
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://kyawzawhein.com";

const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.remove("dark");}else{document.documentElement.classList.add("dark");}}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kyaw Zaw Hein | QA Engineer",
    template: "%s | Kyaw Zaw Hein"
  },
  description:
    "FinTech-focused QA Engineer specializing in Playwright automation, API/SQL validation, and release quality for trading and payment platforms.",
  keywords: ["QA Engineer", "Test Automation", "FinTech", "Playwright", "Selenium", "Quality Assurance"],
  authors: [{ name: "Kyaw Zaw Hein" }],
  creator: "Kyaw Zaw Hein",
  publisher: "Kyaw Zaw Hein",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Kyaw Zaw Hein — Blog RSS" }]
    }
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Kyaw Zaw Hein | QA Engineer",
    description:
      "FinTech-focused QA Engineer specializing in Playwright automation, API/SQL validation, and release quality.",
    siteName: "Kyaw Zaw Hein Portfolio",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyaw Zaw Hein | QA Engineer",
    description:
      "FinTech-focused QA Engineer specializing in Playwright automation, API/SQL validation, and release quality."
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kyaw Zaw Hein",
  jobTitle: "QA Engineer",
  url: siteUrl,
  email: "kyawzaw.hein.qa@gmail.com",
  sameAs: ["https://linkedin.com/in/kyawzawhein", "https://github.com/kyawzawhein"]
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const visitorCount = await getUniqueVisitorCount();

  return (
    <html lang="en" className={`dark ${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background bg-gradient-to-b from-slate-50 via-white to-slate-100 font-sans antialiased dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          <SiteHeader visitorCount={visitorCount} />
          {children}
        </main>
        <VisitorRecorder />
      </body>
    </html>
  );
}