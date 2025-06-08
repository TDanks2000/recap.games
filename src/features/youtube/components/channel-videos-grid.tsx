"use client";

import { Dot, Wifi, WifiOff } from "lucide-react"; // <-- Import icons
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { VideoCardSkeleton } from "@/components/skeletons/video-card-skeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectConference } from "@/features/conferences/components/select-conference";
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

	// --- START: State for new features ---
	const [selectedConference, setSelectedConference] = useState<Conference>();
	const [isLiveEnabled, setIsLiveEnabled] = useState(true); // State for the toggle
	// --- END: State for new features ---

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
			// The refetch interval is now controlled by our state
			refetchInterval: isLiveEnabled ? 30_000 : false,
		},
	);

	const {
		data: videosPageData,
		isLoading,
		isError,
		error: queryError,
		isFetching,
	} = getChannelVideosQuery;

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

	if (isLoading || (isFetching && !videosPageData)) {
		return (
			<div className="flex flex-col gap-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{Array.from({ length: maxResults }).map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: fine for skeli
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

	if (
		videos.length === 0 &&
		!(videosPageData && "error" in videosPageData) &&
		!videosPageData?.nextPageToken &&
		!videosPageData?.prevPageToken
	) {
		return (
			<div className="mt-8 text-center text-muted-foreground">
				No videos found for this channel.
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* --- START: Controls Area --- */}
			<div className="flex items-center justify-end gap-4">
				<SelectConference
					placeholder="Select a conference"
					onSelect={(conference) => {
						setSelectedConference(conference);
					}}
				/>
				<div className="flex items-center gap-2">
					<span
						className={`text-muted-foreground text-sm transition-colors ${
							isFetching && isLiveEnabled ? "text-blue-500" : ""
						}`}
					>
						{isLiveEnabled && (
							<Dot className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
						)}
						{isFetching && isLiveEnabled
							? "Checking..."
							: isLiveEnabled
								? "Live"
								: "Paused"}
					</span>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsLiveEnabled((prev) => !prev)}
						aria-label={
							isLiveEnabled ? "Disable live updates" : "Enable live updates"
						}
					>
						{isLiveEnabled ? (
							<WifiOff className="h-4 w-4" />
						) : (
							<Wifi className="h-4 w-4" />
						)}
					</Button>
				</div>
			</div>
			{/* --- END: Controls Area --- */}

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
