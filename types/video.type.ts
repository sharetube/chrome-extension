export type videoIdType = number;

export type VideoType = {
	id: videoIdType;
	url: string;
	title: string;
	author_name: string;
	thumbnail_url: string;
};

export type PlaylistType = {
	videos: VideoType[];
	last_video: VideoType | null;
	current_video: VideoType;
	version: number;
};
