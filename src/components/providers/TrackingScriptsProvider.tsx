/** biome-ignore-all lint/nursery/useUniqueElementIds: fine here */
import Script from "next/script";

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const isProd = process.env.NODE_ENV === "production";

if (!isProd) {
	if (!adsenseClientId) {
		console.warn(
			"NEXT_PUBLIC_ADSENSE_CLIENT_ID is not set in environment variables. The AdSense script will not be loaded.",
		);
	}
	if (!umamiWebsiteId) {
		console.warn(
			"NEXT_PUBLIC_UMAMI_WEBSITE_ID is not set in environment variables. The Umami script will not be loaded.",
		);
	}
}

const TrackingScriptsProvider = () => {
	if (!isProd) return null;

	return (
		<>
			{/* Google AdSense Script */}
			{adsenseClientId && (
				<Script
					id="adsense-script"
					async
					strategy="afterInteractive"
					src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
					crossOrigin="anonymous"
				/>
			)}

			{/* Umami Analytics Script */}
			{umamiWebsiteId && (
				<Script
					id="umami-analytics-script"
					src="https://cloud.umami.is/script.js"
					data-website-id={umamiWebsiteId}
					strategy="afterInteractive"
					defer
				/>
			)}
		</>
	);
};

export default TrackingScriptsProvider;
