import validate from "../../shared/api/validateVideo";
import useKey from "./hooks/useKey";
import useAdmin from "@shared/Context/Admin/hooks/useAdmin";
import Icon from "@shared/ui/Add/Add";
import React, { useState } from "react";
import { ExtensionMessageType } from "types/extensionMessage";

const Search: React.FC = () => {
    const { isAdmin: is_admin } = useAdmin();
    const [inputValue, setInputValue] = useState<string>("");
    const inputRef = useKey("/");

    const add = (videoId: string) => {
        chrome.runtime.sendMessage({ type: ExtensionMessageType.ADD_VIDEO, payload: videoId });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setInputValue(e.target.value);

    const handleAdd = () => {
        validate(inputValue)
            .then(videoId => {
                add(videoId);
                setInputValue("");
            })
            .catch(error => console.log("Error from search input:", error));
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") handleAdd();
    };

    return (
        <div
            className={`st-search-container relative m-[0_auto] border-box w-[100%] max-w-[536px] ${is_admin ? "" : "opacity-50 hover:cursor-not-allowed"}`}
        >
            <div className="box-border flex rounded-full border border-solid border-spec-outline">
                <div className="box-border h-[40px] w-[100%] flex-grow">
                    <input
                        type="text"
                        className={`${is_admin ? "hover:cursor-pointer" : "hover:cursor-not-allowed"} m-0 h-[40px] w-[100%] border-none bg-transparent p-[0_4px_0_16px] font-secondary text-[16px] font-normal leading-[22px] text-text-primary outline-none placeholder:text-text-secondary`}
                        placeholder={is_admin ? "Enter video url here" : "You can't add videos"}
                        disabled={!is_admin}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                    />
                </div>
                <button
                    onClick={handleAdd}
                    title={is_admin ? "Add" : ""}
                    disabled={!is_admin}
                    className={`${is_admin ? "hover:cursor-pointer" : "hover:cursor-not-allowed"} border-l-solid m-0 box-border flex h-[40px] w-[64px] items-center justify-center rounded-br-full rounded-tr-full border-b-0 border-l border-r-0 border-t-0 border-solid border-spec-outline bg-background-primary p-[1px_4px]`}
                >
                    <div className="box-border h-[24px] w-[24px] text-text-primary">
                        <Icon />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Search;
