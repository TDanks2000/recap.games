"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	MoreHorizontalIcon,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const paginationLinkVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium text-sm ring-offset-background transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-100 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "hover:bg-accent hover:text-accent-foreground",
				active:
					"border border-input bg-primary text-primary-foreground shadow-sm",
				ghost: "hover:bg-accent hover:text-accent-foreground",
			},
			size: {
				default: "h-10 w-10",
				sm: "h-9 w-9",
				lg: "h-11 w-11",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const paginationEllipsisVariants = cva("flex items-center justify-center", {
	variants: {
		size: {
			default: "h-10 w-10",
			sm: "h-9 w-9",
			lg: "h-11 w-11",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

type PaginationProps = React.ComponentProps<"nav"> & {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	size?: VariantProps<typeof paginationLinkVariants>["size"];
	siblingCount?: number;
	showGoTo?: boolean;
};

const generatePagination = (
	currentPage: number,
	totalPages: number,
	siblingCount: number,
): (number | "...")[] => {
	const totalPageNumbers = siblingCount + 5;
	if (totalPageNumbers >= totalPages) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}
	const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
	const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
	const shouldShowLeftEllipsis = leftSiblingIndex > 2;
	const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;
	const firstPageIndex = 1;
	const lastPageIndex = totalPages;

	if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
		const leftItemCount = 3 + 2 * siblingCount;
		const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
		return [...leftRange, "...", totalPages];
	}
	if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
		const rightItemCount = 3 + 2 * siblingCount;
		const rightRange = Array.from(
			{ length: rightItemCount },
			(_, i) => totalPages - rightItemCount + i + 1,
		);
		return [firstPageIndex, "...", ...rightRange];
	}
	if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
		const middleRange = Array.from(
			{ length: rightSiblingIndex - leftSiblingIndex + 1 },
			(_, i) => leftSiblingIndex + i,
		);
		return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
	}
	return Array.from({ length: totalPages }, (_, i) => i + 1);
};

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
	(
		{
			className,
			page,
			totalPages,
			onPageChange,
			siblingCount = 1,
			size,
			showGoTo = true,
			...props
		},
		ref,
	) => {
		const paginationRange = React.useMemo(
			() => generatePagination(page, totalPages, siblingCount),
			[page, totalPages, siblingCount],
		);

		if (totalPages <= 1) {
			return null;
		}

		const handlePrevious = () => onPageChange(page - 1);
		const handleNext = () => onPageChange(page + 1);

		return (
			<nav
				ref={ref}
				aria-label="pagination"
				className={cn("flex w-full items-center justify-between", className)}
				{...props}
			>
				{showGoTo && (
					<PaginationGoTo
						currentPage={page}
						totalPages={totalPages}
						onPageChange={onPageChange}
					/>
				)}
				<ul
					className={cn("flex flex-row items-center gap-1", {
						"mx-auto": !showGoTo,
					})}
				>
					<PaginationItem>
						<PaginationPrevious
							onClick={handlePrevious}
							disabled={page === 1}
							size={size}
						/>
					</PaginationItem>
					{paginationRange.map((pageNumber) =>
						pageNumber === "..." ? (
							<PaginationItem key={`ellipsis-${pageNumber}`}>
								<PaginationEllipsis size={size} />
							</PaginationItem>
						) : (
							<PaginationItem key={pageNumber}>
								<PaginationLink
									isActive={page === pageNumber}
									onClick={() => onPageChange(pageNumber)}
									size={size}
								>
									{pageNumber}
								</PaginationLink>
							</PaginationItem>
						),
					)}
					<PaginationItem>
						<PaginationNext
							onClick={handleNext}
							disabled={page === totalPages}
							size={size}
						/>
					</PaginationItem>
				</ul>
			</nav>
		);
	},
);
Pagination.displayName = "Pagination";

const PaginationItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
	<li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
	isActive?: boolean;
} & VariantProps<typeof paginationLinkVariants> &
	React.ComponentProps<"button">;

const PaginationLink = ({
	className,
	isActive,
	size,
	...props
}: PaginationLinkProps) => (
	<button
		type="button"
		aria-current={isActive ? "page" : undefined}
		className={cn(
			paginationLinkVariants({
				variant: isActive ? "active" : "default",
				size,
			}),
			className,
		)}
		{...props}
	/>
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = React.forwardRef<
	HTMLButtonElement,
	Omit<PaginationLinkProps, "isActive" | "variant">
>(({ className, size, ...props }, ref) => (
	<PaginationLink
		ref={ref}
		aria-label="Go to previous page"
		size={size}
		variant="ghost"
		className={cn("gap-1", className)}
		{...props}
	>
		<ChevronLeftIcon className="h-4 w-4" />
	</PaginationLink>
));
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef<
	HTMLButtonElement,
	Omit<PaginationLinkProps, "isActive" | "variant">
>(({ className, size, ...props }, ref) => (
	<PaginationLink
		ref={ref}
		aria-label="Go to next page"
		size={size}
		variant="ghost"
		className={cn("gap-1", className)}
		{...props}
	>
		<ChevronRightIcon className="h-4 w-4" />
	</PaginationLink>
));
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
	className,
	size,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof paginationEllipsisVariants>) => (
	<span
		aria-hidden
		className={cn(paginationEllipsisVariants({ size }), className)}
		{...props}
	>
		<MoreHorizontalIcon className="h-4 w-4" />
		<span className="sr-only">More pages</span>
	</span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

const PaginationGoTo = ({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) => {
	const [isEditing, setIsEditing] = React.useState(false);
	const [inputValue, setInputValue] = React.useState(String(currentPage));
	const inputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		setInputValue(String(currentPage));
	}, [currentPage]);

	React.useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus();
			inputRef.current?.select();
		}
	}, [isEditing]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			const pageNum = Number.parseInt(inputValue, 10);
			if (pageNum >= 1 && pageNum <= totalPages) {
				onPageChange(pageNum);
			}
			setIsEditing(false);
		} else if (e.key === "Escape") {
			setInputValue(String(currentPage));
			setIsEditing(false);
		}
	};

	if (isEditing) {
		return (
			<div className="flex items-center gap-2 text-sm">
				<span className="text-muted-foreground">Go to:</span>
				<input
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ""))}
					onKeyDown={handleKeyDown}
					onBlur={() => setIsEditing(false)}
					className="h-8 w-12 rounded-md border border-input bg-background px-2 py-1 text-center"
					aria-label={`Go to page, current page ${currentPage}`}
				/>
				<span className="text-muted-foreground">/ {totalPages}</span>
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={() => setIsEditing(true)}
			className="hidden cursor-text rounded-md px-2 py-1 text-muted-foreground text-sm hover:bg-accent sm:block"
			aria-label={`Page ${currentPage} of ${totalPages}. Click to go to a specific page.`}
		>
			Page {currentPage} of {totalPages}
		</button>
	);
};

export {
	Pagination,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
	PaginationGoTo,
};
