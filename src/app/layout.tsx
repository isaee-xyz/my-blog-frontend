import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://howtohelp.in"),
  title: {
    default: "HowToHelp - Empowering Youth & Communities",
    template: "%s | HowToHelp",
  },
  description: "Empowering youth and transforming communities through education, civic responsibility, and actionable kindness.",
  alternates: {
    canonical: "https://howtohelp.in",
  },
  openGraph: {
    title: "HowToHelp - Empowering Youth & Communities",
    description: "Empowering youth and transforming communities through education, civic responsibility, and actionable kindness.",
    url: "https://howtohelp.in",
    siteName: "HowToHelp",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "HowToHelp Logo",
      },
    ],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/logo.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "HowToHelp",
  "url": "https://howtohelp.in",
  "logo": "https://howtohelp.in/logo.png",
  "sameAs": [
    "https://twitter.com/howtohelp",
    "https://linkedin.com/company/howtohelp"
  ],
  "description": "Empowering youth and transforming communities through education, civic responsibility, and actionable kindness."
};

import GoogleAnalytics from "../components/GoogleAnalytics";
import Clarity from "../components/Clarity";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""} />
        <Clarity />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
