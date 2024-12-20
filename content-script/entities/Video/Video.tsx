import useVideoData from "./hooks/useVideoData";
import data from "./types/data";
import { ContentScriptMessagingClient } from "@shared/client/client";
import Trash from "@shared/ui/Trash/Trash";
import React from "react";
import { memo } from "react";
import { ExtensionMessageType } from "types/extensionMessage";

interface Base {
    videoUrl: string;
    videoId: string;
    actions: boolean;
    number?: number;
    previous?: boolean;
    current?: boolean;
}

interface Previous extends Base {
    previous: true;
    current?: never;
    number?: never;
}
interface Current extends Base {
    current: true;
    previous?: never;
    number?: never;
}
interface Common extends Base {
    previous?: never;
    current?: never;
    number: number;
}

type VideoProps = Current | Previous | Common;

const LoadingSkeleton: React.FC = () => (
    <li className="flex items-stretch p-[4px_8px_4px_0] animate-pulse">
        <div className="w-[24px]"></div>
        <div>
            <div className="h-[56px] w-[100px] rounded-lg bg-background-primary"></div>
        </div>
        <div className="p-[0_8px]">
            <h4 className="m-[0_0_4px] h-[34px] w-[195px] rounded-lg bg-background-primary p-0"></h4>
            <p className="h-[18px] w-[195px] rounded-lg bg-background-primary p-0 m-0"></p>
        </div>
    </li>
);

const VideoContent: React.FC<VideoProps & { videoData: data }> = memo(
    ({ videoData, videoId, ...props }) => {
        const deleteVideo = () =>
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.REMOVE_VIDEO, videoId);
        return (
            <li
                title={props.actions ? "Play video" : undefined}
                className={`${props.previous ? "opacity-60 hover:opacity-100" : null} ${props.current ? "bg-background-active" : null} ${props.actions ? "hover:cursor-pointer" : null} select-none hover:bg-spec-badge-chip-background group flex items-stretch p-[4px_8px_4px_0]`}
            >
                <div className="flex items-stretch">
                    <div className="flex">
                        <span className="m-auto w-[24px] p-0 text-center font-secondary text-[1.2rem] font-[400] leading-[1.5rem] text-text-secondary">
                            {props.number ? props.number : null}
                            {props.current ? "▶" : null}
                        </span>
                    </div>
                    <div>
                        <div
                            className="h-[56px] w-[100px] rounded-lg bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${videoData.thumbnail_url})` }}
                        ></div>
                    </div>
                    <article className="p-[0_8px]">
                        <h4 className="m-[0_0_4px] line-clamp-2 max-h-16 overflow-ellipsis whitespace-normal p-0 text-left font-secondary text-[1.4rem] font-[500] leading-[2rem] text-text-primary">
                            {videoData.title}
                        </h4>
                        <p className="text-left font-secondary text-[1.2rem] font-[400] leading-[1.8rem] text-text-secondary">
                            {videoData.author_name}
                        </p>
                    </article>
                </div>

                {props.actions && !props.previous && (
                    <div className="ml-auto flex items-center justify-self-end hover:cursor-default">
                        <button
                            title="Remove video"
                            className="m-0 flex h-[40px] w-[40px] items-center justify-center border-none bg-transparent p-0 hover:cursor-pointer"
                            onClick={deleteVideo}
                        >
                            <div className="hidden h-[20px] w-[20px] text-icon-shape-color group-hover:block">
                                <Trash />
                            </div>
                        </button>
                    </div>
                )}
            </li>
        );
    },
);

const Video: React.FC<VideoProps> = props => {
    const { loading, videoData } = useVideoData(props.videoUrl);
    return loading ? <LoadingSkeleton /> : <VideoContent {...props} videoData={videoData} />;
};

export default Video;
