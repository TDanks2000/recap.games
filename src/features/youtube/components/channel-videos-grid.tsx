"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { YouTubeVideo } from "@/@types/youtube";
import { VideoCardSkeleton } from "@/components/skeletons/video-card-skeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { VideoCardDialog } from "./video-card-dialog";

interface Props {
	channelId: string;
	initialPageToken?: string;
	maxResults: number;
}

export function ChannelVideosGrid({
	channelId,
	initialPageToken,
	maxResults,
}: Props) {
	const router = useRouter();
	const pathname = usePathname();
	const currentSearchParams = useSearchParams();

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
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{Array.from({ length: maxResults }).map((_, index) => (
						<VideoCardSkeleton key={index} />
					))}
				</div>
				<div className="flex justify-center items-center gap-4 mt-4">
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
			<div className="text-red-500 text-center mt-4">
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
			<div className="text-center text-muted-foreground mt-8">
				No videos found for this channel.
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{videos.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{videos.map((video) => (
						<VideoCardDialog key={video.id} video={video as YouTubeVideo} />
					))}
				</div>
			)}

			{((videosPageData &&
				!("error" in videosPageData) &&
				(videosPageData.prevPageToken || videosPageData.nextPageToken)) ||
				pageTokenFromUrl) && (
				<div className="flex justify-center items-center gap-4 mt-4">
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
