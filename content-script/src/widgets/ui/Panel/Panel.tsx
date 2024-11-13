import React from "react";
import useResize from "@shared/hooks/useResize";

// Entities
import Playlist from "@entities/ui/Playlist/Playlist";

const Panel: React.FC = () => {
    const { isFullScreen, height } = useResize();

    return (
        <div
            style={{ height: height }}
            className="st-panel m-[0_0_8px] box-border min-h-[400px] w-[100%] overflow-hidden rounded-[12px] border border-solid border-spec-outline"
        >
            <div className="flex h-[100%] flex-col">
                <div className="bg-background-primary p-[12px_6px_6px_16px]">
                    <a className="m-[0_-2px_0_0] p-[0_1px_0_0] font-primary text-[2rem] font-[700] leading-[2.8rem] text-text-primary">
                        ShareTube
                    </a>
                </div>
                <Playlist />
            </div>
        </div>
    );
};

export default Panel;
