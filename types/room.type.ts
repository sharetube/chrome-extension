import { MemberType } from "./member.type";
import { PlayerType } from "./player.type";
import { PlaylistType } from "./video.type";

export type RoomType = {
    id: string;
    player: PlayerType;
    playlist: PlaylistType;
    members: MemberType[];
};
