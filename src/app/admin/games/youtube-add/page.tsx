import { ChannelVideosGrid } from "@/features/youtube/components/channel-videos-grid";
import { SearchChannels } from "@/features/youtube/components/search-channels";

interface Props {
	searchParams: {
		channel_search?: string;
		channel_id?: string;
		page_token?: string;
		max_results?: string;
	};
}

export default async function YoutubeTestPage({ searchParams }: Props) {
	const channelSearchQuery = searchParams.channel_search;
	const currentSelectedChannelIdForSearch = searchParams.channel_id;

	const channelIdForVideos = searchParams.channel_id;
	const pageTokenForVideos = searchParams.page_token;
	const maxResultsParam = searchParams.max_results
		? parseInt(searchParams.max_results, 10)
		: 25;
	const maxResultsForVideos = isNaN(maxResultsParam) ? 25 : maxResultsParam;

	return (
		<main className="container mx-auto flex min-h-screen flex-col items-center gap-8 p-4">
			<div className="w-full flex flex-col items-center">
				<SearchChannels
					search={channelSearchQuery}
					id={currentSelectedChannelIdForSearch}
				/>
			</div>

			<div className="w-full">
				{channelIdForVideos ? (
					<ChannelVideosGrid
						channelId={channelIdForVideos}
						initialPageToken={pageTokenForVideos}
						maxResults={maxResultsForVideos}
					/>
				) : (
					<div className="text-center text-muted-foreground opacity-60 mt-8">
						<span>Search for a channel and select it to view its videos.</span>
					</div>
				)}
			</div>
		</main>
	);
}
