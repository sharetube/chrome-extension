import React, { useState } from "react";

import Video from "@entities/ui/Video/Video";

const Playlist: React.FC = () => {
    const [videos, setVideos] = useState([
        {
            id: 23123,
            title: "Любой ценой! / Чем обернулась для России победа Ельцина на выборах 1996?",
            author: "Татьяна Доронина",
            duration: "29:05",
            thumbnail: "https://i.ytimg.com/vi/3ZiZ3Zl3Zz3/maxresdefault.jpg",
            url: "https://www.youtube.com/watch?v=3ZiZ3Zl3Zz3",
        },
        {
            id: 23124,
            title: "Любой ценой! / Чем обернулась для России победа Ельцина на выборах 1996?",
            author: "Татьяна Доронина",
            duration: "29:05",
            thumbnail: "https://i.ytimg.com/vi/3ZiZ3Zl3Zz3/maxresdefault.jpg",
            url: "https://www.youtube.com/watch?v=3ZiZ3Zl3Zz3",
        },
        {
            id: 23125,
            title: "Любой ценой! / Чем обернулась для России победа Ельцина на выборах 1996?",
            author: "Татьяна Доронина",
            duration: "29:05",
            thumbnail: "https://i.ytimg.com/vi/3ZiZ3Zl3Zz3/maxresdefault.jpg",
            url: "https://www.youtube.com/watch?v=3ZiZ3Zl3Zz3",
        },
        {
            id: 23126,
            title: "Любой ценой! / Чем обернулась для России победа Ельцина на выборах 1996?",
            author: "Татьяна Доронина",
            duration: "29:05",
            thumbnail: "https://i.ytimg.com/vi/3ZiZ3Zl3Zz3/maxresdefault.jpg",
            url: "https://www.youtube.com/watch?v=3ZiZ3Zl3Zz3",
        },
        {
            id: 23127,
            title: "Любой ценой! / Чем обернулась для России победа Ельцина на выборах 1996?",
            author: "Татьяна Доронина",
            duration: "29:05",
            thumbnail: "https://i.ytimg.com/vi/3ZiZ3Zl3Zz3/maxresdefault.jpg",
            url: "https://www.youtube.com/watch?v=3ZiZ3Zl3Zz3",
        },
    ]);

    return (
        <div className="st-playlist border border-solid rounded-[12px] border-spec-outline h-[400px] overflow-hidden box-border m-[0_0_8px] w-[100%]">
            <div className="st-playlist__content flex flex-col h-[400px]">
                <div className="st-playlist__header p-[12px_6px_4px_16px] bg-playlist-header-background">
                    <a className="st-playlist__title m-[0_-2px_0_0] p-[0_1px_0_0] text-text-primary font-primary text-[2rem] leading-[2.8rem] font-[700]">
                        ShareTube
                    </a>
                </div>
                <ul className="st-playlist__queue flex-grow overflow-y-scroll">
                    {videos.map((video, index) => (
                        <Video
                            key={video.id}
                            number={index + 1}
                            title={video.title}
                            author={video.author}
                            duration={video.duration}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Playlist;
