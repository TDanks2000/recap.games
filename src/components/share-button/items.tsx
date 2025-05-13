import {
	FaFacebookF,
	FaLinkedinIn,
	FaRedditAlien,
	FaTelegramPlane,
} from "react-icons/fa";
import { SiBluesky, SiX } from "react-icons/si";
import type { ShareLinkProps } from "./shareLink";

export const shareButtonItems = (
	encodedUrl: string,
	encodedTitle: string,
): Array<ShareLinkProps> => [
	{
		Icon: FaRedditAlien,
		title: "Reddit",
		href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
	},
	{
		Icon: SiX,
		title: "Twitter / X",
		href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`,
	},
	{
		Icon: SiBluesky,
		title: "Bluesky",
		href: `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`,
	},
	{
		Icon: FaFacebookF,
		title: "Facebook",
		href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
	},
	{
		Icon: FaLinkedinIn,
		title: "LinkedIn",
		href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
	},
	{
		Icon: FaTelegramPlane,
		title: "Telegram",
		href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
	},
];
