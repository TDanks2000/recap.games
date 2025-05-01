import Image from "next/image";
import Link from "next/link";

const LogoLink = () => {
	const logo = new Date().getMonth() === 5 ? "/icon-pride.png" : "/icon.png";

	return (
		<Link
			href="/"
			className="flex items-center gap-2 font-semibold text-lg md:text-base"
		>
			<Image
				src={logo}
				alt="Games Recaped Logo"
				width={50}
				height={50}
				className="object-contain"
			/>
			<span className="sr-only">Games Recaped</span>
		</Link>
	);
};

export default LogoLink;
