import React, { useState } from "react";

// Video component
import Video from "@entities/ui/Video/Video";

const Playlist: React.FC = () => {
    const [videos, setVideos] = useState([
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

    return (
        <ul className="st-playlist__queue flex-grow overflow-y-scroll">
            {videos.map((video, index) => (
                <Video key={video.id} videoId={video.id} number={index + 1} />
            ))}
        </ul>
    );
};

export default Playlist;
