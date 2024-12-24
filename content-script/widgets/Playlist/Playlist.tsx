import Video from "@entities/Video/Video";
import useAdmin from "@shared/Context/Admin/hooks/useAdmin";
import { ContentScriptMessagingClient } from "@shared/client/client";
import React, { useEffect, useState } from "react";
import { ExtensionMessageType } from "types/extensionMessage";
import type { Video as IVideo, Playlist } from "types/serverMessage";
import { videoID } from "types/video";

const Playlist: React.FC = () => {
    const [last, setLast] = useState<IVideo>();
    const [current, setCurrent] = useState<videoID>();
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

        const handler = (payload: IVideo) => {
            if (payload) setLast(payload);
        };

        messageClient.addHandler(ExtensionMessageType.LAST_VIDEO_UPDATED, handler);

        return () => {
            messageClient.removeHandler(ExtensionMessageType.LAST_VIDEO_UPDATED);
        };
    }, []);

    // Current
    useEffect(() => {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_PLAYER_VIDEO, null).then(
            payload => {
                setCurrent(payload);
            },
        );

        const handler = (payload: videoID) => {
            if (payload) setCurrent(payload);
        };

        messageClient.addHandler(ExtensionMessageType.PLAYER_VIDEO_UPDATED, handler);

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

        const handler = (payload: Playlist) => {
            if (payload) setVideos(payload.videos);
        };

        messageClient.addHandler(ExtensionMessageType.PLAYLIST_UPDATED, handler);

        return () => {
            messageClient.removeHandler(ExtensionMessageType.PLAYLIST_UPDATED);
        };
    }, []);

    return (
        <ul className="st-playlist m-0">
            {last && <Video videoId={last.id} videoUrl={last.url} last actions={is_admin} />}
            {current && <Video videoId={current} videoUrl={current} current actions={is_admin} />}
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
