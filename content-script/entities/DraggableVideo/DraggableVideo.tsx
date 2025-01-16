import Video from "@entities/Video/Video";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { VideoType } from "types/video.type";

interface DraggableVideoProps {
    video: VideoType;
    index: number;
    isAdmin: boolean;
}

const DraggableVideo: React.FC<DraggableVideoProps> = ({
    video,
    index,
    isAdmin,
}: DraggableVideoProps) => (
    <Draggable key={video.id} draggableId={video.id.toString()} index={index}>
        {provided => (
            <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                <Video
                    key={video.id}
                    video={video}
                    number={index + 1}
                    type="number"
                    isAdmin={isAdmin}
                />
            </li>
        )}
    </Draggable>
);

export default DraggableVideo;
