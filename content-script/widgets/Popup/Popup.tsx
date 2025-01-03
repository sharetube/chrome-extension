import Profile from "./pages/Profile";
import Room from "./pages/Room";
import { ContentScriptMessagingClient } from "@shared/client/client";
import ShareTube from "@shared/ui/ShareTube/ShareTube";
import { defaultProfile } from "constants/defaultProfile";
import React, { useEffect, useState } from "react";
import { ExtensionMessageType } from "types/extensionMessage";
import { ProfileType } from "types/profile.type";

const Popup: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isProfileEdit, setIsProfileEdit] = useState<boolean>(false);
    const [user, setUser] = useState<ProfileType>(defaultProfile);

    const expandChange = () => {
        setIsExpanded(!isExpanded);
    };

    const handleClick = (e: MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains("st-popup__content")) return;
        setIsExpanded(false);
    };

    const MessageClient = new ContentScriptMessagingClient();

    useEffect(() => {
        const handleDocumentClick = (e: MouseEvent) => handleClick(e);

        if (isExpanded) {
            document.addEventListener("click", handleDocumentClick);
        } else {
            document.removeEventListener("click", handleDocumentClick);
            setIsProfileEdit(false);
        }

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [isExpanded]);

    const changePage = () => setIsProfileEdit(!isProfileEdit);

    useEffect(() => {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_PROFILE).then(
            (payload: ProfileType) => {
                setUser(payload);
            },
        );
    }, []);

    useEffect(() => {
        MessageClient.addHandler(ExtensionMessageType.PROFILE_UPDATED, (payload: ProfileType) => {
            setUser(payload);
        });
    }, []);

    return (
        <div className="st-popup h-[40px] w-[40px] box-border relative m-[0_8px_0_0]">
            <div
                className="hover:bg-spec-button-chip-background-hover hover:cursor-pointer text-spec-wordmark-text h-[40px] w-[40px] box-border flex rounded-full"
                onClick={expandChange}
            >
                <div className="m-auto h-[24px] w-[24px]">
                    <ShareTube />
                </div>
            </div>
            {isExpanded && (
                <div
                    className="st-popup__content box-border w-[300px] rounded-[12px] bg-spec-menu-background absolute right-0 top-[40px] z-[2300] shadow-box-shadow"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                >
                    {isProfileEdit ? (
                        <Profile changePage={changePage} user={user} />
                    ) : (
                        <Room changePage={changePage} profile={user} />
                    )}
                </div>
            )}
        </div>
    );
};

export default Popup;
