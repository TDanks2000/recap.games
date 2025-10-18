"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";

const createTagSchema = z.object({
	name: z
		.string()
		.min(1, "Tag name is required")
		.max(50, "Tag name must be less than 50 characters"),
	slug: z
		.string()
		.min(1, "Tag slug is required")
		.max(50, "Tag slug must be less than 50 characters"),
	description: z.string().optional(),
	color: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color")
		.optional(),
});

type CreateTagData = z.infer<typeof createTagSchema>;

interface CreateTagDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onTagCreated?: () => void;
	initialData?: {
		id: number;
		name: string;
		slug: string;
		description?: string;
		color?: string;
	};
	isEditing?: boolean;
}

export const CreateTagDialog = ({
	open,
	onOpenChange,
	onTagCreated,
	initialData,
	isEditing = false,
}: CreateTagDialogProps) => {
	const form = useForm<CreateTagData>({
		resolver: zodResolver(createTagSchema),
		defaultValues: {
			name: initialData?.name || "",
			slug: initialData?.slug || "",
			description: initialData?.description || "",
			color: initialData?.color || "#3b82f6", // Default blue color
		},
	});

	const { mutate: createTag, isPending: isCreating } =
		api.blog.createTag.useMutation({
			onSuccess: () => {
				toast.success("Tag created successfully!");
				form.reset();
				onOpenChange(false);
				onTagCreated?.();
			},
			onError: (error) => {
				toast.error(error.message || "Failed to create tag");
			},
		});

	const { mutate: updateTag, isPending: isUpdating } =
		api.blog.updateTag.useMutation({
			onSuccess: () => {
				toast.success("Tag updated successfully!");
				form.reset();
				onOpenChange(false);
				onTagCreated?.();
			},
			onError: (error) => {
				toast.error(error.message || "Failed to update tag");
			},
		});

	const handleSubmit = (data: CreateTagData) => {
		if (isEditing && initialData) {
			updateTag({ id: initialData.id, ...data });
		} else {
			createTag(data);
		}
	};

	const isPending = isCreating || isUpdating;

	const handleNameChange = (name: string) => {
		// Auto-generate slug from name
		const slug = name
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();
		form.setValue("slug", slug);
	};

	const predefinedColors = [
		"#3b82f6", // Blue
		"#10b981", // Emerald
		"#f59e0b", // Amber
		"#ef4444", // Red
		"#8b5cf6", // Violet
		"#06b6d4", // Cyan
		"#84cc16", // Lime
		"#f97316", // Orange
		"#ec4899", // Pink
		"#6b7280", // Gray
	];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader className="space-y-3">
					<DialogTitle className="flex items-center gap-3 text-2xl">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
							<Tag className="h-5 w-5 text-primary" />
						</div>
						{isEditing ? "Edit Tag" : "Create New Tag"}
					</DialogTitle>
					<DialogDescription className="text-base">
						{isEditing
							? "Update your tag information to better categorize your gaming content."
							: "Add a new tag to categorize your gaming posts. Tags help readers find related gaming content."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-8"
					>
						{/* Name and Slug in a grid */}
						<div className="grid gap-6 md:grid-cols-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="font-semibold text-base">
											Tag Name
										</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g., RPG, Action, Review, Guide"
												className="h-11 text-base"
												{...field}
												onChange={(e) => {
													field.onChange(e);
													handleNameChange(e.target.value);
												}}
											/>
										</FormControl>
										<FormDescription className="text-sm">
											The display name for your gaming tag (max 50 characters)
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="slug"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="font-semibold text-base">
											Tag Slug
										</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g., rpg, action, review, guide"
												className="h-11 text-base"
												{...field}
											/>
										</FormControl>
										<FormDescription className="text-sm">
											URL-friendly version (auto-generated from name)
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-semibold text-base">
										Description (Optional)
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Brief description of what this gaming tag represents..."
											className="resize-none text-base"
											rows={3}
											{...field}
										/>
									</FormControl>
									<FormDescription className="text-sm">
										Help readers understand what this gaming tag is for
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="color"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-semibold text-base">
										Tag Color
									</FormLabel>
									<FormControl>
										<div className="space-y-4">
											{/* Color picker and hex input */}
											<div className="flex items-center gap-3">
												<div className="relative">
													<Input
														type="color"
														className="h-12 w-16 cursor-pointer rounded-lg border-0 p-1"
														{...field}
													/>
													<div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-border" />
												</div>
												<div className="flex-1">
													<Input
														placeholder="#3b82f6"
														className="h-12 font-mono text-base"
														value={field.value}
														onChange={field.onChange}
													/>
												</div>
											</div>

											{/* Predefined colors */}
											<div className="space-y-2">
												<p className="font-medium text-muted-foreground text-sm">
													Quick Colors
												</p>
												<div className="grid grid-cols-5 gap-2">
													{predefinedColors.map((color) => (
														<button
															key={color}
															type="button"
															className={`h-10 w-full rounded-lg border-2 transition-all hover:scale-105 ${
																field.value === color
																	? "border-primary ring-2 ring-primary/20"
																	: "border-border hover:border-primary/50"
															}`}
															style={{ backgroundColor: color }}
															onClick={() => field.onChange(color)}
															title={color}
														/>
													))}
												</div>
											</div>
										</div>
									</FormControl>
									<FormDescription className="text-sm">
										Choose a color to help identify this tag visually
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
							<Button
								type="button"
								variant="destructive"
								onClick={() => onOpenChange(false)}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button
								type="button"
								disabled={isPending}
								onClick={() => {
									form.handleSubmit(handleSubmit)();
								}}
							>
								{isPending ? (
									<>
										<Loader2 className="animate-spin" />
										{isEditing ? "Updating..." : "Creating..."}
									</>
								) : (
									<>
										<Plus className="" />
										{isEditing ? "Update Tag" : "Create Tag"}
									</>
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
