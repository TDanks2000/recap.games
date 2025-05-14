import "@/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationBar from "@/features/navigation/components/navbar";
import { TRPCReactProvider } from "@/trpc/react";

const BASE_URL = new URL("https://recap.games");

const currentYear = new Date().getFullYear();

export const metadata: Metadata = {
	metadataBase: BASE_URL,

	title: {
		default: `Game Trailers Recapped - Latest ${currentYear} Trailers`,
		template: "%s | Game Trailers Recapped",
	},

	description: `Watch the hottest ${currentYear} game trailers, exclusive reveals, and gameplay demos from Summer Game Fest and beyond, your one stop hub for gaming video content.`,

	keywords: [
		`${currentYear} game trailers`,
		`Summer Game Fest ${currentYear}`,
		"new gaming trailers",
		"exclusive game reveals",
		"gameplay demos",
		"video game announcements",
		"gaming events coverage",
		"indie game trailers",
		"AAA game trailers",
		"latest game news",
	],

	authors: [{ name: "Tommy Danks", url: "https://example.com/about" }],
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

	alternates: {
		canonical: BASE_URL.toString(),
	},

	openGraph: {
		type: "website",
		locale: "en_US",
		url: BASE_URL.toString(),
		title: `Game Trailers Recapped – Latest ${currentYear} Trailers`,
		description: `Stream ${currentYear}’s top game trailers, gameplay demos, and exclusive reveals from Summer Game Fest and other premier events.`,
		siteName: "Game Trailers Recapped",
		images: [
			{
				url: "/social-large.webp",
				width: 1200,
				height: 630,
				alt: "Game Trailers Recapped Social Preview",
			},
		],
	},

	twitter: {
		card: "summary_large_image",
		title: `Game Trailers Recapped – Your ${currentYear} Trailer Hub`,
		description: `Stay ahead with ${currentYear}’s biggest game trailers, demos, and exclusive announcements from Summer Game Fest and beyond.`,
		creator: "@gamesrecapped",
		images: ["/social-large.webp"],
	},
};

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
			<head>
				<Script
					async
					strategy="afterInteractive"
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6066620838335611"
					crossOrigin="anonymous"
				/>

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
							<main className="min-h-svh">{children}</main>
							<Footer />
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
