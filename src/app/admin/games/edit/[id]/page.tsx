"use client";

import { MediaType } from "@/@types/db";
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
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const mediaSchema = z.object({
	type: z.nativeEnum(MediaType),
	link: z.string().url({ message: "Please enter a valid URL" }),
});

const gameFormSchema = z.object({
	title: z.string().min(1, { message: "Title is required" }),
	releaseDate: z.string().optional(),
	genres: z.array(z.string()).optional(),
	exclusive: z.array(z.string()).optional(),
	features: z.array(z.string()).optional(),
	developer: z.array(z.string()).optional(),
	publisher: z.array(z.string()).optional(),
	hidden: z.boolean().optional(),
	conferenceId: z.number().optional(),
	media: z
		.array(mediaSchema)
		.min(1, { message: "At least one media item is required" }),
});

type GameFormValues = z.infer<typeof gameFormSchema>;

export default function EditGamePage() {
	const params = useParams();
	const router = useRouter();
	const gameId = Number(params.id);

	const utils = api.useUtils();

	// Fetch conferences for the dropdown
	const { data: conferences, isLoading: isLoadingConferences } =
		api.conference.getAll.useQuery();

	// Fetch the game data
	const {
		data: game,
		isLoading,
		error,
	} = api.game.getById.useQuery(
		{ id: gameId },
		{
			enabled: !Number.isNaN(gameId),
			retry: false,
		},
	);

	// Update game mutation
	const updateGameMutation = api.game.update.useMutation({
		onSuccess: () => {
			toast.success("Game updated successfully");
			utils.game.getAll.invalidate();
			router.push("/admin/games");
		},
		onError: (error) => {
			toast.error(`Error updating game: ${error.message}`);
		},
	});

	const form = useForm<GameFormValues>({
		resolver: zodResolver(gameFormSchema),
		defaultValues: {
			title: "",
			releaseDate: "",
			genres: [],
			exclusive: [],
			features: [],
			developer: [],
			publisher: [],
			hidden: false,
			media: [
				{
					type: MediaType.Video,
					link: "",
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "media",
	});

	// Update form values when game data is loaded
	useEffect(() => {
		if (game) {
			form.reset({
				title: game.title,
				releaseDate: game.releaseDate || "",
				genres: game.genres || [],
				exclusive: (game.exclusive as string[]) || [],
				features: (game.features as string[]) || [],
				developer: (game.developer as string[]) || [],
				publisher: (game.publisher as string[]) || [],
				hidden: game.hidden || false,
				conferenceId: game.conferenceId ?? undefined,
				media: game.media?.length
					? game.media.map((m) => ({
							type: m.type as MediaType,
							link: m.link,
						}))
					: [
							{
								type: MediaType.Video,
								link: "",
							},
						],
			});
		}
	}, [game, form]);

	function onSubmit(data: GameFormValues) {
		// First update the game
		updateGameMutation.mutate({
			id: gameId,
			title: data.title,
			releaseDate: data.releaseDate,
			genres: data.genres,
			exclusive: data.exclusive,
			features: data.features,
			developer: data.developer,
			publisher: data.publisher,
			hidden: data.hidden,
			conferenceId: data.conferenceId,
		});

		// TODO: Add media update functionality if needed
	}

	// Convert comma-separated string inputs to arrays
	const handleArrayInput = (
		value: string,
		field: { onChange: (value: string[]) => void },
	) => {
		if (!value) {
			field.onChange([]);
			return;
		}
		const array = value.split(",").map((item) => item.trim());
		field.onChange(array);
	};

	// Convert arrays back to comma-separated strings for display
	const arrayToString = (array: string[] | undefined) => {
		if (!array || array?.length === 0) return "";
		return array.join(", ");
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-2xl">Edit Game</h2>
					<Button variant="outline" onClick={() => router.push("/admin/games")}>
						Back to Games
					</Button>
				</div>
				<Separator />
				<div className="flex items-center justify-center p-12">
					<p>Loading game data...</p>
				</div>
			</div>
		);
	}

	if (error || !game) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-2xl">Edit Game</h2>
					<Button variant="outline" onClick={() => router.push("/admin/games")}>
						Back to Games
					</Button>
				</div>
				<Separator />
				<Card>
					<CardContent className="p-6">
						<p className="text-red-500">
							Error loading game: {error?.message || "Game not found"}
						</p>
						<Button
							className="mt-4"
							onClick={() => router.push("/admin/games")}
						>
							Return to Games
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-2xl">Edit Game</h2>
				<Button variant="outline" onClick={() => router.push("/admin/games")}>
					Back to Games
				</Button>
			</div>
			<Separator />

			<Card>
				<CardHeader>
					<CardTitle>Edit {game.title}</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="space-y-8">
								{/* Basic Details */}
								<div className="space-y-4">
									<h3 className="font-semibold text-xl tracking-tight">
										Basic Details
									</h3>
									<div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
										{/* Title */}
										<FormField
											control={form.control}
											name="title"
											render={({ field }) => (
												<FormItem className="flex min-h-20 flex-col justify-start">
													<FormLabel className="mb-2">Title</FormLabel>
													<FormControl>
														<Input placeholder="Game title" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Release Date */}
										<FormField
											control={form.control}
											name="releaseDate"
											render={({ field }) => (
												<FormItem className="flex min-h-20 flex-col justify-start">
													<FormLabel className="mb-2">Release Date</FormLabel>
													<FormControl>
														<Input placeholder="Release date" {...field} />
													</FormControl>
													<FormDescription>
														Format: MM-DD-YYYY or text like "Q4 2023"
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								{/* Game Details */}
								<div className="space-y-4">
									<h3 className="font-semibold text-xl tracking-tight">
										Game Details
									</h3>
									<div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
										{/* Genres */}
										<FormField
											control={form.control}
											name="genres"
											render={({ field }) => (
												<FormItem className="flex min-h-20 flex-col justify-start">
													<FormLabel className="mb-2">Genres</FormLabel>
													<FormControl>
														<Input
															placeholder="Action, Adventure, RPG"
															value={arrayToString(field.value)}
															onChange={(e) =>
																handleArrayInput(e.target.value, field)
															}
														/>
													</FormControl>
													<FormDescription>
														Comma-separated list of genres
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Exclusive */}
										<FormField
											control={form.control}
											name="exclusive"
											render={({ field }) => (
												<FormItem className="flex min-h-20 flex-col justify-start">
													<FormLabel className="mb-2">
														Platform Exclusivity
													</FormLabel>
													<FormControl>
														<Input
															placeholder="PlayStation, Xbox, PC"
															value={arrayToString(field.value)}
															onChange={(e) =>
																handleArrayInput(e.target.value, field)
															}
														/>
													</FormControl>
													<FormDescription>
														Comma-separated list of platforms
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Features */}
										<FormField
											control={form.control}
											name="features"
											render={({ field }) => (
												<FormItem className="flex min-h-20 flex-col justify-start">
													<FormLabel className="mb-2">Features</FormLabel>
													<FormControl>
														<Input
															placeholder="Multiplayer, Co-op, HDR"
															value={arrayToString(field.value)}
															onChange={(e) =>
																handleArrayInput(e.target.value, field)
															}
														/>
													</FormControl>
													<FormDescription>
														Comma-separated list of features
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Developer */}
										<FormField
											control={form.control}
											name="developer"
											render={({ field }) => (
												<FormItem className="flex min-h-20 flex-col justify-start">
													<FormLabel className="mb-2">Developer</FormLabel>
													<FormControl>
														<Input
															placeholder="Studio name"
															value={arrayToString(field.value)}
															onChange={(e) =>
																handleArrayInput(e.target.value, field)
															}
														/>
													</FormControl>
													<FormDescription>
														Comma-separated list of developers
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Publisher */}
										<FormField
											control={form.control}
											name="publisher"
											render={({ field }) => (
												<FormItem className="flex min-h-20 flex-col justify-start">
													<FormLabel className="mb-2">Publisher</FormLabel>
													<FormControl>
														<Input
															placeholder="Publisher name"
															value={arrayToString(field.value)}
															onChange={(e) =>
																handleArrayInput(e.target.value, field)
															}
														/>
													</FormControl>
													<FormDescription>
														Comma-separated list of publishers
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Conference */}
										<FormField
											control={form.control}
											name="conferenceId"
											render={({ field }) => (
												<FormItem>
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
													<FormDescription>
														Associate with a conference
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Hidden */}
										<FormField
											control={form.control}
											name="hidden"
											render={({ field }) => (
												<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
													<FormControl>
														<input
															type="checkbox"
															checked={field.value}
															onChange={field.onChange}
															className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
														/>
													</FormControl>
													<div className="space-y-1 leading-none">
														<FormLabel>Hidden</FormLabel>
														<FormDescription>
															Hide this game from the public site
														</FormDescription>
													</div>
												</FormItem>
											)}
										/>
									</div>
								</div>

								{/* Media Section */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="font-semibold text-xl tracking-tight">
											Media
										</h3>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												append({ type: MediaType.Video, link: "" })
											}
										>
											<PlusCircle className="mr-2 h-4 w-4" />
											Add Media
										</Button>
									</div>

									{fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-end gap-4 rounded-lg border p-4"
										>
											<FormField
												control={form.control}
												name={`media.${index}.type`}
												render={({ field }) => (
													<FormItem className="flex-1">
														<FormLabel>Media Type</FormLabel>
														<Select
															onValueChange={(value) =>
																field.onChange(value as MediaType)
															}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select media type" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value={MediaType.Video}>
																	Video
																</SelectItem>
																<SelectItem value={MediaType.Image}>
																	Image
																</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name={`media.${index}.link`}
												render={({ field }) => (
													<FormItem className="flex-[2]">
														<FormLabel>URL</FormLabel>
														<FormControl>
															<Input placeholder="https://..." {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => remove(index)}
												disabled={fields?.length === 1}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>
							</div>

							<div className="flex justify-end pt-6">
								<Button
									type="submit"
									disabled={updateGameMutation.isPending}
									className="relative min-w-[120px]"
								>
									{updateGameMutation.isPending ? (
										<>
											<span className="opacity-0">Update Game</span>
											<span className="absolute inset-0 flex items-center justify-center">
												Updating...
											</span>
										</>
									) : (
										"Update Game"
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
