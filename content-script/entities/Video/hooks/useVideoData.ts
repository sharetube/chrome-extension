import video from '../api/Video';
import data from '../types/data';
import log from '@shared/lib/log';
import {useEffect, useState} from 'react';

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
                log('useVideoData', error);
                setLoading(false);
            });
    }, [videoId]);

    return {loading, videoData};
};

export default useVideoData;