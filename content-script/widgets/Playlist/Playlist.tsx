import Video from "@entities/Video/Video";
import useAdmin from "@shared/Context/Admin/hooks/useAdmin";
import { ContentScriptMessagingClient } from "@shared/client/client";
import React, { useEffect, useState } from "react";
import { ExtensionMessageType } from "types/extensionMessage";

const Playlist: React.FC = () => {
    const [previous, setPrevious] = useState<{ id: string }>({ id: "eNvUS-6PTbs" });
    const [current, setCurrent] = useState<{ id: string }>({ id: "u4tpkwkiSDg" });
    const [videos, setVideos] = useState<{ id: string }[]>([]);
    const { is_admin } = useAdmin();

    useEffect(() => {
        const messagingClient = ContentScriptMessagingClient.getInstance();

        messagingClient.sendMessage(ExtensionMessageType.GET_PLAYLIST, null).then(payload => {
            if (payload) setVideos(payload);
        });

        const handler = (payload: { id: string }[] | null) => {
            if (payload) setVideos(payload);
        };

        messagingClient.addHandler(ExtensionMessageType.PLAYLIST_UPDATED, handler);

        return () => {
            messagingClient.removeHandler(ExtensionMessageType.PLAYLIST_UPDATED);
        };
    }, []);

    return (
        <ul className="st-playlist m-0">
            <Video videoId={previous.id} previous actions={is_admin} />
            <Video videoId={current.id} current actions={is_admin} />
            {videos.length > 0 &&
                videos.map((video, index) => (
                    <Video
                        key={video.id}
                        videoId={video.id}
                        number={index + 1}
                        actions={is_admin}
                    />
                ))}
        </ul>
    );
};

export default Playlist;
