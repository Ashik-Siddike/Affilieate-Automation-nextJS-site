import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://whitlogic.online"),
  title: {
    default: "Whit Logic — Best Budget Tactical & Sports Watches",
    template: "%s | Whit Logic",
  },
  description:
    "Expert reviews of the best budget tactical and sports watches. Discover premium durability from SKMEI, CURREN, and more — all under $50.",
  keywords: [
    "budget tactical watch", "sports watch review", "best watch under 50",
    "SKMEI review", "CURREN watch", "affordable military watch",
  ],
  authors: [{ name: "Whit Logic Editorial Team" }],
  creator: "Whit Logic",
  publisher: "Whit Logic",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://whitlogic.online",
    siteName: "Whit Logic",
    title: "Whit Logic — Best Budget Tactical & Sports Watches",
    description:
      "Expert reviews of the best budget tactical and sports watches. Save money without sacrificing quality.",
    images: [
      {
        url: "https://whitlogic.online/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Whit Logic — Budget Tactical & Sports Watches",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Whit Logic — Best Budget Tactical & Sports Watches",
    description: "Expert reviews of budget tactical and sports watches.",
    images: ["https://whitlogic.online/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: "https://whitlogic.online" },
  verification: {
    // google: "YOUR_GOOGLE_SEARCH_CONSOLE_ID",
  },
};

// Global Website JSON-LD Schema
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Whit Logic",
  url: "https://whitlogic.online",
  description: "Expert reviews of budget tactical and sports watches.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://whitlogic.online/?s={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Whit Logic",
  url: "https://whitlogic.online",
  logo: "https://whitlogic.online/logo.png",
  sameAs: [
    "https://www.facebook.com/whitlogic",
    "https://www.instagram.com/whitlogic",
    "https://www.pinterest.com/whitlogic",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <GoogleAnalytics gaId="G-0KVLY4SLLB" />
      </body>
    </html>
  );
}
