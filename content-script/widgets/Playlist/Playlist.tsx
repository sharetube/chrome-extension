import Video from "@entities/Video/Video";
import useAdmin from "@shared/Context/Admin/hooks/useAdmin";
import { ContentScriptMessagingClient } from "@shared/client/client";
import React, { useEffect, useState } from "react";
import { ExtensionMessageType } from "types/extensionMessage";
import type { VideoType as IVideo, PlaylistType } from "types/video.type";

const Playlist: React.FC = () => {
    const [lastVideo, setLastVideo] = useState<IVideo>();
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string>();
    const [videos, setVideos] = useState<IVideo[]>([]);
    const { is_admin } = useAdmin();

    const messageClient = new ContentScriptMessagingClient();

    // Last
    useEffect(() => {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_LAST_VIDEO, null).then(
            payload => {
                setVideos(payload);
            },
        );

        messageClient.addHandler(ExtensionMessageType.LAST_VIDEO_UPDATED, (payload: IVideo) => {
            if (payload) setLastVideo(payload);
        });

        return () => {
            messageClient.removeHandler(ExtensionMessageType.LAST_VIDEO_UPDATED);
        };
    }, []);

    // Current
    useEffect(() => {
        ContentScriptMessagingClient.sendMessage(
            ExtensionMessageType.GET_PLAYER_VIDEO_URL,
            null,
        ).then(payload => {
            setCurrentVideoUrl(payload);
        });

        messageClient.addHandler(ExtensionMessageType.PLAYER_VIDEO_UPDATED, (payload: string) => {
            if (payload) setCurrentVideoUrl(payload);
        });

        return () => {
            messageClient.removeHandler(ExtensionMessageType.PLAYER_VIDEO_UPDATED);
        };
    }, []);

    // Playlist
    useEffect(() => {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_PLAYLIST, null).then(
            payload => {
                setVideos(payload.videos);
            },
        );

        const handler = (payload: PlaylistType) => {
            if (payload) setVideos(payload.videos);
        };

        messageClient.addHandler(ExtensionMessageType.PLAYLIST_UPDATED, handler);

        return () => {
            messageClient.removeHandler(ExtensionMessageType.PLAYLIST_UPDATED);
        };
    }, []);

    return (
        <ul className="st-playlist m-0">
            {lastVideo && (
                <Video videoId={lastVideo.id} videoUrl={lastVideo.url} last actions={is_admin} />
            )}
            {currentVideoUrl && (
                <Video
                    videoId={currentVideoUrl}
                    videoUrl={currentVideoUrl}
                    current
                    actions={is_admin}
                />
            )}
            {videos &&
                videos.length > 0 &&
                videos.map((video, index) => (
                    <Video
                        key={video.id}
                        videoId={video.id}
                        videoUrl={video.url}
                        number={index + 1}
                        actions={is_admin}
                    />
                ))}
        </ul>
    );
};

export default Playlist;
