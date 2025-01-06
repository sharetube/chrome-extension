import ShareTube from "@shared/ui/ShareTube/ShareTube";
import React from "react";

const ContextItem: React.FC = () => {
    const onClick: React.MouseEventHandler<HTMLDivElement> = e => {
        e.stopPropagation();
        console.log("Clicked on context item");
    };

    return (
        <div>
            <div className="st-context-item" onClick={onClick}>
                <div className="flex items-center p-[0_12px_0_16px] h-[36px] hover:cursor-pointer hover:bg-spec-button-chip-background-hover">
                    <div className="m-[0_16px_0_0] text-text-primary">
                        <ShareTube />
                    </div>
                    <p className="m-0 p-0 text-text-primary font-secondary text-[1.4rem] leading-[2rem] font-normal">
                        Room
                    </p>
                </div>
                <div className="h-[1px] w-full bg-spec-outline m-[8px_0]"></div>
            </div>
        </div>
    );
};

export default ContextItem;
