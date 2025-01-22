import { ContentScriptMessagingClient } from "@shared/client/client";
import TrashIcon from "@shared/ui/TrashIcon/TrashIcon";
import type React from "react";
import { useCallback } from "react";
import { dateNowInUs } from "shared/dateNowInUs";
import { ExtensionMessageType } from "types/extensionMessage";
import type { VideoType } from "types/video.type";

interface VideoProps {
	video: VideoType;
	isAdmin: boolean;
	number?: number;
	type: "number" | "last" | "current";
}

const Video: React.FC<VideoProps> = ({
	video,
	isAdmin,
	number,
	type,
}: VideoProps) => {
	const deleteVideo = useCallback(() => {
		if (type !== "number" || !isAdmin) return;
		ContentScriptMessagingClient.sendMessage(
			ExtensionMessageType.REMOVE_VIDEO,
			video.id,
		);
	}, [video.id, isAdmin, type]);

	const playVideo = useCallback(() => {
		if (type === "current" || !isAdmin) return;
		ContentScriptMessagingClient.sendMessage(
			ExtensionMessageType.UPDATE_PLAYER_VIDEO,
			{
				videoId: video.id,
				updatedAt: dateNowInUs(),
			},
		);
	}, [video.id, isAdmin, type]);

	console.log("video rerendered");

	return (
		<div
			title={isAdmin && type !== "current" ? "Play video" : undefined}
			className={`${type === "last" ? "opacity-60 hover:opacity-100" : null} ${type === "current" ? "bg-background-active" : null} ${isAdmin ? "hover:cursor-pointer" : null} select-none hover:bg-spec-badge-chip-background group flex items-stretch p-[4px_8px_4px_0]`}
			onClick={isAdmin && type !== "current" ? playVideo : undefined}
			onKeyDown={isAdmin && type !== "current" ? playVideo : undefined}
		>
			<div className="flex items-stretch">
				<div className="flex">
					<span className="m-auto w-[24px] p-0 text-center font-secondary text-[1.2rem] font-[400] leading-[1.5rem] text-text-secondary">
						{number ?? null}
						{type === "current" ? "▶" : null}
					</span>
				</div>
				<div>
					<div
						className="h-[56px] w-[100px] rounded-lg bg-cover bg-center bg-no-repeat"
						style={{ backgroundImage: `url(${video.thumbnail_url})` }}
					/>
				</div>
				<article className="p-[0_8px]">
					<h4 className="m-[0_0_4px] line-clamp-2 max-h-16 overflow-ellipsis whitespace-normal p-0 text-left font-secondary text-[1.4rem] font-[500] leading-[2rem] text-text-primary">
						{video.title}
					</h4>
					<p className="text-left font-secondary text-[1.2rem] font-[400] leading-[1.8rem] text-text-secondary">
						{video.author_name}
					</p>
				</article>
			</div>

			{isAdmin && type === "number" && (
				<div className="ml-auto flex items-center justify-self-end hover:cursor-default">
					<button
						type="button"
						title="Remove video"
						className="m-0 flex h-[40px] w-[40px] items-center justify-center border-none bg-transparent p-0 hover:cursor-pointer"
						onClick={deleteVideo}
					>
						<div className="hidden h-[20px] w-[20px] text-icon-shape-color group-hover:block">
							<TrashIcon />
						</div>
					</button>
				</div>
			)}
		</div>
	);
};

export default Video;
