import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationBar from "@/features/navigation/components/navbar";
import { TRPCReactProvider } from "@/trpc/react";

export function favicon() {
	return new Date().getMonth() === 5 ? "/icon-pride.png" : "/favicon.ico";
}

const BASE_URL = new URL("https://recap.games");
const currentYear = new Date().getFullYear();
const BASE_URL_STR = "https://recap.games";

export const metadata: Metadata = {
	metadataBase: BASE_URL,

	title: {
		default: `Game Trailers Recapped: ${currentYear}'s Latest & Hottest`,
		template: "%s | Game Trailers Recapped",
	},

	description: `Discover ${currentYear}'s top game trailers, gameplay, and reveals. Your hub for Summer Game Fest & all major gaming events. Watch now!`,

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
		`upcoming games ${currentYear}`,
		`best game trailers ${currentYear}`,
	],

	authors: [{ name: "Tommy Danks", url: "https://tdanks.com" }],
	creator: "Tommy Danks",
	publisher: "Game Trailers Recapped",

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
		shortcut: favicon(),
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
		title: `Game Trailers Recapped: ${currentYear}'s Top Trailers & News`,
		description: `Explore ${currentYear}'s biggest game trailers, gameplay demos, and exclusive reveals. Your ultimate source for gaming events like Summer Game Fest.`,
		siteName: "Game Trailers Recapped",
		images: [
			{
				url: new URL("/social-large.webp", BASE_URL).toString(),
				width: 1200,
				height: 630,
				alt: `Game Trailers Recapped - ${currentYear} Gaming Highlights`,
			},
		],
	},

	twitter: {
		card: "summary_large_image",
		site: "@gamesrecapped",
		creator: "@tommydanks", // Corrected
		title: `Best Game Trailers of ${currentYear} | Game Trailers Recapped`,
		description: `Don't miss out! Get the latest ${currentYear} game trailers, demos, and announcements from Summer Game Fest & more. #GameTrailers #${currentYear}Games`,
		images: [new URL("/social-large.webp", BASE_URL).toString()],
	},

	appleWebApp: {
		title: "Game Trailers Recapped",
		statusBarStyle: "default",
		capable: true,
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
				{/** biome-ignore lint/nursery/useUniqueElementIds: Fine here */}
				<Script
					async
					strategy="afterInteractive"
					src={
						"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6066620838335611"
					}
					crossOrigin="anonymous"
					id="adsense-script"
				/>

				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<script type="application/ld+json">
					{JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: "Game Trailers Recapped",
						url: BASE_URL_STR,
						potentialAction: {
							"@type": "SearchAction",
							target: {
								"@type": "EntryPoint",
								urlTemplate: `${BASE_URL_STR}/search?q={search_term_string}`,
							},
							"query-input": "required name=search_term_string",
						},
						publisher: {
							"@type": "Organization",
							name: "Game Trailers Recapped",
							logo: {
								"@type": "ImageObject",
								url: new URL(favicon(), BASE_URL_STR).toString(),
							},
						},
						author: {
							"@type": "Person",
							name: "Tommy Danks",
							url: "https://tdanks.com",
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
