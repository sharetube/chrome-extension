import { RoomType } from "types/room.type";

type State = {
    room: RoomType;
    isAdmin: boolean;
    updatePlayerStateRid: string;
    waitingForPrimaryTab: boolean;
};

export const defaultState: State = {
    isAdmin: false,
    updatePlayerStateRid: "",
    waitingForPrimaryTab: false,
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
        player: {
            state: {
                current_time: 0,
                is_playing: false,
                playback_rate: 1,
                updated_at: 0,
            },
            is_ended: false,
            version: 0,
        },
        members: [],
    },
};

export const globalState: State = defaultState;

export function resetState(): void {
    Object.assign(globalState, defaultState);
}
