export type ContentSection = {
	title: string;
	description: string;
	href: string;
	icon?: React.ReactNode;
	count?: number;
};

export type Stat = {
	value: string;
	label: string;
	change: string;
	trend: "up" | "down" | "neutral";
	timeframe?: string;
};

export type StatSection = {
	title: string;
	description: string;
	href: string;
	icon: React.ReactNode;
};

export type QuickAction = {
	title: string;
	href: string;
	priority?: "high" | "medium" | "low";
	icon?: React.ReactNode;
	badge?: string | number;
};
