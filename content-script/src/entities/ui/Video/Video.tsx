import React from "react";

// Icon
import Trash from "@shared/ui/Trash/Trash";

interface VideoProps {
    title: string;
    author: string;
    duration: string;
    thumbnail?: string;
    number: number;
    url?: string;
}

const Video: React.FC<VideoProps> = props => {
    return (
        <li
            title="Play"
            className="st-video-item group flex items-stretch p-[8px_8px_4px_0] hover:cursor-pointer hover:bg-spec-badge-chip-background"
        >
            <div className="st-video-item__column flex items-center">
                <span className="st-video-item__number m-0 w-[24px] p-0 text-center font-secondary text-[1.2rem] font-[400] leading-[1.5rem] text-text-secondary">
                    {props.number}
                </span>
            </div>
            <div className="st-video-item__column">
                <div className="st-video-item__thumbnail relative h-[56px] w-[100px] rounded-[8px] bg-cyan-300">
                    <div className="st-video-item__badge absolute bottom-0 right-0 m-[4px] rounded-[4px] bg-black bg-opacity-60 p-[1px_4px] text-[1.2rem] font-medium leading-[1.8rem] text-white">
                        {props.duration}
                    </div>
                </div>
            </div>
            <div className="st-video-item__column p-[0_8px]">
                <h4 className="st-video-item__title m-[0_0_4px] line-clamp-2 max-h-[4rem] overflow-ellipsis whitespace-normal p-0 text-left font-secondary text-[1.4rem] font-[500] not-italic leading-[2rem] text-text-primary">
                    {props.title}
                </h4>
                <p className="st-video-item__author text-left font-secondary text-[12px] font-[400] leading-[18px] text-text-secondary">
                    {props.author}
                </p>
            </div>
            <div className="st-video-item__col flex items-center hover:cursor-default">
                <button
                    title="Remove video"
                    className="st-video-item__icon-wrapper m-0 flex h-[40px] w-[40px] items-center justify-center border-none bg-transparent p-0 hover:cursor-pointer"
                    onClick={() => {}}
                >
                    <div className="st-video-item__icon hidden h-[20px] w-[20px] text-icon-shape-color group-hover:block">
                        <Trash />
                    </div>
                </button>
            </div>
        </li>
    );
};

export default Video;
