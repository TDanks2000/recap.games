import type {
	YouTubeChannel,
	YouTubeChannelResponse,
	YouTubeChannelVideosPage,
	YouTubeErrorResponse,
	YouTubePlaylistItemsResponse,
	YouTubeSearchResponse,
	YouTubeVideo,
	YouTubeVideoItem,
	YouTubeVideosResponse,
} from "@/@types/youtube";
import { env } from "@/env";

export class Youtube {
	private readonly apiKey: string;
	private readonly baseUrl = "https://www.googleapis.com/youtube/v3";

	constructor() {
		this.apiKey = env.GOOGLE_API_KEY;
	}

	/**
	 * Generic method to fetch data from YouTube API
	 */
	private async fetchApi<T extends object>(
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
			return this.createErrorResponse(
				error instanceof Error ? error.message : "Unknown error",
			);
		}
	}

	/**
	 * Helper to create consistent error responses
	 */
	private createErrorResponse(message: string, code = 0): YouTubeErrorResponse {
		return {
			error: {
				code,
				message: message || "Failed to fetch from YouTube API.",
				errors: [{ message }],
			},
		};
	}

	/**
	 * Helper to check if a response is an error
	 */
	private isErrorResponse<T extends object>(
		response: T | YouTubeErrorResponse,
	): response is YouTubeErrorResponse {
		return "error" in response;
	}

	/**
	 * Resolves a channel identifier (handle or ID) to a channel ID
	 */
	private async getChannelIdFromIdentifier(
		identifier: string,
	): Promise<string | YouTubeErrorResponse> {
		// If it's already a channel ID, return it
		if (identifier.startsWith("UC") && identifier.length > 20) {
			return identifier;
		}

		// Search for the channel by handle
		const query = identifier.startsWith("@") ? identifier : `@${identifier}`;
		const response = await this.fetchApi<YouTubeSearchResponse>("search", {
			part: "id",
			q: query,
			type: "channel",
			maxResults: "1",
		});

		if (this.isErrorResponse(response)) {
			return response;
		}

		const channelId = response.items?.[0]?.id?.channelId;
		if (!channelId) {
			return this.createErrorResponse(
				`Channel with handle '${identifier}' not found.`,
				404,
			);
		}

		return channelId;
	}

	/**
	 * Fetches detailed information for a batch of video IDs
	 */
	private async getVideoDetails(
		videoIds: string[],
	): Promise<Map<string, YouTubeVideoItem> | YouTubeErrorResponse> {
		if (videoIds.length === 0) {
			return new Map();
		}

		const response = await this.fetchApi<YouTubeVideosResponse>("videos", {
			part: "snippet,liveStreamingDetails",
			id: videoIds.join(","),
			maxResults: "50",
		});

		if (this.isErrorResponse(response)) {
			return response;
		}

		const videoDetailsMap = new Map<string, YouTubeVideoItem>();
		for (const item of response.items || []) {
			videoDetailsMap.set(item.id, item);
		}

		return videoDetailsMap;
	}

	/**
	 * Extracts the best available thumbnail URL
	 */
	private getBestThumbnailUrl(thumbnails?: {
		high?: { url: string };
		medium?: { url: string };
		default?: { url: string };
	}): string {
		return (
			thumbnails?.high?.url ||
			thumbnails?.medium?.url ||
			thumbnails?.default?.url ||
			""
		);
	}

	/**
	 * Determines if a video is a stream based on its details
	 */
	private isVideoStream(videoDetails?: YouTubeVideoItem): boolean {
		if (!videoDetails) return false;

		const broadcastContent = videoDetails.snippet.liveBroadcastContent;
		const isLiveOrUpcoming =
			broadcastContent === "live" || broadcastContent === "upcoming";
		const hasStreamingDetails = !!videoDetails.liveStreamingDetails;

		return isLiveOrUpcoming || hasStreamingDetails;
	}

	/**
	 * Fetches channel information by handle or channel ID
	 */
	async getChannelInfo(
		channelIdentifier: string,
	): Promise<YouTubeChannel | YouTubeErrorResponse> {
		const channelIdResult =
			await this.getChannelIdFromIdentifier(channelIdentifier);

		if (typeof channelIdResult !== "string") {
			return channelIdResult;
		}

		const response = await this.fetchApi<YouTubeChannelResponse>("channels", {
			part: "snippet,statistics",
			id: channelIdResult,
		});

		if (this.isErrorResponse(response)) {
			return response;
		}

		if (!response.items?.[0]) {
			return this.createErrorResponse(
				`Channel with ID '${channelIdResult}' not found.`,
				404,
			);
		}

		const item = response.items[0];
		return {
			id: channelIdResult,
			title: item.snippet.title,
			description: item.snippet.description || "",
			thumbnailUrl: this.getBestThumbnailUrl(item.snippet.thumbnails),
			channelUrl: `https://www.youtube.com/channel/${channelIdResult}`,
		};
	}

	/**
	 * Fetches videos from a channel's uploads playlist
	 */
	async getChannelVideos(
		channelIdentifier: string,
		maxResults = 10,
		pageToken?: string,
	): Promise<YouTubeChannelVideosPage | YouTubeErrorResponse> {
		// Resolve channel ID
		const channelIdResult =
			await this.getChannelIdFromIdentifier(channelIdentifier);
		if (typeof channelIdResult !== "string") {
			return channelIdResult;
		}

		// Get the uploads playlist ID
		const channelResponse = await this.fetchApi<YouTubeChannelResponse>(
			"channels",
			{
				part: "contentDetails",
				id: channelIdResult,
			},
		);

		if (this.isErrorResponse(channelResponse) || !channelResponse.items?.[0]) {
			return this.isErrorResponse(channelResponse)
				? channelResponse
				: this.createErrorResponse(
						`Channel '${channelIdResult}' not found.`,
						404,
					);
		}

		const uploadsPlaylistId =
			channelResponse.items[0].contentDetails?.relatedPlaylists?.uploads;
		if (!uploadsPlaylistId) {
			return this.createErrorResponse(
				`Could not find the uploads playlist for channel ID '${channelIdResult}'.`,
				404,
			);
		}

		// Fetch playlist items
		const playlistParams: Record<string, string> = {
			part: "snippet,contentDetails",
			playlistId: uploadsPlaylistId,
			maxResults: maxResults.toString(),
		};

		if (pageToken) {
			playlistParams.pageToken = pageToken;
		}

		const playlistResponse = await this.fetchApi<YouTubePlaylistItemsResponse>(
			"playlistItems",
			playlistParams,
		);

		if (this.isErrorResponse(playlistResponse)) {
			return playlistResponse;
		}

		if (!playlistResponse.items || playlistResponse.items.length === 0) {
			return { videos: [] };
		}

		// Fetch video details to determine stream status
		const videoIds = playlistResponse.items.map(
			(item) => item.snippet.resourceId.videoId,
		);
		const videoDetailsResult = await this.getVideoDetails(videoIds);

		if (this.isErrorResponse(videoDetailsResult)) {
			return videoDetailsResult;
		}

		// Map playlist items to video objects
		const videos: YouTubeVideo[] = playlistResponse.items.map(
			(item): YouTubeVideo => {
				const videoId = item.snippet.resourceId.videoId;
				const videoDetails = videoDetailsResult.get(videoId);

				return {
					id: videoId,
					title: item.snippet.title,
					description: item.snippet.description,
					thumbnailUrl: this.getBestThumbnailUrl(item.snippet.thumbnails),
					publishedAt: item.snippet.publishedAt,
					videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
					type: this.isVideoStream(videoDetails) ? "stream" : "video",
				};
			},
		);

		return {
			videos,
			nextPageToken: playlistResponse.nextPageToken,
			prevPageToken: playlistResponse.prevPageToken,
		};
	}

	/**
	 * Searches for channels by query string
	 */
	async searchChannels(
		query: string,
		maxResults = 5,
	): Promise<YouTubeChannel[] | YouTubeErrorResponse> {
		const response = await this.fetchApi<YouTubeSearchResponse>("search", {
			part: "snippet",
			q: query,
			type: "channel",
			maxResults: maxResults.toString(),
		});

		if (this.isErrorResponse(response)) {
			return response;
		}

		if (!response.items) {
			return [];
		}

		return response.items.map(
			(item): YouTubeChannel => ({
				id: item.snippet.channelId,
				title: item.snippet.channelTitle,
				description: item.snippet.description,
				thumbnailUrl: this.getBestThumbnailUrl(item.snippet.thumbnails),
				channelUrl: `https://www.youtube.com/channel/${item.snippet.channelId}`,
			}),
		);
	}
}
