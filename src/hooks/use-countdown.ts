import { type Duration, intervalToDuration, isPast, isValid } from "date-fns";

interface TimeLeft {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	isEnded: boolean;
	isValidDate: boolean;
}

type OnUpdateCallback = (timeLeft: TimeLeft) => void;
type OnEndCallback = () => void;
type StopCountdownFunction = () => void;

function createCountdownHook(
	targetDateInput: Date | string | number,
	onUpdate: OnUpdateCallback,
	onEnd?: OnEndCallback,
): StopCountdownFunction {
	let intervalId: ReturnType<typeof setInterval> | null = null;
	const targetDate = new Date(targetDateInput);

	if (!isValid(targetDate)) {
		console.error("Invalid target date provided to createCountdownHook.");
		onUpdate({
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			isEnded: true,
			isValidDate: false,
		});
		return () => {}; // Return a no-op stop function
	}

	const update = (): void => {
		const now = new Date();

		if (isPast(targetDate)) {
			if (intervalId) clearInterval(intervalId);
			intervalId = null;
			onUpdate({
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0,
				isEnded: true,
				isValidDate: true,
			});
			if (onEnd) onEnd();
			return;
		}

		const duration: Duration = intervalToDuration({
			start: now,
			end: targetDate,
		});

		const timeLeft: TimeLeft = {
			days: duration.days || 0,
			hours: duration.hours || 0,
			minutes: duration.minutes || 0,
			seconds: duration.seconds || 0,
			isEnded: false,
			isValidDate: true,
		};

		onUpdate(timeLeft);
	};

	update(); // Initial call
	intervalId = setInterval(update, 1000);

	return () => {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	};
}

export default createCountdownHook;
export type { TimeLeft, OnUpdateCallback, OnEndCallback };
