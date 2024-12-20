import Video from "@entities/Video/Video";
import useAdmin from "@shared/Context/Admin/hooks/useAdmin";
import { ContentScriptMessagingClient } from "@shared/client/client";
import React, { useEffect, useState } from "react";
import { ExtensionMessageType } from "types/extensionMessage";
import type { Video as IVideo, Playlist } from "types/serverMessage";

const Playlist: React.FC = () => {
    const [previous, setPrevious] = useState<{ id: string }>({ id: "eNvUS-6PTbs" });
    const [current, setCurrent] = useState<{ id: string }>({ id: "u4tpkwkiSDg" });
    const [videos, setVideos] = useState<IVideo[]>([]);
    const { is_admin } = useAdmin();

    const messageClient = new ContentScriptMessagingClient();

    useEffect(() => {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_PLAYLIST, null).then(
            payload => {
                console.log(payload);
                if (payload) setVideos(payload);
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
            <Video videoId={previous.id} videoUrl={previous.id} previous actions={is_admin} />
            <Video videoId={current.id} videoUrl={current.id} current actions={is_admin} />
            {videos.length > 0 &&
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
