import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "./carousel";

type BaseOption = {
	label: string;
	value: string;
	disabled?: boolean;
};

type SelectedBadgeDisplay =
	| "abbreviate"
	| "whole"
	| "first-3-letters"
	| ((label: string) => string);

interface MultiSelectProps<T extends BaseOption> {
	options: T[];
	selected: Array<T["value"]>;
	onChange: (selected: Array<T["value"]>) => void;
	placeholder?: string;
	className?: string;
	maxSelected?: number;
	disabled?: boolean;
	loading?: boolean;
	showCount?: boolean;
	clearable?: boolean;
	showFullSelected?: boolean;
	renderOption?: (option: T, selected: boolean) => React.ReactNode;
	renderSelected?: (option: T) => React.ReactNode;
	emptyState?: React.ReactNode;
	optionsGroupLabel?: string;
	selectedBadgeDisplay?: SelectedBadgeDisplay;
}

function getBadgeLabel(
	label: string,
	display: SelectedBadgeDisplay = "abbreviate",
): string {
	if (typeof display === "function") return display(label);
	if (display === "whole") return label;
	if (display === "first-3-letters") return label.slice(0, 3).toUpperCase();
	// Default: abbreviate
	const words = label.split(" ");
	return words
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

export function MultiSelect<T extends BaseOption>({
	options,
	selected,
	onChange,
	placeholder = "Select options...",
	className,
	maxSelected,
	disabled,
	loading,
	showCount,
	clearable,
	showFullSelected,
	renderOption,
	renderSelected,
	emptyState,
	optionsGroupLabel = "Options",
	selectedBadgeDisplay = "abbreviate",
}: MultiSelectProps<T>) {
	const [open, setOpen] = React.useState(false);
	const [query, setQuery] = React.useState("");

	const toggleSelect = (value: T["value"]) => {
		if (selected.includes(value)) {
			onChange(selected.filter((v) => v !== value));
		} else if (!maxSelected || selected.length < maxSelected) {
			onChange([...selected, value]);
		}
	};

	const handleSelectAll = () => {
		const enabledOptions = options
			.filter((o) => !o.disabled)
			.map((o) => o.value);
		onChange(
			typeof maxSelected === "number"
				? enabledOptions.slice(0, maxSelected)
				: enabledOptions,
		);
	};

	const handleClearAll = () => {
		onChange([]);
	};

	const filteredOptions = options.filter((opt) =>
		opt.label.toLowerCase().includes(query.toLowerCase()),
	);

	// For tooltip
	const selectedLabels = selected
		.map((val) => options.find((o) => o.value === val)?.label || String(val))
		.join(", ");

	// For badges below input
	const selectedOptions = selected
		.map((val) => options.find((o) => o.value === val))
		.filter(Boolean) as T[];

	return (
		<div className={cn("w-full", className)}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						aria-expanded={open}
						className={cn(
							"w-full justify-between",
							disabled && "pointer-events-none opacity-60",
						)}
						disabled={Boolean(disabled)}
						title={selectedLabels}
					>
						<div className="flex w-full flex-wrap items-center gap-1 overflow-hidden">
							{selected.length > 0 ? (
								<>
									{selected.slice(0, 2).map((val) => {
										const option = options.find((o) => o.value === val);
										if (!option) return null;
										return renderSelected ? (
											<span key={String(val)}>{renderSelected(option)}</span>
										) : (
											<Badge key={String(val)} className="px-2 py-0.5 text-xs">
												{getBadgeLabel(option.label, selectedBadgeDisplay)}
											</Badge>
										);
									})}
									{selected.length > 2 && (
										<span
											className="flex items-center pl-2 text-muted-foreground text-xs"
											title={selectedLabels}
										>
											+{selected.length - 2} more
										</span>
									)}
									{showCount && (
										<span className="ml-2 text-muted-foreground text-xs">
											({selected.length})
										</span>
									)}
								</>
							) : (
								<span className="text-muted-foreground">{placeholder}</span>
							)}
						</div>
						<div className="flex items-center gap-1">
							{clearable && selected.length > 0 && (
								<X
									className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
									onClick={(e) => {
										e.stopPropagation();
										handleClearAll();
									}}
									aria-label="Clear selection"
								/>
							)}
							<ChevronsUpDown className="shrink-0 opacity-50" />
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0">
					<Command>
						<CommandInput
							placeholder="Search..."
							value={query}
							onValueChange={setQuery}
							disabled={Boolean(loading)}
						/>
						<CommandGroup heading="Actions">
							<CommandItem
								onSelect={handleSelectAll}
								disabled={
									Boolean(disabled) ||
									(typeof maxSelected === "number" &&
										selected.length >= maxSelected)
								}
							>
								Select All
							</CommandItem>
							<CommandItem
								onSelect={handleClearAll}
								disabled={Boolean(disabled) || selected.length === 0}
							>
								Clear All
							</CommandItem>
						</CommandGroup>
						<CommandGroup heading={optionsGroupLabel}>
							<div className="scrollbar-hide max-h-[200px] overflow-y-auto">
								{loading ? (
									<div className="px-4 py-2 text-muted-foreground text-sm">
										Loading...
									</div>
								) : filteredOptions.length ? (
									filteredOptions.map((option) => {
										const isSelected = selected.includes(option.value);
										const isDisabled =
											Boolean(option.disabled) ||
											(typeof maxSelected === "number" &&
												!isSelected &&
												selected.length >= maxSelected);
										return (
											<CommandItem
												key={option.value}
												onSelect={() =>
													!isDisabled && toggleSelect(option.value)
												}
												disabled={isDisabled}
												className={cn(isDisabled && "opacity-50")}
											>
												<div
													className={cn(
														"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
														isSelected
															? "bg-primary text-primary-foreground"
															: "opacity-50",
													)}
												>
													{isSelected && <Check className="h-4 w-4" />}
												</div>
												{renderOption
													? renderOption(option, isSelected)
													: option.label}
											</CommandItem>
										);
									})
								) : (
									<div className="px-4 py-2 text-muted-foreground text-sm">
										{emptyState || "No options found"}
									</div>
								)}
							</div>
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
			{showFullSelected && selectedOptions.length > 0 && (
				<div className="mt-2">
					<Carousel
						opts={{
							align: "start",
						}}
						className="w-full"
					>
						<CarouselContent>
							{selectedOptions.map((option) => (
								<CarouselItem
									key={option.value}
									className="basis-auto pl-2 first-of-type:pl-4"
								>
									<Badge
										className="cursor-pointer px-2 py-0.5 text-xs"
										onClick={() =>
											onChange(selected.filter((v) => v !== option.value))
										}
										aria-label={`Remove ${option.label}`}
									>
										{getBadgeLabel(option.label, selectedBadgeDisplay)}
									</Badge>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				</div>
			)}
		</div>
	);
}
