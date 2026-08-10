import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";

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

const siteUrl = process.env.NEXTAUTH_URL || "https://kyawzawhein.com";

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
    canonical: "/"
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`dark ${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">{children}</main>
      </body>
    </html>
  );
}
