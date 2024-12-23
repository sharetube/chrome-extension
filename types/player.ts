export interface PlayerState {
    playback_rate: number;
    is_playing: boolean;
    current_time: number;
    updated_at: number;
}

export type PlayerElement = HTMLVideoElement;
