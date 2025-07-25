/** biome-ignore-all lint/suspicious/noExplicitAny: TODO: fix later */
import type {
	YouTubeChannel,
	YouTubeChannelVideosPage,
	YouTubeErrorResponse,
	YouTubeVideo,
} from "@/@types/youtube";
import { env } from "@/env";

export class Youtube {
	private apiKey: string;
	private baseUrl = "https://www.googleapis.com/youtube/v3";

	constructor() {
		this.apiKey = env.GOOGLE_API_KEY;
	}

	private async fetchApi<T>(
		endpoint: string,
		params: Record<string, string>,
	): Promise<T | YouTubeErrorResponse> {
		const queryParams = new URLSearchParams({
			key: this.apiKey,
			...params,
		});

		try {
			const response = await fetch(
				`${this.baseUrl}/${endpoint}?${queryParams.toString()}`,
			);
			if (!response.ok) {
				const errorData: YouTubeErrorResponse = await response.json();
				console.error("YouTube API Error:", errorData);
				return errorData;
			}
			return (await response.json()) as T;
		} catch (error) {
			console.error("Failed to fetch from YouTube API:", error);
			return {
				error: {
					code: 0,
					message: "Failed to fetch from YouTube API.",
					errors: [
						{
							message: error instanceof Error ? error.message : "Unknown error",
						},
					],
				},
			};
		}
	}

	private async getChannelIdFromIdentifier(
		identifier: string,
	): Promise<string | YouTubeErrorResponse> {
		if (identifier.startsWith("UC") && identifier.length > 20) {
			return identifier;
		}
		const query = identifier.startsWith("@") ? identifier : `@${identifier}`;
		const params = {
			part: "id",
			q: query,
			type: "channel",
			maxResults: "1",
		};
		const response = await this.fetchApi<any>("search", params);
		if ("error" in response) {
			return response;
		}
		if (
			response.items &&
			response.items.length > 0 &&
			response.items[0].id?.channelId
		) {
			return response.items[0].id.channelId;
		}
		return {
			error: {
				code: 404,
				message: `Channel with handle '${identifier}' not found.`,
				errors: [],
			},
		};
	}

	/**
	 * Fetches detailed information for a batch of video IDs.
	 */
	private async getVideoDetails(
		videoIds: string[],
	): Promise<Map<string, any> | YouTubeErrorResponse> {
		if (videoIds.length === 0) {
			return new Map();
		}

		const params = {
			part: "snippet,liveStreamingDetails",
			id: videoIds.join(","),
			maxResults: "50",
		};

		const response = await this.fetchApi<any>("videos", params);

		if ("error" in response) {
			return response;
		}

		const videoDetailsMap = new Map<string, any>();
		if (response.items) {
			for (const item of response.items) {
				videoDetailsMap.set(item.id, item);
			}
		}
		return videoDetailsMap;
	}

	async getChannelInfo(
		channelIdentifier: string,
	): Promise<YouTubeChannel | YouTubeErrorResponse> {
		const channelIdResult =
			await this.getChannelIdFromIdentifier(channelIdentifier);

		if (typeof channelIdResult !== "string") {
			return channelIdResult;
		}
		const channelId = channelIdResult;

		const params = {
			part: "snippet,statistics",
			id: channelId,
		};

		const response = await this.fetchApi<any>("channels", params);

		if ("error" in response) {
			return response;
		}

		if (!response.items || response.items.length === 0) {
			return {
				error: {
					code: 404,
					message: `Channel with ID '${channelId}' not found.`,
					errors: [],
				},
			};
		}

		const item = response.items[0];
		return {
			id: channelId,
			title: item.snippet.title,
			description: item.snippet.description || "",
			thumbnailUrl:
				item.snippet.thumbnails?.high?.url ||
				item.snippet.thumbnails?.medium?.url ||
				item.snippet.thumbnails?.default?.url ||
				"",
			channelUrl: `https://www.youtube.com/channel/${channelId}`,
		};
	}

	async getChannelVideos(
		channelIdentifier: string,
		maxResults = 10,
		pageToken?: string,
	): Promise<YouTubeChannelVideosPage | YouTubeErrorResponse> {
		const channelIdResult =
			await this.getChannelIdFromIdentifier(channelIdentifier);

		if (typeof channelIdResult !== "string") {
			return channelIdResult;
		}
		const channelId = channelIdResult;

		const channelDetailsParams = {
			part: "contentDetails",
			id: channelId,
		};
		const channelResponse = await this.fetchApi<any>(
			"channels",
			channelDetailsParams,
		);

		if (
			"error" in channelResponse ||
			!channelResponse.items ||
			channelResponse.items.length === 0
		) {
			return channelResponse as YouTubeErrorResponse;
		}

		const uploadsPlaylistId =
			channelResponse.items[0]?.contentDetails?.relatedPlaylists?.uploads;

		if (!uploadsPlaylistId) {
			return {
				error: {
					code: 404,
					message: `Could not find the uploads playlist for channel ID '${channelId}'.`,
					errors: [],
				},
			};
		}

		const playlistItemsParams: Record<string, string> = {
			part: "snippet,contentDetails",
			playlistId: uploadsPlaylistId,
			maxResults: maxResults.toString(),
		};

		if (pageToken) {
			playlistItemsParams.pageToken = pageToken;
		}

		const playlistResponse = await this.fetchApi<any>(
			"playlistItems",
			playlistItemsParams,
		);

		if ("error" in playlistResponse) {
			return playlistResponse;
		}

		if (!playlistResponse.items || playlistResponse.items.length === 0) {
			return {
				videos: [],
			};
		}

		const videoIds = playlistResponse.items.map(
			(item: any) => item.snippet.resourceId.videoId,
		);
		const videoDetailsResult = await this.getVideoDetails(videoIds);

		if ("error" in videoDetailsResult) {
			return videoDetailsResult;
		}
		const videoDetailsMap = videoDetailsResult;

		const videos: YouTubeVideo[] = playlistResponse.items.map(
			(item: any): YouTubeVideo => {
				const videoId = item.snippet.resourceId.videoId;
				const videoDetails = videoDetailsMap.get(videoId);

				let videoType: "video" | "stream" = "video";

				if (videoDetails) {
					const isLive =
						videoDetails.snippet.liveBroadcastContent === "live" ||
						videoDetails.snippet.liveBroadcastContent === "upcoming";
					const wasLive = !!videoDetails.liveStreamingDetails;

					if (isLive || wasLive) {
						videoType = "stream";
					}
				}

				return {
					id: videoId,
					title: item.snippet.title,
					description: item.snippet.description,
					thumbnailUrl:
						item.snippet.thumbnails?.high?.url ||
						item.snippet.thumbnails?.default?.url,
					publishedAt: item.snippet.publishedAt,
					videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
					type: videoType,
				};
			},
		);

		return {
			videos,
			nextPageToken: playlistResponse.nextPageToken,
			prevPageToken: playlistResponse.prevPageToken,
		};
	}

	async searchChannels(
		query: string,
		maxResults = 5,
	): Promise<YouTubeChannel[] | YouTubeErrorResponse> {
		const params = {
			part: "snippet",
			q: query,
			type: "channel",
			maxResults: maxResults.toString(),
		};

		const response = await this.fetchApi<any>("search", params);

		if ("error" in response) {
			return response;
		}

		if (!response.items) {
			return [];
		}

		return response.items.map((item: any): YouTubeChannel => {
			const channelId = item.snippet.channelId;
			return {
				id: channelId,
				title: item.snippet.channelTitle,
				description: item.snippet.description,
				thumbnailUrl:
					item.snippet.thumbnails?.high?.url ||
					item.snippet.thumbnails?.default?.url,
				channelUrl: `https://www.youtube.com/channel/${channelId}`,
			};
		});
	}
}
