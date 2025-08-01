import { FaTwitter } from "react-icons/fa";
import { SiBluesky, SiKofi } from "react-icons/si";

export const SOCIAL_LINKS = [
	{
		href: "https://twitter.com/gamesrecapped",
		label: "Twitter",
		icon: FaTwitter,
		type: "social",
	},
	{
		href: "https://bsky.app/profile/recap.games",
		label: "Bluesky",
		icon: SiBluesky,
		type: "social",
	},
	{
		href: "https://ko-fi.com/tdanks2000",
		label: "Ko-Fi",
		icon: SiKofi,
		type: "donate",
	},
];
