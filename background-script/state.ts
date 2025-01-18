import { RoomType } from "types/room.type";

type State = {
    room: RoomType;
    is_admin: boolean;
};

export const defaultState: State = {
    is_admin: false,
    room: {
        id: "",
        playlist: {
            videos: [],
            last_video: null,
            current_video: {
                id: 0,
                url: "",
                title: "",
                author_name: "",
                thumbnail_url: "",
            },
            version: 0,
        },
        is_video_ended: false,
        player: {
            current_time: 0,
            is_playing: false,
            playback_rate: 1,
            updated_at: 0,
        },
        members: [],
    },
};

export const globalState: State = defaultState;

export function resetState(): void {
    Object.assign(globalState, defaultState);
}
