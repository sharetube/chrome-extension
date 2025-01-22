import type { MemberType } from "./member.type";
import type { PlayerType } from "./player.type";
import type { PlaylistType } from "./video.type";

export type RoomType = {
	id: string;
	player: PlayerType;
	playlist: PlaylistType;
	members: MemberType[];
};
