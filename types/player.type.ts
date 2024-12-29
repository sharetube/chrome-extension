export type PlayerStateType = {
    playback_rate: number;
    is_playing: boolean;
    current_time: number;
    //? remove updated_at
    updated_at: number;
};

export type PlayerType = PlayerStateType & {
    video_url: string;
};

export type PlayerElement = HTMLVideoElement;
