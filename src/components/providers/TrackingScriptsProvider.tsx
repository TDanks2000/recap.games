/** biome-ignore-all lint/nursery/useUniqueElementIds: fine here */
import Script from "next/script";

const TrackingScriptsProvider = () => {
	const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
	const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

	const logMissingIdWarning = (idName: string) => {
		if (process.env.NODE_ENV === "development") {
			console.warn(
				`${idName} is not set in environment variables. The corresponding script will not be loaded.`,
			);
		}
	};

	return (
		<>
			{/* Google AdSense Script */}
			{adsenseClientId ? (
				<Script
					id="adsense-script"
					async
					strategy="afterInteractive"
					src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
					crossOrigin="anonymous"
				/>
			) : (
				!adsenseClientId && logMissingIdWarning("NEXT_PUBLIC_ADSENSE_CLIENT_ID")
			)}

			{/* Umami Analytics Script */}
			{umamiWebsiteId ? (
				<Script
					id="umami-analytics-script"
					src="https://cloud.umami.is/script.js"
					data-website-id={umamiWebsiteId}
					strategy="afterInteractive"
					defer
				/>
			) : (
				!umamiWebsiteId && logMissingIdWarning("NEXT_PUBLIC_UMAMI_WEBSITE_ID")
			)}
		</>
	);
};

export default TrackingScriptsProvider;
