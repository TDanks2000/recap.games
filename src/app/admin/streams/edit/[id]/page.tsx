"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";

const streamFormSchema = z.object({
	title: z.string().min(1, { message: "Stream title is required" }),
	link: z.string().url({ message: "Please enter a valid URL" }),
	conferenceId: z
		.number({
			required_error: "Please select a conference",
			invalid_type_error: "Please select a conference",
		})
		.nullable()
		.optional(),
});

type StreamFormValues = z.infer<typeof streamFormSchema>;

export default function EditStreamPage() {
	const params = useParams();
	const router = useRouter();
	const streamId = Number(params.id);
	const [activeTab, setActiveTab] = useState("details");

	const utils = api.useUtils();

	// Fetch conferences for the dropdown
	const { data: conferences, isLoading: isLoadingConferences } =
		api.conference.getAll.useQuery();

	// Fetch the stream data
	const {
		data: stream,
		isLoading,
		error,
	} = api.stream.getById.useQuery(
		{ id: streamId },
		{
			enabled: !Number.isNaN(streamId),
			retry: false,
		},
	);

	// Update stream mutation
	const updateStreamMutation = api.stream.update.useMutation({
		onSuccess: () => {
			toast.success("Stream updated successfully");
			utils.stream.getAll.invalidate();
			router.push("/admin/streams");
		},
		onError: (error) => {
			toast.error(`Error updating stream: ${error.message}`);
		},
	});

	const form = useForm<StreamFormValues>({
		resolver: zodResolver(streamFormSchema),
		defaultValues: {
			title: "",
			link: "",
			conferenceId: undefined,
		} as StreamFormValues,
	});

	// Update form values when stream data is loaded
	useEffect(() => {
		if (stream) {
			form.reset({
				title: stream.title,
				link: stream.link,
				conferenceId: stream.conferenceId ?? undefined,
			} as StreamFormValues);
		}
	}, [stream, form]);

	function onSubmit(data: StreamFormValues) {
		updateStreamMutation.mutate({
			id: streamId,
			title: data.title,
			link: data.link,
			conferenceId: data.conferenceId ?? undefined,
		});
	}

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-2xl">Edit Stream</h2>
					<Button
						variant="outline"
						onClick={() => router.push("/admin/streams")}
					>
						Back to Streams
					</Button>
				</div>
				<Separator />
				<div className="flex items-center justify-center p-12">
					<p>Loading stream data...</p>
				</div>
			</div>
		);
	}

	if (error || !stream) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-2xl">Edit Stream</h2>
					<Button
						variant="outline"
						onClick={() => router.push("/admin/streams")}
					>
						Back to Streams
					</Button>
				</div>
				<Separator />
				<Card>
					<CardContent className="p-6">
						<p className="text-red-500">
							Error loading stream: {error?.message || "Stream not found"}
						</p>
						<Button
							className="mt-4"
							onClick={() => router.push("/admin/streams")}
						>
							Return to Streams
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-2xl">Edit Stream</h2>
				<Button variant="outline" onClick={() => router.push("/admin/streams")}>
					Back to Streams
				</Button>
			</div>
			<Separator />

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full max-w-md grid-cols-2">
					<TabsTrigger value="details">Stream Details</TabsTrigger>
					<TabsTrigger value="related-games">Related Games</TabsTrigger>
				</TabsList>

				<TabsContent value="details" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Edit {stream.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-8"
								>
									<div className="space-y-6">
										<div className="space-y-4">
											<h3 className="font-semibold text-xl tracking-tight">
												Stream Information
											</h3>
											<div className="grid gap-6 md:grid-cols-2">
												{/* Stream Title */}
												<FormField
													control={form.control}
													name="title"
													render={({ field }) => (
														<FormItem className="flex min-h-20 flex-col justify-start">
															<FormLabel className="mb-2">
																Stream Title
															</FormLabel>
															<FormControl>
																<Input
																	placeholder="Official Stream"
																	className="w-full"
																	{...field}
																/>
															</FormControl>
															<FormMessage className="text-xs" />
														</FormItem>
													)}
												/>

												{/* Stream Link */}
												<FormField
													control={form.control}
													name="link"
													render={({ field }) => (
														<FormItem className="flex min-h-20 flex-col justify-start">
															<FormLabel className="mb-2">Stream URL</FormLabel>
															<FormControl>
																<Input
																	placeholder="https://youtube.com/watch?v=..."
																	className="w-full"
																	{...field}
																/>
															</FormControl>
															<FormDescription className="text-xs">
																YouTube, Twitch, or other streaming platform URL
															</FormDescription>
															<FormMessage className="text-xs" />
														</FormItem>
													)}
												/>
											</div>

											{/* Conference */}
											<FormField
												control={form.control}
												name="conferenceId"
												render={({ field }) => (
													<FormItem className="flex min-h-20 flex-col justify-start">
														<FormLabel className="mb-2">Conference</FormLabel>
														<Select
															onValueChange={(value) =>
																field.onChange(Number(value))
															}
															value={field.value?.toString() || ""}
															disabled={isLoadingConferences}
														>
															<FormControl>
																<SelectTrigger className="w-full">
																	<SelectValue placeholder="Select a conference" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{conferences?.map((conference) => (
																	<SelectItem
																		key={conference.id}
																		value={conference.id.toString()}
																	>
																		{conference.name}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormDescription className="text-xs">
															Associate with a conference
														</FormDescription>
														<FormMessage className="text-xs" />
													</FormItem>
												)}
											/>
										</div>
									</div>

									<div className="flex justify-end pt-6">
										<Button
											type="submit"
											disabled={updateStreamMutation.isPending}
											className="relative min-w-[120px]"
										>
											{updateStreamMutation.isPending ? (
												<>
													<span className="opacity-0">Update Stream</span>
													<span className="absolute inset-0 flex items-center justify-center">
														Updating...
													</span>
												</>
											) : (
												"Update Stream"
											)}
										</Button>
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="related-games" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Related Games</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<p className="text-muted-foreground text-sm">
									Games that were announced or showcased during this stream.
								</p>
								{/* This section will be implemented in the future when the API is available */}
								<div className="rounded-md bg-muted p-4 text-sm">
									<p>
										No related games found. Game association feature coming
										soon.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
