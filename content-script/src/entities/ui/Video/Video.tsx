import React, { useEffect, useState } from "react";

// Icon
import Trash from "@shared/ui/Trash/Trash";

// API
import getVideoInfo from "@shared/api/getVideoInfo";

interface VideoProps {
    videoId: string;
    number: number;
}

const Video: React.FC<VideoProps> = props => {
    const [loading, setLoading] = useState(true);
    const [videoData, setVideoData] = useState<any>(null);

    // Get video data on mount and add skeleton loader
    useEffect(() => {
        getVideoInfo(props.videoId)
            .then(data => {
                setVideoData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, [props.videoId]);

    // Skeleton loader
    if (loading) {
        return (
            <li className="st-video-item group flex items-stretch p-[4px_8px_4px_0]">
                <div className="st-video-item__column flex items-center">
                    <span className="st-video-item__number m-0 w-[24px] bg-background-primary p-0 text-center font-secondary text-[1.2rem] font-[400] leading-[1.5rem] text-background-primary"></span>
                </div>
                <div className="st-video-item__column">
                    <div className="st-video-item__thumbnail relative h-[56px] w-[100px] animate-pulse rounded-[8px] bg-background-primary text-background-primary"></div>
                </div>
                <div className="st-video-item__column p-[0_8px]">
                    <h4 className="m-[0_0_4px] line-clamp-2 h-[34px] max-h-[4rem] w-[195px] animate-pulse overflow-ellipsis whitespace-normal rounded-[8px] bg-background-primary p-0 text-left font-secondary text-[1.4rem] font-[500] not-italic leading-[2rem] text-background-primary"></h4>
                    <p className="h-[18px] w-[195px] animate-pulse rounded-[8px] bg-background-primary text-left font-secondary text-[1.2rem] font-[400] leading-[1.8rem] text-background-primary"></p>
                </div>
                <div className="st-video-item__col flex items-center hover:cursor-default">
                    <button
                        title="Remove video"
                        className="st-video-item__icon-wrapper m-0 flex h-[40px] w-[40px] items-center justify-center rounded-[2px] border-none bg-transparent p-0 hover:cursor-pointer"
                    >
                        <div className="st-video-item__icon hidden h-[20px] w-[20px] group-hover:block"></div>
                    </button>
                </div>
            </li>
        );
    }

    return (
        <li
            title="Play"
            className="st-video-item group flex items-stretch p-[4px_8px_4px_0] hover:cursor-pointer hover:bg-spec-badge-chip-background"
        >
            <div className="st-video-item__column flex items-center">
                <span className="st-video-item__number m-0 w-[24px] p-0 text-center font-secondary text-[1.2rem] font-[400] leading-[1.5rem] text-text-secondary">
                    {props.number}
                </span>
            </div>
            <div className="st-video-item__column">
                <div
                    className="st-video-item__thumbnail relative h-[56px] w-[100px] rounded-[8px] bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${videoData.thumbnail_url})`,
                    }}
                >
                    <div className="absolute bottom-0 right-0 m-[4px] hidden rounded-[4px] bg-black bg-opacity-60 p-[1px_4px] text-[1.2rem] font-medium leading-[1.8rem] text-white">
                        {videoData.duration}
                    </div>
                </div>
            </div>
            <div className="st-video-item__column p-[0_8px]">
                <h4 className="st-video-item__title m-[0_0_4px] line-clamp-2 max-h-[4rem] overflow-ellipsis whitespace-normal p-0 text-left font-secondary text-[1.4rem] font-[500] not-italic leading-[2rem] text-text-primary">
                    {videoData.title}
                </h4>
                <p className="st-video-item__author text-left font-secondary text-[1.2rem] font-[400] leading-[1.8rem] text-text-secondary">
                    {videoData.author_name}
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
