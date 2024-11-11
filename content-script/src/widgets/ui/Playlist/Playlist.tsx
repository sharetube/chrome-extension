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
        <div className="st-playlist m-[0_0_8px] box-border h-[400px] w-[100%] overflow-hidden rounded-[12px] border border-solid border-spec-outline">
            <div className="st-playlist__content flex h-[400px] flex-col">
                <div className="st-playlist__header bg-playlist-header-background p-[12px_6px_4px_16px]">
                    <a className="st-playlist__title m-[0_-2px_0_0] p-[0_1px_0_0] font-primary text-[2rem] font-[700] leading-[2.8rem] text-text-primary">
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
