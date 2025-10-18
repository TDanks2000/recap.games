"use client";

import { Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { CreateTagDialog } from "./createTagDialog";

export const TagManager = () => {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingTag, setEditingTag] = useState<{
		id: number;
		name: string;
		slug: string;
		description?: string;
		color?: string;
	} | null>(null);

	const {
		data: tags = [],
		isLoading,
		refetch,
	} = api.blog.getAllTags.useQuery();

	const { mutate: deleteTag, isPending: isDeleting } =
		api.blog.deleteTag.useMutation({
			onSuccess: () => {
				toast.success("Tag deleted successfully!");
				refetch();
			},
			onError: (error) => {
				toast.error(error.message || "Failed to delete tag");
			},
		});

	const handleDeleteTag = (id: number, name: string) => {
		if (
			confirm(
				`Are you sure you want to delete the tag "${name}"? This will remove it from all blog posts.`,
			)
		) {
			deleteTag({ id });
		}
	};

	const handleEditTag = (tag: (typeof tags)[0]) => {
		setEditingTag({
			id: tag.id,
			name: tag.name,
			slug: tag.slug,
			description: tag.description || undefined,
			color: tag.color || undefined,
		});
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-muted-foreground">Loading tags...</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-bold text-2xl">Gaming Tag Management</h2>
					<p className="text-muted-foreground">
						Manage your gaming tags to help categorize and organize your gaming
						content.
					</p>
				</div>
				<Button onClick={() => setIsCreateDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Create Tag
				</Button>
			</div>

			{tags.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<div className="mb-4 text-muted-foreground">
						<Plus className="mx-auto h-12 w-12" />
					</div>
					<h3 className="font-semibold text-lg">No gaming tags yet</h3>
					<p className="text-muted-foreground text-sm">
						Create your first gaming tag to start categorizing your gaming
						content.
					</p>
					<Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Create Your First Gaming Tag
					</Button>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{tags.map((tag) => (
						<Card key={tag.id} className="relative">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										{tag.color && (
											<div
												className="h-3 w-3 rounded-full"
												style={{ backgroundColor: tag.color }}
											/>
										)}
										<CardTitle className="text-lg">{tag.name}</CardTitle>
									</div>
									<div className="flex items-center gap-1">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleEditTag(tag)}
											disabled={isDeleting}
										>
											<Edit2 className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleDeleteTag(tag.id, tag.name)}
											disabled={isDeleting}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="space-y-2">
									<div className="text-muted-foreground text-sm">
										<strong>Slug:</strong> {tag.slug}
									</div>
									{tag.description && (
										<div className="text-muted-foreground text-sm">
											{tag.description}
										</div>
									)}
									{tag.color && (
										<Badge
											variant="outline"
											className="border-0 text-xs"
											style={{ backgroundColor: tag.color, color: "white" }}
										>
											{tag.color}
										</Badge>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			<CreateTagDialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
				onTagCreated={() => {
					refetch();
				}}
			/>

			{editingTag && (
				<CreateTagDialog
					open={!!editingTag}
					onOpenChange={(open) => {
						if (!open) setEditingTag(null);
					}}
					onTagCreated={() => {
						setEditingTag(null);
						refetch();
					}}
					initialData={editingTag}
					isEditing={true}
				/>
			)}
		</div>
	);
};
