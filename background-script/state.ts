import { RoomType } from "types/room.type";

interface State {
    room: RoomType;
    is_admin: boolean;
}

export const globalState: State = {
    is_admin: false,
    room: {
        id: "",
        playlist: {
            videos: [],
            last_video: null,
        },
        player: {
            video_url: "",
            current_time: 0,
            is_playing: false,
            playback_rate: 1,
            updated_at: 0,
        },
        members: [],
    },
};
