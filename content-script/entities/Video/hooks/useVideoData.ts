import { useState, useEffect } from "react";
import video from "../api/Video";
import data from "../types/data";

const useVideoData = (videoId: string) => {
    const [loading, setLoading] = useState(true);
    const [videoData, setVideoData] = useState<data>({} as data);

    useEffect(() => {
        video(videoId)
            .then(data => {
                setVideoData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, [videoId]);

    return { loading, videoData };
};

export default useVideoData;
