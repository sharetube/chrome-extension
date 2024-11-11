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
            className="st-video-item flex items-stretch p-[8px_8px_4px_0] hover:cursor-pointer hover:bg-spec-badge-chip-background group"
        >
            <div className="st-video-item__column flex items-center">
                <span className="st-video-item__number font-secondary m-0 p-0 w-[24px] text-center text-text-secondary text-[1.2rem] font-[400] leading-[1.5rem]">
                    {props.number}
                </span>
            </div>
            <div className="st-video-item__column">
                <div className="st-video-item__thumbnail bg-cyan-300 h-[56px] w-[100px] rounded-[8px] relative">
                    <div className="st-video-item__badge text-[1.2rem] leading-[1.8rem] font-medium rounded-[4px] p-[1px_4px] text-white bg-black bg-opacity-60 absolute m-[4px] bottom-0 right-0">
                        {props.duration}
                    </div>
                </div>
            </div>
            <div className="st-video-item__column p-[0_8px]">
                <h4 className="st-video-item__title not-italic line-clamp-2 max-h-[4rem] overflow-ellipsis whitespace-normal text-left font-secondary text-text-primary text-[1.4rem] font-[500] leading-[2rem] p-0 m-[0_0_4px]">
                    {props.title}
                </h4>
                <p className="st-video-item__author font-secondary text-left font-[400] leading-[18px] text-[12px] text-text-secondary">
                    {props.author}
                </p>
            </div>
            <div className="st-video-item__col flex items-center hover:cursor-default">
                <button
                    title="Remove video"
                    className="st-video-item__icon-wrapper hover:cursor-pointer w-[40px] h-[40px] flex items-center justify-center border-none p-0 m-0 bg-transparent"
                    onClick={() => {}}
                >
                    <div className="st-video-item__icon w-[20px] h-[20px] hidden group-hover:block text-icon-shape-color">
                        <Trash />
                    </div>
                </button>
            </div>
        </li>
    );
};

export default Video;
