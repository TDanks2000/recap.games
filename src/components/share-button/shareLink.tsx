import type { IconType } from "react-icons/lib";
import { Button } from "../ui/button";

export type ShareLinkProps = {
	Icon: IconType;
	title: string;
	href: string;
};

export const ShareLink = (props: ShareLinkProps) => {
	return (
		<Button
			variant="outline"
			size="icon"
			title={props.title}
			asChild
			className="size-11 transition-colors"
		>
			<a
				href={props.href}
				target="_blank"
				rel="noopener noreferrer"
				className="group"
			>
				<props.Icon />
			</a>
		</Button>
	);
};
