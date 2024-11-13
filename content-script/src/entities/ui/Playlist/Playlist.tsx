import React, { useState } from "react";

// Video component
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
    );
};

export default Playlist;
