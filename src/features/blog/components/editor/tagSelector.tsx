"use client";

import { Plus, Tag } from "lucide-react";
import { useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { api } from "@/trpc/react";
import { CreateTagDialog } from "./createTagDialog";

interface TagOption {
	label: string;
	value: string;
	description?: string;
	color?: string;
}

interface TagSelectorProps {
	selectedTags: number[];
	onTagsChange: (tagIds: number[]) => void;
	className?: string;
}

export const TagSelector = ({
	selectedTags,
	onTagsChange,
	className,
}: TagSelectorProps) => {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	const {
		data: tags = [],
		isLoading,
		refetch,
	} = api.blog.getAllTags.useQuery();

	const tagOptions: TagOption[] = tags.map((tag) => ({
		label: tag.name,
		value: tag.id.toString(),
		description: tag.description || undefined,
		color: tag.color || undefined,
	}));

	const selectedTagValues = selectedTags.map((id) => id.toString());

	const handleTagChange = (values: string[]) => {
		onTagsChange(values.map((v) => Number.parseInt(v, 10)));
	};

	const handleCreateTag = () => {
		setIsCreateDialogOpen(true);
	};

	const renderTagOption = (option: TagOption, _selected: boolean) => (
		<div className="flex items-center gap-2">
			{option.color && (
				<div
					className="h-3 w-3 rounded-full border"
					style={{ backgroundColor: option.color }}
				/>
			)}
			<div className="flex flex-col">
				<span className="font-medium text-sm">{option.label}</span>
				{option.description && (
					<span className="text-muted-foreground text-xs">
						{option.description}
					</span>
				)}
			</div>
		</div>
	);

	const renderSelectedTag = (option: TagOption) => (
		<div className="flex items-center gap-1">
			{option.color && (
				<div
					className="h-2 w-2 rounded-full"
					style={{ backgroundColor: option.color }}
				/>
			)}
			<span className="text-xs">{option.label}</span>
		</div>
	);

	return (
		<>
			<div className={className}>
				<MultiSelect
					options={tagOptions}
					selected={selectedTagValues}
					onChange={handleTagChange}
					placeholder="Select gaming tags..."
					loading={isLoading}
					showCount
					clearable
					showFullSelected
					renderOption={renderTagOption}
					renderSelected={renderSelectedTag}
					emptyState={
						<div className="flex flex-col items-center gap-2 px-4 py-6">
							<Tag className="h-8 w-8 text-muted-foreground" />
							<div className="text-center">
								<p className="text-muted-foreground text-sm">
									No gaming tags found
								</p>
								<p className="text-muted-foreground text-xs">
									Create your first gaming tag to get started
								</p>
							</div>
						</div>
					}
					optionsGroupLabel="Tags"
					selectedBadgeDisplay="whole"
					customActions={[
						{
							label: "Create Gaming Tag",
							onSelect: handleCreateTag,
							icon: <Plus className="h-4 w-4" />,
						},
					]}
				/>
			</div>

			<CreateTagDialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
				onTagCreated={async () => {
					await refetch();
				}}
			/>
		</>
	);
};
