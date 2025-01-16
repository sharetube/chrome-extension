import DraggableVideo from "@entities/DraggableVideo/DraggableVideo";
import Video from "@entities/Video/Video";
import useAdmin from "@shared/Context/Admin/hooks/useAdmin";
import { ContentScriptMessagingClient } from "@shared/client/client";
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { ExtensionMessageType } from "types/extensionMessage";
import type { PlaylistType, VideoType } from "types/video.type";

const Playlist: React.FC = () => {
    const [lastVideo, setLastVideo] = useState<VideoType>();
    const [currentVideo, setCurrentVideo] = useState<VideoType>();
    const [videos, setVideos] = useState<VideoType[]>([]);
    const { isAdmin } = useAdmin();

    const messageClient = new ContentScriptMessagingClient();

    // Last
    useEffect(() => {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_LAST_VIDEO).then(
            payload => {
                setLastVideo(payload);
            },
        );

        messageClient.addHandler(ExtensionMessageType.LAST_VIDEO_UPDATED, (payload: VideoType) => {
            if (payload) setLastVideo(payload);
        });

        return () => {
            messageClient.removeHandler(ExtensionMessageType.LAST_VIDEO_UPDATED);
        };
    }, []);

    // Current
    useEffect(() => {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_CURRENT_VIDEO).then(
            payload => {
                setCurrentVideo(payload);
            },
        );

        messageClient.addHandler(
            ExtensionMessageType.CURRENT_VIDEO_UPDATED,
            (videoData: VideoType) => {
                if (videoData) setCurrentVideo(videoData);
            },
        );

        return () => {
            messageClient.removeHandler(ExtensionMessageType.CURRENT_VIDEO_UPDATED);
        };
    }, []);

    // Playlist
    useEffect(() => {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_PLAYLIST).then(
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

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const newVideos = videos;
        const [reorderedItem] = newVideos.splice(result.source.index, 1);
        newVideos.splice(result.destination.index, 0, reorderedItem);

        setVideos(newVideos);

        ContentScriptMessagingClient.sendMessage(
            ExtensionMessageType.REORDER_PLAYLIST,
            newVideos.map(video => video.id),
        );
    };

    return (
        <div className="st-playlist m-0">
            {lastVideo && <Video video={lastVideo} type="last" isAdmin={isAdmin} />}
            {currentVideo && <Video video={currentVideo} type="current" isAdmin={isAdmin} />}
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="playlist">
                    {provided => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}>
                            {videos &&
                                videos.length > 0 &&
                                // todo: memoize
                                videos.map((video, index) => (
                                    <DraggableVideo
                                        key={video.id}
                                        index={index}
                                        video={video}
                                        isAdmin={isAdmin}
                                    />
                                ))}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default Playlist;
