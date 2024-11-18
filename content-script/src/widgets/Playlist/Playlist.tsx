import React, { useState } from "react";

// Video component
import Video from "@entities/Video/Video";

const Playlist: React.FC = () => {
    const [previous, setPrevious] = useState<{ id: string }>({
        id: "eNvUS-6PTbs",
    });

    const [current, serCurrent] = useState<{ id: string }>({
        id: "u4tpkwkiSDg",
    });

    const [videos, setVideos] = useState<{ id: string }[]>([
        {
            id: "JTvcpdfGUtQ",
        },
        {
            id: "1PNS8Iytt0o",
        },
        {
            id: "WJ0rVFr8wLU",
        },
        {
            id: "6Fd3NPLiac8",
        },
        {
            id: "JTvcpdfGUtQ",
        },
        {
            id: "JTvcpdfGUtQ",
        },
        {
            id: "1PNS8Iytt0o",
        },
        {
            id: "WJ0rVFr8wLU",
        },
        {
            id: "6Fd3NPLiac8",
        },
        {
            id: "JTvcpdfGUtQ",
        },
    ]);

    const [actions, setActions] = useState<boolean>(true);

    return (
        <ul className="st-playlist m-[6px_0_0]">
            <Video videoId={previous.id} previous actions={actions} />
            <Video videoId={current.id} current actions={actions} />
            {videos.map((video, index) => (
                <Video
                    key={video.id}
                    videoId={video.id}
                    number={index + 1}
                    actions={actions}
                />
            ))}
        </ul>
    );
};

export default Playlist;
