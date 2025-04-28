import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationBar from "@/features/navigation/components/navbar";
import { TRPCReactProvider } from "@/trpc/react";

const BASE_URL = new URL("https://recap.games");

export const metadata: Metadata = {
  metadataBase: BASE_URL,
  title: {
    default: "Games Recapped",
    template: "%s | Games Recapped",
  },
  description:
    "Explore the latest game trailers, gameplay demos, and exclusive reveals from Summer Game Fest and other major events. Stay updated with all the exciting video content from the gaming world in one place.",
  keywords: [
    "game trailers",
    "gaming trailers",
    "game announcements",
    "gameplay",
    "game reveals",
    "Summer Game Fest trailers",
    "gaming events",
    "new game trailers",
    "gaming industry",
    "trailers roundup",
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
    title: "Game Trailers Recapped",
    description:
      "Explore the latest trailers, gameplay demos, and exclusive announcements from Summer Game Fest and beyond.",
    siteName: "Game Trailers Recapped",
    images: [
      {
        url: "/social-large.webp",
        width: 1200,
        height: 630,
        alt: "Game Trailers Recapped Social Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Trailers Recapped - Your Source for Gaming Trailers",
    description:
      "Stay updated with the latest trailers, gameplay demos, and gaming news. Discover the hottest new game trailers from major events.",
    creator: "@gamesrecapped",
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
              target: `${BASE_URL.toString()}/?search={search_term_string}`,
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
