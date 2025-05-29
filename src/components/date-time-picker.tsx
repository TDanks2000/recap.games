"use client";

import { format, isValid, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface DateTimePickerProps {
	value?: Date;
	defaultValue?: Date;
	onValueChange?: (date: Date | undefined) => void;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}

export function DateTimePicker({
	value,
	defaultValue,
	onValueChange,
	open,
	defaultOpen,
	onOpenChange,
	placeholder = "MM/dd/yyyy hh:mm aa", // Consistent placeholder format
	className,
	disabled,
}: DateTimePickerProps) {
	const isDateControlled = value !== undefined;
	const [internalDate, setInternalDate] = React.useState<Date | undefined>(
		defaultValue,
	);
	// Use controlled value if available, otherwise internal state
	const date = isDateControlled ? value : internalDate;

	const [inputValue, setInputValue] = React.useState(
		date ? format(date, "MM/dd/yyyy hh:mm aa") : "",
	);

	const isOpenControlled = open !== undefined;
	const [internalOpen, setInternalOpen] = React.useState<boolean>(
		Boolean(defaultOpen),
	);
	const isOpenState = isOpenControlled ? open : internalOpen;

	const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12 for display

	// Function to update the date state and call onValueChange
	// This is the single source of truth for setting the Date object
	function updateDate(newDate: Date | undefined) {
		if (!isDateControlled) {
			setInternalDate(newDate);
		}
		onValueChange?.(newDate);
		// Format and update the input value to reflect the current date state
		setInputValue(newDate ? format(newDate, "MM/dd/yyyy hh:mm aa") : "");
	}

	// Function to update the popover open state
	function updateOpen(nextOpen: boolean) {
		if (disabled) return;
		if (!isOpenControlled) {
			setInternalOpen(nextOpen);
		}
		onOpenChange?.(nextOpen);

		// When the popover closes, if there's text in the input but no valid date selected,
		// try to parse the input value one last time.
		if (!nextOpen) {
			// Only attempt parsing if inputValue is not empty
			if (inputValue) {
				const parsed = parse(inputValue, "MM/dd/yyyy hh:mm aa", new Date());
				if (isValid(parsed)) {
					// If the parsed date is different from the current date state, update it
					if (!date || parsed.getTime() !== date.getTime()) {
						updateDate(parsed);
					}
				} else if (date) {
					// If input is invalid but there was a previous date, clear it
					updateDate(undefined);
				}
			} else if (date) {
				// If input is empty but there was a previous date, clear it
				updateDate(undefined);
			}
		}
	}

	// Handler for calendar date selection
	const handleDateSelect = (selected: Date | undefined) => {
		if (!selected || disabled) return;

		// Create a new Date object to avoid direct mutation of 'date' state
		const nextDate = new Date(selected);

		// If a date is already set, preserve its time components
		if (date) {
			nextDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
		} else {
			// If no date is set, default to current time for initial selection
			// or midnight if preferring a clean start
			const now = new Date();
			nextDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0);
		}
		updateDate(nextDate);
	};

	// Handler for time changes (hour, minute, ampm) from scroll areas
	const handleTimeChange = (
		type: "hour" | "minute" | "ampm",
		valueStr: string,
	) => {
		// If no date is currently selected, create one (e.g., today's date)
		// before applying time changes.
		if (disabled) return;
		const baseDate = date ? new Date(date) : new Date(); // Use existing date or today
		const num = Number.parseInt(valueStr);

		if (type === "hour") {
			// Convert 1-12 to 24-hour format correctly
			const currentHours = baseDate.getHours();
			let newHours = num;
			if (currentHours >= 12 && num < 12) {
				// PM case: if current is PM (12-23) and selected is AM (1-11), shift to PM
				newHours = num === 12 ? 12 : num + 12;
			} else if (currentHours < 12 && num === 12) {
				// AM case: if current is AM (0-11) and selected is 12 (AM), it's 0 (midnight)
				newHours = 0;
			} else if (
				currentHours < 12 &&
				num < 12 &&
				currentHours === 0 &&
				num !== 12
			) {
				// Special handling for 12 AM (0 hours) when selecting other AM hours
				newHours = num;
			} else if (num === 12 && currentHours >= 12) {
				// Special handling for 12 PM (12 hours) when current is PM
				newHours = 12;
			}
			baseDate.setHours(newHours);
		} else if (type === "minute") {
			baseDate.setMinutes(num);
		} else if (type === "ampm") {
			const hrs = baseDate.getHours();
			if (valueStr === "PM" && hrs < 12) baseDate.setHours(hrs + 12);
			if (valueStr === "AM" && hrs >= 12) baseDate.setHours(hrs - 12);
		}
		updateDate(baseDate);
	};

	// Handler for direct input field changes
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue); // Update input value immediately for typing experience

		// Attempt to parse on every change, but only update the actual date state if valid
		const parsed = parse(newValue, "MM/dd/yyyy hh:mm aa", new Date());
		if (isValid(parsed)) {
			updateDate(parsed);
		} else {
			// If input becomes invalid, clear the date state
			updateDate(undefined);
		}
	};

	// Effect to keep inputValue in sync with 'date' prop changes (e.g., when controlled externally)
	React.useEffect(() => {
		setInputValue(date ? format(date, "MM/dd/yyyy hh:mm aa") : "");
	}, [date]);

	return (
		<div className={cn("flex w-full items-center", className)}>
			<Input
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				placeholder={placeholder}
				className={cn(
					"w-full rounded-r-none", // Remove right border radius
					!date && "text-muted-foreground",
				)}
				disabled={disabled}
			/>
			<Popover open={isOpenState} onOpenChange={updateOpen}>
				<PopoverTrigger asChild disabled={disabled}>
					<Button
						variant="outline" // Use outline variant for consistency
						className={cn(
							"rounded-l-none", // Remove left border radius, match input height
							!date && "text-muted-foreground",
						)}
						disabled={disabled}
					>
						<CalendarIcon className="h-4 w-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" hidden={disabled}>
					<div className="sm:flex">
						<Calendar
							mode="single"
							selected={date}
							onSelect={handleDateSelect}
							initialFocus
							disabled={disabled}
						/>
						<div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
							<ScrollArea className="w-64 sm:w-auto">
								<div className="flex p-2 sm:flex-col">
									{hours
										.slice()
										.reverse() // Display 12, 11, ..., 1 for hours
										.map((hr) => {
											// Determine actual hour (0-23) for comparison
											let displayHour = hr;
											if (date) {
												const currentHour24 = date.getHours();
												if (currentHour24 >= 12 && hr !== 12) {
													// PM hours (1-11)
													displayHour = hr + 12;
												} else if (currentHour24 < 12 && hr === 12) {
													// 12 AM
													displayHour = 0;
												} else if (currentHour24 >= 12 && hr === 12) {
													// 12 PM
													displayHour = 12;
												}
											}

											return (
												<Button
													key={hr}
													size="icon"
													variant={
														date && date.getHours() === displayHour
															? "default"
															: "ghost"
													}
													className="aspect-square shrink-0 sm:w-full"
													onClick={() =>
														handleTimeChange("hour", hr.toString())
													}
													disabled={disabled}
												>
													{hr}
												</Button>
											);
										})}
								</div>
								<ScrollBar orientation="horizontal" className="sm:hidden" />
							</ScrollArea>

							<ScrollArea className="w-64 sm:w-auto">
								<div className="flex p-2 sm:flex-col">
									{Array.from({ length: 12 }, (_, i) => i * 5).map((min) => (
										<Button
											key={min}
											size="icon"
											variant={
												date && date.getMinutes() === min ? "default" : "ghost"
											}
											className="aspect-square shrink-0 sm:w-full"
											onClick={() => handleTimeChange("minute", min.toString())}
											disabled={disabled}
										>
											{min < 10 ? `0${min}` : min}{" "}
											{/* Format minutes with leading zero */}
										</Button>
									))}
								</div>
								<ScrollBar orientation="horizontal" className="sm:hidden" />
							</ScrollArea>

							<ScrollArea>
								<div className="flex p-2 sm:flex-col">
									{["AM", "PM"].map((ap) => (
										<Button
											key={ap}
											size="icon"
											variant={
												date &&
												((ap === "AM" && date.getHours() < 12) ||
													(ap === "PM" && date.getHours() >= 12))
													? "default"
													: "ghost"
											}
											className="aspect-square shrink-0 sm:w-full"
											onClick={() => handleTimeChange("ampm", ap)}
											disabled={disabled}
										>
											{ap}
										</Button>
									))}
								</div>
							</ScrollArea>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
