export type videoIdType = string;

export type VideoType = {
    id: videoIdType;
    url: string;
};

export type PlaylistType = {
    videos: VideoType[];
    last_video: VideoType | null;
};
