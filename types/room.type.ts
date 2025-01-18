import { MemberType } from "./member.type";
import { PlayerType } from "./player.type";
import { PlaylistType } from "./video.type";

export type RoomType = {
    id: string;
    player: PlayerType;
    is_video_ended: boolean;
    playlist: PlaylistType;
    members: MemberType[];
};
