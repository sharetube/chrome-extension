import React, { useState } from "react";
import useResize from "@shared/hooks/useResize";
// Entities
import Playlist from "@widgets/Playlist/Playlist";
import Room from "@widgets/Room/Room";
// Icon wrapper
import Button from "@shared/icons/Button/Button";
// Icons
import Share from "@shared/icons/Share/Share";
import Expand from "@shared/icons/Expand/Expand";
//API
import copyLink from "./api/copyLink";

const Panel: React.FC = () => {
    const { isFullScreen, height } = useResize();

    const [isExpended, setIsExpended] = useState(false);

    const expandChange = () => {
        setIsExpended(prevState => !prevState);
    };

    return (
        <div
            style={{ height: height }}
            className="st-panel m-0 box-border flex min-h-[400px] w-[100%] flex-col overflow-hidden rounded-[12px] border border-solid border-spec-outline"
        >
            {/* Header */}
            <header className="m-0 box-border flex w-[100%] items-center justify-between bg-background-primary p-[6px_6px_0_16px]">
                <p className="m-0 select-none p-0 font-primary text-[2rem] font-bold leading-[2.8rem] text-text-primary">
                    ShareTube
                </p>
                {/* Action buttons */}
                <div className="m-0 flex items-center p-0 text-text-primary">
                    <Button onClick={copyLink}>
                        <Share />
                    </Button>
                    <Button onClick={expandChange}>
                        <Expand isExpended={isExpended} />
                    </Button>
                </div>
            </header>
            {/* Room */}
            <div
                className={`${isExpended ? "block" : "hidden"} bg-background-primary`}
            >
                <Room />
            </div>
            {/* Playlist */}
            <div className="flex-grow overflow-y-auto">
                <Playlist />
            </div>
        </div>
    );
};

export default Panel;
