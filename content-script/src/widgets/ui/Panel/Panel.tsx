import React, { useState } from "react";
import useResize from "@shared/hooks/useResize";

// Entities
import Playlist from "@widgets/ui/Playlist/Playlist";
import Room from "../Room/Room";
import Tab from "@entities/ui/Tab/Tab";

const Panel: React.FC = () => {
    const { isFullScreen, height } = useResize();
    const [activeTab, setActiveTab] = useState("Playlist");

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div
            style={{ height: height }}
            className="st-panel m-[0_0_8px] box-border min-h-[400px] w-[100%] overflow-hidden rounded-[12px] border border-solid border-spec-outline"
        >
            <div className="flex h-[100%] flex-col">
                <div className="st-panel__header border-b border-solid border-spec-outline bg-background-primary p-[12px_6px_0_16px]">
                    <a className="m-[0_-2px_0_0] p-[0_1px_0_0] font-primary text-[2rem] font-[700] leading-[2.8rem] text-text-primary">
                        ShareTube
                    </a>
                    <nav className="st-panel__tabs flex gap-[18px]">
                        <Tab
                            active={activeTab === "Playlist"}
                            text="Playlist"
                            onClick={() => handleTabClick("Playlist")}
                        />
                        <Tab
                            active={activeTab === "Room"}
                            text="Room"
                            onClick={() => handleTabClick("Room")}
                        />
                    </nav>
                </div>
                <div className="st-panel__content-container flex-grow overflow-y-auto">
                    {activeTab === "Playlist" && (
                        <Playlist
                            className={`st-panel__content transition-opacity duration-500 ${activeTab === "Playlist" ? "opacity-100" : "opacity-0"}`}
                        />
                    )}
                    {activeTab === "Room" && (
                        <Room
                            className={`st-panel__content transition-opacity duration-500 ${activeTab === "Room" ? "opacity-100" : "opacity-0"}`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Panel;
