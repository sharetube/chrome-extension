import React from "react";

interface TabProps {
    text: string;
    active: boolean;
    onClick?: () => void;
}

const Tab: React.FC<TabProps> = props => {
    return (
        <a
            className={`st-tab group relative m-0 flex h-[40px] flex-col items-stretch justify-center p-0 hover:cursor-pointer`}
            onClick={props.onClick}
        >
            <span
                className={`st-tab_text m-0 block p-0 text-center text-[1.4rem] font-[500] leading-[2.2rem] text-text-secondary ${props.active ? "!text-text-primary" : "text-text-secondary"}`}
            >
                {props.text}
            </span>
            <div
                className={`st-tab__indicator absolute bottom-0 left-0 h-[2px] w-[100%] ${props.active ? "bg-text-primary" : "group-hover:bg-text-secondary"} `}
            ></div>
        </a>
    );
};

export default Tab;
