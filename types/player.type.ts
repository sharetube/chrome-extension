export type PlayerType = {
    playback_rate: number;
    is_playing: boolean;
    is_ended: boolean;
    current_time: number;
    updated_at: number;
};

export type PlayerElement = HTMLVideoElement;
