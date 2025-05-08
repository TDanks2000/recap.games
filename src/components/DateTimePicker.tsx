"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
	placeholder = "MM/DD/YYYY hh:mm aa",
	className,
	disabled,
}: DateTimePickerProps) {
	const isDateControlled = value !== undefined;
	const [internalDate, setInternalDate] = React.useState<Date | undefined>(
		defaultValue,
	);
	const date = isDateControlled ? value : internalDate;

	const isOpenControlled = open !== undefined;
	const [internalOpen, setInternalOpen] = React.useState<boolean>(
		Boolean(defaultOpen),
	);
	const isOpenState = isOpenControlled ? open : internalOpen;

	const hours = Array.from({ length: 12 }, (_, i) => i + 1);

	function updateDate(newDate: Date | undefined) {
		if (!isDateControlled) {
			setInternalDate(newDate);
		}
		onValueChange?.(newDate);
	}

	function updateOpen(nextOpen: boolean) {
		if (disabled) return;
		if (!isOpenControlled) {
			setInternalOpen(nextOpen);
		}
		onOpenChange?.(nextOpen);
	}

	const handleDateSelect = (selected: Date | undefined) => {
		if (!selected || disabled) return;
		const next = date ? new Date(date) : new Date(selected);
		next.setFullYear(
			selected.getFullYear(),
			selected.getMonth(),
			selected.getDate(),
		);
		updateDate(next);
	};

	const handleTimeChange = (
		type: "hour" | "minute" | "ampm",
		valueStr: string,
	) => {
		if (!date || disabled) return;
		const next = new Date(date);
		const num = Number.parseInt(valueStr);
		if (type === "hour") {
			next.setHours((num % 12) + (next.getHours() >= 12 ? 12 : 0));
		} else if (type === "minute") {
			next.setMinutes(num);
		} else if (type === "ampm") {
			const hrs = next.getHours();
			if (valueStr === "PM" && hrs < 12) next.setHours(hrs + 12);
			if (valueStr === "AM" && hrs >= 12) next.setHours(hrs - 12);
		}
		updateDate(next);
	};

	return (
		<Popover open={isOpenState} onOpenChange={updateOpen}>
			<PopoverTrigger asChild disabled={disabled}>
				<Button
					variant="outline"
					disabled={disabled}
					className={cn(
						"w-full justify-start text-left font-normal",
						!date && "text-muted-foreground",
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? (
						format(date, "MM/dd/yyyy hh:mm aa")
					) : (
						<span>{placeholder}</span>
					)}
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
									.reverse()
									.map((hr) => (
										<Button
											key={hr}
											size="icon"
											variant={
												date && date.getHours() % 12 === hr % 12
													? "default"
													: "ghost"
											}
											className="aspect-square shrink-0 sm:w-full"
											onClick={() => handleTimeChange("hour", hr.toString())}
											disabled={disabled}
										>
											{hr}
										</Button>
									))}
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
										{min}
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
	);
}
