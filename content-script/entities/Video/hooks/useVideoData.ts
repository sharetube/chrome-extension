import video from "../api/Video";
import data from "../types/data";
import { useEffect, useState } from "react";

const useVideoData = (videoUrl: string) => {
    const [loading, setLoading] = useState(true);
    const [videoData, setVideoData] = useState<data>({} as data);

    useEffect(() => {
        video(videoUrl)
            .then(data => {
                setVideoData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("useVideoData", error);
                setLoading(false);
            });
    }, [videoUrl]);

    return { loading, videoData };
};

export default useVideoData;
