"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";

const conferenceFormSchema = z.object({
	conference: z.object({
		name: z.string().min(1, { message: "Conference name is required" }),
		startTime: z.string().optional(),
		endTime: z.string().optional(),
	}),
	stream: z.object({
		title: z.string().min(1, { message: "Stream title is required" }),
		link: z.string().url({ message: "Please enter a valid URL" }),
	}),
});

type ConferenceFormValues = z.infer<typeof conferenceFormSchema>;

interface ConferenceFormProps {
	formIndex: number;
}

export default function ConferenceForm({ formIndex }: ConferenceFormProps) {
	const utils = api.useUtils();

	const createConferenceMutation =
		api.combined.createConferenceWithStream.useMutation({
			onSuccess: () => {
				toast.success("Conference created successfully");
				form.reset();
				utils.conference.getAll.invalidate();
			},
			onError: (error) => {
				toast.error(`Error creating conference: ${error.message}`);
			},
		});

	const form = useForm<ConferenceFormValues>({
		resolver: zodResolver(conferenceFormSchema),
		defaultValues: {
			conference: {
				name: "",
				startTime: "",
				endTime: "",
			},
			stream: {
				title: "",
				link: "",
			},
		},
	});

	function onSubmit(data: ConferenceFormValues) {
		// Convert string dates to Date objects if provided
		const startTime = data.conference.startTime
			? new Date(data.conference.startTime)
			: undefined;
		const endTime = data.conference.endTime
			? new Date(data.conference.endTime)
			: undefined;

		createConferenceMutation.mutate({
			conference: {
				name: data.conference.name,
				startTime,
				endTime,
			},
			stream: data.stream,
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mx-auto space-y-8 rounded-lg"
			>
				<div className="space-y-6">
					<div className="space-y-4">
						<h3 className="font-semibold text-xl tracking-tight">
							Conference Details
						</h3>
						{/* Conference Name */}
						<FormField
							control={form.control}
							name="conference.name"
							render={({ field }) => (
								<FormItem className="flex min-h-20 flex-col justify-start">
									<FormLabel className="mb-2">Conference Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Nintendo, Ubisoft, Xbox, etc."
											className="w-full"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>

						<div className="grid gap-6 md:grid-cols-2">
							{/* Start Time */}
							<FormField
								control={form.control}
								name="conference.startTime"
								render={({ field }) => (
									<FormItem className="flex min-h-20 flex-col justify-start">
										<FormLabel className="mb-2">Start Time</FormLabel>
										<FormControl>
											<Input
												type="datetime-local"
												className="w-full"
												{...field}
											/>
										</FormControl>
										<FormDescription className="text-xs">
											When the conference begins
										</FormDescription>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>

							{/* End Time */}
							<FormField
								control={form.control}
								name="conference.endTime"
								render={({ field }) => (
									<FormItem className="flex min-h-20 flex-col justify-start">
										<FormLabel className="mb-2">End Time</FormLabel>
										<FormControl>
											<Input
												type="datetime-local"
												className="w-full"
												{...field}
											/>
										</FormControl>
										<FormDescription className="text-xs">
											When the conference ends
										</FormDescription>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<Separator className="my-6" />

					{/* Stream Section */}
					<div className="space-y-4">
						<h3 className="font-semibold text-xl tracking-tight">
							Stream Details
						</h3>
						<div className="grid gap-6 md:grid-cols-2">
							{/* Stream Title */}
							<FormField
								control={form.control}
								name="stream.title"
								render={({ field }) => (
									<FormItem className="flex min-h-20 flex-col justify-start">
										<FormLabel className="mb-2">Stream Title</FormLabel>
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
								name="stream.link"
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
					</div>
				</div>

				<div className="flex justify-end pt-6">
					<Button
						type="submit"
						disabled={createConferenceMutation.isPending}
						className="relative min-w-[120px]"
					>
						{createConferenceMutation.isPending ? (
							<>
								<span className="opacity-0">Save Conference</span>
								<span className="absolute inset-0 flex items-center justify-center">
									Saving...
								</span>
							</>
						) : (
							"Save Conference"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
