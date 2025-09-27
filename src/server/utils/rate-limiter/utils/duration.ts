export const parseDuration = (s: string): number => {
	const trimmed = s.trim().toLowerCase();
	const match = /^(\d+)\s*(ms|s|m|h|d)?$/.exec(trimmed);
	if (!match) throw new Error("invalid duration");
	const v = Number(match[1]);
	const unit = match[2] ?? "ms";
	switch (unit) {
		case "ms":
			return v;
		case "s":
			return v * 1000;
		case "m":
			return v * 60_000;
		case "h":
			return v * 3_600_000;
		case "d":
			return v * 86_400_000;
		default:
			throw new Error("invalid duration unit");
	}
};
