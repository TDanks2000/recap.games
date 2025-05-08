interface DateProps {
	date: string | Date;
	className?: string;
}

export function DateComponent({ date, className }: DateProps) {
	const dt: Date = typeof date === "string" ? new Date(date) : date;
	return (
		<time className={className} dateTime={dt.toISOString()}>
			{dt.toLocaleDateString(undefined, {
				year: "numeric",
				month: "long",
				day: "numeric",
			})}
		</time>
	);
}
