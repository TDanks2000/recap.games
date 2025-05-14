import type { FaqItem } from "@/features/faq/components/faq-accordion";

export const faqItems: FaqItem[] = [
	{
		id: "what-is-recap-games",
		question: "What is recap.games?",
		answer: (
			<div className="space-y-2">
				<p>
					<strong>recap.games</strong> is your go-to destination for staying
					up-to-date with announcements from major game showcases like Summer
					Game Fest and other publisher streams throughout the year.
				</p>
				<p>
					You’ll find a curated, no-nonsense collection of new game
					announcements, trailers, and reveals, all organized in one place so
					you don’t have to chase news across social media and random press
					sites.
				</p>
			</div>
		),
	},
	{
		id: "how-often-is-it-updated",
		question: "How often is recap.games updated?",
		answer: (
			<p>
				recap.games is updated live during major gaming showcases and events.
				Between those, it’s occasionally updated with surprise reveals and new
				trailers as they happen.
			</p>
		),
	},
	{
		id: "can-i-request-a-game",
		question: "Can I request a game to be added?",
		answer: (
			<p>
				Absolutely! If you spot a game announcement or trailer that isn’t on the
				site, just tag me on{" "}
				<a
					href="https://x.com/gamesrecapped"
					target="_blank"
					rel="noopener noreferrer"
					className="font-medium underline"
				>
					Twitter (@gamesrecapped)
				</a>{" "}
				and I’ll do my best to get it added.
			</p>
		),
	},
	{
		id: "how-do-i-know-what-event-a-game-is-from",
		question: "How do I know which event a game announcement is from?",
		answer: (
			<p>
				Every announcement on recap.games includes a label indicating which
				event it was revealed at, like Ubisoft Forward, Xbox Games Showcase, and
				more. You can also click on the event name to go directly to the stream,
				with the start time and an estimate of the end time based on previous
				years' events.
			</p>
		),
	},
	{
		id: "who-runs-this-site",
		question: "Who runs recap.games?",
		answer: (
			<p>
				recap.games is a solo project, built and maintained by one person who’s
				been following game showcases since the start of E3.
			</p>
		),
	},
	{
		id: "can-i-support-this-project",
		question: "Can I support recap.games somehow?",
		answer: (
			<div className="space-y-2">
				<p>
					The best way to support recap.games is to spread the word! Share the
					site with your friends and follow along on social media.
				</p>
				<p>
					If you’d like to fuel me through those multi-hour event streams or
					late-night updates, you can{" "}
					<a
						href="https://ko-fi.com/tdanks2000"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium underline"
					>
						buy me a coffee on Ko-fi
					</a>
					. Every bit of support means a lot!
				</p>
			</div>
		),
	},
	{
		id: "what-happened-to-e3",
		question: "What happened to E3?",
		answer: (
			<div className="space-y-2">
				<p>
					The Electronic Entertainment Expo (E3), once the premier event for the
					gaming industry, was officially canceled in 2023. The Entertainment
					Software Association (ESA) and event organizer ReedPop announced the
					decision, citing a lack of sustained interest and participation from
					major publishers as key factors.
				</p>
				<p>
					In the absence of E3, events like Summer Game Fest, hosted by Geoff
					Keighley, have emerged as prominent platforms for game announcements
					and showcases. These events, along with others like Xbox Games
					Showcase and Ubisoft Forward, now fill the void left by E3, offering
					both in-person and digital experiences for gaming enthusiasts
					worldwide.
				</p>
			</div>
		),
	},
	{
		id: "why-should-i-visit-recap-games",
		question: "Why should I visit recap.games?",
		answer: (
			<div className="space-y-2">
				<p>
					recap.games is your one-stop destination for all the latest game
					trailers from major gaming events like Summer Game Fest and more. We
					collect and organize the most exciting and important game trailers in
					one place so you don’t have to hunt them down across multiple sites
					and social media.
				</p>
				<p>
					Whether you missed an event or just want to rewatch the latest
					reveals, recap.games makes it easy to catch up on all the trailers you
					care about.
				</p>
			</div>
		),
	},
	{
		id: "where-are-the-old-games",
		question: "Where are all the old games?",
		answer: (
			<div className="space-y-2">
				<p>
					The games showcased prior to 2025 are available at{" "}
					<a
						href="https://old.recap.games"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium underline"
					>
						old.recap.games
					</a>
					. This new version of recap.games will only feature games from 2025
					and beyond, as we focus on bringing you the most up-to-date
					announcements, trailers, and gameplay from the latest showcases and
					events.
				</p>
			</div>
		),
	},
	{
		id: "why-are-there-ads-on-recap-games",
		question: "Why are there ads on recap.games?",
		answer: (
			<div className="space-y-2">
				<p>
					recap.games is a free service, and ads help keep it running. As server
					costs continue to rise, ads are essential for covering hosting,
					development, and content updates.
				</p>
				<p>
					We strive to keep ads non-intrusive, and your support through viewing
					them allows us to keep the site running smoothly and affordably.
				</p>
			</div>
		),
	},
];
