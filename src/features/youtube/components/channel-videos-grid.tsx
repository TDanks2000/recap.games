"use client";

import { ExternalLink, Wifi, WifiOff } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { VideoCardSkeleton } from "@/components/skeletons/video-card-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectConference } from "@/features/conferences/components/select-conference";
import { cn } from "@/lib";
import { api, type RouterOutputs } from "@/trpc/react";
import { VideoCardDialog } from "./video-card-dialog";

interface Props {
	channelId: string;
	initialPageToken?: string;
	maxResults: number;
}

type Conference = RouterOutputs["conference"]["getAll"][number];

export function ChannelVideosGrid({ channelId, maxResults }: Props) {
	const router = useRouter();
	const pathname = usePathname();
	const currentSearchParams = useSearchParams();

	const [selectedConference, setSelectedConference] = useState<Conference>();
	const [isLiveEnabled, setIsLiveEnabled] = useState(true);

	const pageTokenFromUrl = currentSearchParams.get("page_token");

	const getChannelVideosQuery = api.youtube.getChannelVideos.useQuery(
		{
			channelId: channelId,
			maxResults: maxResults,
			pageToken: pageTokenFromUrl ?? undefined,
		},
		{
			enabled: !!channelId,
			refetchOnWindowFocus: false,
			refetchInterval: isLiveEnabled ? 30_000 : false,
		},
	);

	const getChannelInfoQuery = api.youtube.getChannelInfo.useQuery(
		{ channelId },
		{
			enabled: !!channelId,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000, // 5 minutes
		},
	);

	const {
		data: videosPageData,
		isLoading: isLoadingVideos,
		isError,
		error: queryError,
		isFetching,
	} = getChannelVideosQuery;

	const { data: channelData, isLoading: isLoadingChannel } =
		getChannelInfoQuery;

	const createQueryStringWithPageToken = useCallback(
		(tokenValue: string | undefined) => {
			const params = new URLSearchParams(currentSearchParams.toString());
			params.set("channel_id", channelId);
			params.set("max_results", maxResults.toString());

			if (tokenValue) {
				params.set("page_token", tokenValue);
			} else {
				params.delete("page_token");
			}
			return params.toString();
		},
		[currentSearchParams, channelId, maxResults],
	);

	const handleNextPage = () => {
		if (
			videosPageData &&
			!("error" in videosPageData) &&
			videosPageData.nextPageToken
		) {
			const query = createQueryStringWithPageToken(
				videosPageData.nextPageToken,
			);
			router.push(`${pathname}?${query}`, { scroll: false });
		}
	};

	const handlePrevPage = () => {
		if (
			videosPageData &&
			!("error" in videosPageData) &&
			videosPageData.prevPageToken
		) {
			const query = createQueryStringWithPageToken(
				videosPageData.prevPageToken,
			);
			router.push(`${pathname}?${query}`, { scroll: false });
		} else if (
			videosPageData &&
			!("error" in videosPageData) &&
			!videosPageData.prevPageToken &&
			pageTokenFromUrl
		) {
			const query = createQueryStringWithPageToken(undefined);
			router.push(`${pathname}?${query}`, { scroll: false });
		}
	};

	const isLoading = isLoadingVideos || isLoadingChannel;

	if (isLoading || (isFetching && !videosPageData)) {
		return (
			<div className="flex flex-col gap-6">
				{/* Channel info skeleton */}
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<Skeleton className="h-20 w-20 rounded-full" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-4 w-full max-w-2xl" />
							</div>
							<Skeleton className="h-10 w-28" />
						</div>
					</CardContent>
				</Card>

				<div className="flex items-center justify-between gap-4 rounded-lg border bg-card/50 p-4 shadow-sm">
					<Skeleton className="h-10 w-40" />
					<Skeleton className="h-10 w-48" />
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{Array.from({ length: maxResults }).map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: This is fine for a skeeton
						<VideoCardSkeleton key={index} />
					))}
				</div>
				<div className="mt-4 flex items-center justify-center gap-4">
					<Skeleton className="h-10 w-28" />
					<Skeleton className="h-10 w-28" />
				</div>
			</div>
		);
	}

	const apiErrorFromData =
		videosPageData && "error" in videosPageData && videosPageData.error
			? videosPageData.error.message
			: null;
	const displayError = isError ? queryError?.message : apiErrorFromData;

	if (displayError) {
		return (
			<div className="mt-4 text-center text-red-500">
				{displayError || "An error occurred while fetching videos."}
			</div>
		);
	}

	const videos = videosPageData?.videos || [];
	const channel = channelData && !("error" in channelData) ? channelData : null;

	if (
		videos.length === 0 &&
		!(videosPageData && "error" in videosPageData) &&
		!videosPageData?.nextPageToken &&
		!videosPageData?.prevPageToken
	) {
		return (
			<div className="flex flex-col gap-6">
				{/* Show channel info even when no videos */}
				{channel && (
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-4">
								{channel.thumbnailUrl && (
									<Image
										src={channel.thumbnailUrl}
										alt={channel.title}
										width={80}
										height={80}
										className="rounded-full"
									/>
								)}
								<div className="flex-1">
									<h2 className="font-bold text-2xl">{channel.title}</h2>
									{channel.description && (
										<p className="mt-2 line-clamp-2 text-muted-foreground">
											{channel.description}
										</p>
									)}
								</div>
								<Button variant="outline" asChild>
									<a
										href={channel.channelUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2"
									>
										<ExternalLink className="h-4 w-4" />
										View Channel
									</a>
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
				<div className="mt-8 text-center text-muted-foreground">
					No videos found for this channel.
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Channel Info Card */}
			{channel && (
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							{channel.thumbnailUrl && (
								<Image
									src={channel.thumbnailUrl}
									alt={channel.title}
									width={80}
									height={80}
									className="rounded-full"
								/>
							)}
							<div className="flex-1">
								<h2 className="font-bold text-2xl">{channel.title}</h2>
								{channel.description && (
									<p className="mt-2 line-clamp-2 text-muted-foreground">
										{channel.description}
									</p>
								)}
							</div>
							<Button variant="outline" asChild>
								<a
									href={channel.channelUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2"
								>
									<ExternalLink className="h-4 w-4" />
									View Channel
								</a>
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Controls */}
			<div className="flex items-center justify-between gap-4 rounded-lg border bg-card/50 p-4 shadow-sm">
				<div className="flex items-center gap-3">
					<div
						className={cn(
							"flex items-center gap-2 rounded-full px-4 py-1.5 transition-all",
							isLiveEnabled
								? "bg-red-500/10 text-red-500"
								: "bg-muted text-muted-foreground",
						)}
					>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6"
							onClick={() => setIsLiveEnabled((prev) => !prev)}
							aria-label={
								isLiveEnabled ? "Disable live updates" : "Enable live updates"
							}
						>
							{isLiveEnabled ? <WifiOff /> : <Wifi />}
						</Button>

						{isLiveEnabled && (
							<span className="relative flex h-2 w-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
								<span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
							</span>
						)}
						<span className="font-medium text-sm">
							{isFetching && isLiveEnabled
								? "Updating..."
								: isLiveEnabled
									? "Live"
									: "Updates paused"}
						</span>
					</div>
				</div>

				<SelectConference
					placeholder="Select conference to auto-associate"
					onSelect={(conference) => {
						setSelectedConference(conference);
					}}
				/>
			</div>

			{/* Videos Grid */}
			{videos.length > 0 && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{videos.map((video) => (
						<VideoCardDialog
							key={video.id}
							video={video}
							conference={selectedConference}
						/>
					))}
				</div>
			)}

			{/* Pagination */}
			{((videosPageData &&
				!("error" in videosPageData) &&
				(videosPageData.prevPageToken || videosPageData.nextPageToken)) ||
				pageTokenFromUrl) && (
				<div className="mt-4 flex items-center justify-center gap-4">
					<Button
						onClick={handlePrevPage}
						disabled={
							isFetching ||
							!(
								videosPageData &&
								!("error" in videosPageData) &&
								(videosPageData.prevPageToken || pageTokenFromUrl)
							)
						}
						variant="outline"
					>
						Previous Page
					</Button>
					<Button
						onClick={handleNextPage}
						disabled={
							isFetching ||
							!(
								videosPageData &&
								!("error" in videosPageData) &&
								videosPageData.nextPageToken
							)
						}
						variant="outline"
					>
						Next Page
					</Button>
				</div>
			)}
		</div>
	);
}
