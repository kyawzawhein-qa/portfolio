import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import VisitorRecorder from "@/components/VisitorRecorder";
import { getUniqueVisitorCount } from "@/lib/visitors";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kyaw Zaw Hein | QA Engineer",
  description: "Experienced QA Engineer specializing in test automation, FinTech, and quality engineering.",
  keywords: ["QA Engineer", "Test Automation", "FinTech", "Playwright", "Selenium", "Quality Assurance"],
  authors: [{ name: "Kyaw Zaw Hein" }],
  creator: "Kyaw Zaw Hein",
  publisher: "Kyaw Zaw Hein",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Kyaw Zaw Hein — Blog RSS" }]
    }
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const visitorCount = await getUniqueVisitorCount();

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          <SiteHeader visitorCount={visitorCount} />
          {children}
        </main>
        <VisitorRecorder />
      </body>
    </html>
  );
}

