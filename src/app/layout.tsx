import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationBar from "@/features/navigation/components/navbar";
import { TRPCReactProvider } from "@/trpc/react";

const favicon =
  new Date().getMonth() === 5 ? "/icon-pride.png" : "/favicon.ico";

export const metadata: Metadata = {
  title:
    "Games Recapped | Ultimate Summer Game Fest Recap | Trailers, Livestreams & More",
  description:
    "Discover the ultimate roundup of Summer Game Fest and beyond, featuring trailers, demos, gameplay highlights, livestreams, and exclusive announcements. Stay ahead in the gaming universe with our comprehensive recap, bringing you the latest updates, insights, and reveals from the gaming industry's hottest events",
  icons: [{ rel: "icon", url: favicon }],
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
        <meta property="og:title" content="Games Recapped" />
        <meta
          name="keywords"
          content="summer game fest, gaming, trailers, demos, gameplay, livestreams, announcements, gaming industry"
        />
        <meta
          property="og:description"
          content="Discover the ultimate roundup of Summer Game Fest and beyond, featuring trailers, demos, gameplay highlights, livestreams, and exclusive announcements. Stay ahead in the gaming universe with our comprehensive recap, bringing you the latest updates, insights, and reveals from the gaming industry's hottest events."
        />
        <meta property="og:image" content="/social-large.webp" />
        <meta property="og:image:type" content="image/webp" />
        <meta name="author" content="Tommy Danks" />
        <meta name="language" content="English" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Games Recap - Your Source for Gaming News from Summer Game Fest and Beyond"
        />
        <meta
          name="twitter:description"
          content="
          Discover the ultimate roundup of Summer Game Fest and beyond, featuring trailers, demos, gameplay highlights, livestreams, and exclusive announcements. Stay ahead in the gaming universe with our comprehensive recap, bringing you the latest updates, insights, and reveals from the gaming industry's hottest events
          "
        />
        <meta name="twitter:image" content="/social-large.webp" />
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
