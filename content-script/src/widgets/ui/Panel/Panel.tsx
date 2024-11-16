import React, { useState } from "react";
import useResize from "@shared/hooks/useResize";

// Entities
import Playlist from "@widgets/ui/Playlist/Playlist";
import Room from "@widgets/ui/Room/Room";
// Icons
import Expand from "@shared/ui/Expand/Expand";

const Panel: React.FC = () => {
    const { isFullScreen, height } = useResize();

    const [isExpended, setIsExpended] = useState(true);

    return (
        <div
            style={{ height: height }}
            className="st-panel m-0 box-border min-h-[400px] w-[100%] overflow-hidden rounded-[12px] border border-solid border-spec-outline"
        >
            <div className="relative flex h-[100%] flex-col">
                <div className="st-panel__header border-b border-solid border-spec-outline bg-background-primary p-[8px_16px_0_16px]">
                    <div
                        className="flex items-center justify-between p-[10px_0] hover:cursor-pointer"
                        onClick={() => setIsExpended(!isExpended)}
                    >
                        <a className="m-[0_-2px_0_0] select-none p-0 font-primary text-[2rem] font-[700] leading-[2.8rem] text-text-primary">
                            ShareTube
                        </a>
                        <div className="flex items-center justify-center p-0">
                            <div className="h-[22px] w-[22px] cursor-pointer select-none rounded-none text-text-secondary">
                                <Expand isExpended={isExpended} />
                            </div>
                        </div>
                    </div>
                    <div className={`${isExpended ? "block" : "hidden"}`}>
                        <Room />
                    </div>
                </div>
                <div className="st-panel__content-container flex-grow overflow-y-auto">
                    <Playlist
                        className={`st-panel__content transition-opacity duration-500`}
                    />
                </div>
            </div>
        </div>
    );
};

export default Panel;
