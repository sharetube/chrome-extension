export type PlayerStateType = {
	playback_rate: number;
	is_playing: boolean;
	current_time: number;
	updated_at: number;
};

export type PlayerType = {
	state: PlayerStateType;
	is_ended: boolean;
	version: number;
};

export type PlayerElement = HTMLVideoElement;
