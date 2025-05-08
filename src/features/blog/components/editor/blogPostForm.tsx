"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { api } from "@/trpc/react";
import { Editor } from "./editor";

const blogPostSchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
	published: z.boolean().optional(),
});

type BlogPostData = z.infer<typeof blogPostSchema>;

type BlogPostFormProps =
	| {
			className?: string;
			initialData?: Partial<BlogPostData>;
			isEditing?: false | null;
	  }
	| {
			isEditing: true;
			id: number;
			className?: string;
			initialData: Partial<BlogPostData>;
	  };

export const BlogPostForm = (props: BlogPostFormProps) => {
	const { className, initialData, isEditing } = props;

	const router = useRouter();
	const form = useForm<BlogPostData>({
		resolver: zodResolver(blogPostSchema),
		defaultValues: {
			title: initialData?.title ?? "",
			content: initialData?.content ?? "",
			published: initialData?.published ?? false,
		},
	});

	const { mutate: createPost, isPending: isPostCreating } =
		api.blog.createPost.useMutation({
			onSuccess: () => {
				toast.success("Blog post published!");
				form.reset(); // Optional: reset form after submission
			},
			onError: (err) => {
				toast.error(err.message || "Something went wrong.");
			},
		});

	const { mutate: updatePost, isPending: isPostUpdating } =
		api.blog.updatePost.useMutation({
			onSuccess: (data) => {
				toast.success("Blog updated successfully!");
				router.push(`/blog/${data.slug}`);
			},
			onError: (err) => {
				toast.error(err.message || "Something went wrong.");
			},
		});

	const handleSubmit = (data: BlogPostData) => {
		const slug = data.title
			.toLowerCase()
			.replace(/ /g, "-")
			.replace(/[^\w-]+/g, "");

		if (isEditing && "id" in props) {
			updatePost({ id: props.id, ...data });
		} else {
			createPost({
				...data,
				slug,
				published: data.published ?? false,
			});
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className={`space-y-8 ${className}`}
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel htmlFor="title" className="font-semibold text-lg">
								Title
							</FormLabel>
							<FormDescription>
								Give your post a concise, descriptive title.
							</FormDescription>
							<FormControl>
								<Input
									id="title"
									placeholder="Enter your blog post title"
									className="font-medium text-xl"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="content"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel htmlFor="editor" className="font-semibold text-lg">
								Content
							</FormLabel>
							<FormDescription>
								Use Markdown syntax for headings, lists, code blocks, and more.
							</FormDescription>
							<FormControl>
								<Editor
									initialContent={field.value}
									onContentChange={field.onChange}
									className="min-h-[500px] rounded-md"
									textAreaClassName={
										fieldState.invalid ? "ring-destructive ring-1" : ""
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="published"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
							<FormControl>
								<Checkbox
									checked={field.value ?? false}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>Published</FormLabel>
								<FormDescription>
									Make this post visible to the public.
								</FormDescription>
							</div>
						</FormItem>
					)}
				/>

				<div className="flex justify-end pt-4">
					<Button
						type="submit"
						size="lg"
						className="px-8"
						disabled={isEditing ? isPostUpdating : isPostCreating}
					>
						{isEditing ? (
							isPostUpdating ? (
								<Loader2 className="animate-spin" />
							) : (
								<Upload />
							)
						) : isPostCreating ? (
							<Loader2 className="animate-spin" />
						) : (
							<Upload />
						)}
						{isEditing ? "Update Post" : "Publish Post"}
					</Button>
				</div>
			</form>
		</Form>
	);
};
