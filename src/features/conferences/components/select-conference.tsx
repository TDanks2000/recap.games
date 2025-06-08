"use client";

import { Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { api, type RouterOutputs } from "@/trpc/react";

type Conference = RouterOutputs["conference"]["getAll"][number];

type Props = {
	onSelect: (conference: Conference) => void;
	placeholder?: string;
	className?: string;
};

export const SelectConference = ({
	onSelect,
	placeholder = "Select a conference",
	className,
}: Props) => {
	const {
		data: conferences,
		isLoading,
		error,
	} = api.conference.getAll.useQuery();

	const triggerClassName = `w-[280px] ${className}`;

	if (error) {
		return (
			<Select disabled>
				<SelectTrigger className={triggerClassName}>
					<div className="truncate">
						<SelectValue placeholder="Error loading conferences" />
					</div>
				</SelectTrigger>
			</Select>
		);
	}

	if (isLoading || !conferences) {
		return (
			<Select disabled>
				<SelectTrigger className={triggerClassName}>
					<div className="flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin" />
						<div className="truncate">
							<SelectValue placeholder="Loading conferences..." />
						</div>
					</div>
				</SelectTrigger>
			</Select>
		);
	}

	if (conferences.length === 0) {
		return (
			<Select disabled>
				<SelectTrigger className={triggerClassName}>
					<div className="truncate">
						<SelectValue placeholder="No conferences available" />
					</div>
				</SelectTrigger>
			</Select>
		);
	}

	return (
		<Select
			onValueChange={(value) => {
				const conference = conferences.find(
					(c) => c.id === Number.parseInt(value),
				);
				if (conference) {
					onSelect(conference);
				}
			}}
		>
			<SelectTrigger className={triggerClassName}>
				<div className="truncate">
					<SelectValue placeholder={placeholder} />
				</div>
			</SelectTrigger>
			<SelectContent className="max-h-[300px] overflow-y-auto" align="center">
				<SelectGroup>
					{conferences.map((conference) => (
						<SelectItem
							key={conference.id}
							value={conference.id?.toString()}
							className="cursor-pointer"
						>
							{conference.name}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
