import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationBar from "@/features/navigation/components/navbar";
import { TRPCReactProvider } from "@/trpc/react";

// Define your canonical base URL here
const BASE_URL = new URL("https://recap.games");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: BASE_URL,
  title: {
    default: "Games Recapped",
    template: "%s | Games Recapped",
  },
  description:
    "Discover the ultimate roundup of Summer Game Fest and beyond, featuring trailers, demos, gameplay highlights, and livestreams. Stay ahead in the gaming universe with our comprehensive recap, bringing you the latest updates, insights, and reveals from the gaming industry's hottest events.",
  keywords: [
    "summer game fest",
    "gaming",
    "trailers",
    "demos",
    "gameplay",
    "livestreams",
    "announcements",
    "gaming industry",
  ],
  authors: [{ name: "Tommy Danks" }],
  creator: "Tommy Danks",
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
  // Icons & Manifest
  icons: {
    icon: favicon(),
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL.toString(),
    title: "Games Recapped",
    description:
      "Discover trailers, demos, gameplay highlights, livestreams, and exclusive announcements from Summer Game Fest and beyond.",
    siteName: "Games Recapped",
    images: [
      {
        url: "/social-large.webp",
        width: 1200,
        height: 630,
        alt: "Games Recapped Social Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Games Recap - Your Source for Gaming News",
    description:
      "Stay ahead in the gaming universe with trailers, demos, gameplay highlights, livestreams, and exclusive announcements.",
    creator: "@YourTwitterHandle",
    images: ["/social-large.webp"],
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="canonical" href={BASE_URL.toString()} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Games Recapped",
            url: BASE_URL.toString(),
            potentialAction: {
              "@type": "SearchAction",
              target: `${BASE_URL.toString()}/search?query={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
      </head>
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <NavigationBar />
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

function favicon() {
  return new Date().getMonth() === 5 ? "/icon-pride.png" : "/favicon.ico";
}
