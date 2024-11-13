import React, { useState, useRef, useEffect } from "react";
import Icon from "@shared/ui/Search/Search";

// API
import validateVideo from "@shared/api/validateVideo";
// Debug
import log from "@shared/lib/log";

const Search: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>("");

    // Handle input change event
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // Handle click event for button "Add"
    const handleClick = () => {
        validateVideo(inputValue)
            .then(videoId => {
                log("From search input:", videoId);
                setInputValue("");
            })
            .catch(error => {
                log("Error from search input:", error);
            });
    };

    // Handle keydown event "Enter" for input
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleClick();
        }
    };

    // Focus input on global keydown "/"
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            if (event.key === "/") {
                inputRef.current?.focus();
                event.preventDefault();
            }
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => {
            window.removeEventListener("keydown", handleGlobalKeyDown);
        };
    }, []);

    return (
        <div className="st-search-container relative m-[0_auto] w-[100%] max-w-[536px]">
            <div className="box-border flex rounded-full border border-solid border-spec-outline">
                <div className="box-border h-[40px] w-[100%] flex-grow">
                    <input
                        type="text"
                        className="m-0 h-[40px] w-[100%] border-none bg-transparent p-[0_4px_0_16px] font-secondary text-[16px] font-normal leading-[22px] text-text-primary outline-none placeholder:text-text-secondary"
                        placeholder="Enter video url here"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                    />
                </div>
                <button
                    onClick={handleClick}
                    title="Add"
                    className="border-l-solid bg-background-primary m-0 box-border flex h-[40px] w-[64px] items-center justify-center rounded-br-full rounded-tr-full border-b-0 border-l border-r-0 border-t-0 border-solid border-spec-outline p-[1px_4px] hover:cursor-pointer"
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
