import { defaultUser } from "../../../constants/defaultUser";
import { ExtensionMessageType } from "../../../types/extensionMessage";
import { ContentScriptMessagingClient } from "../../shared/client/client";
import Profile from "./pages/Profile";
import Room from "./pages/Room";
import ShareTube from "@shared/ui/ShareTube/ShareTube";
import React, { useEffect, useState } from "react";
import { user } from "types/user";

const Popup: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isProfileEdit, setIsProfileEdit] = useState<boolean>(false);
    const [user, setUser] = useState<user>(defaultUser);

    const expandChange = () => {
        setIsExpanded(!isExpanded);
    };

    const handleClick = (e: MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains("st-popup__content")) return;
        setIsExpanded(false);
    };

    useEffect(() => {
        if (isExpanded) {
            document.addEventListener("click", handleClick);
        } else {
            document.removeEventListener("click", handleClick);
            setIsProfileEdit(false);
        }

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [isExpanded]);

    const changePage = () => setIsProfileEdit(!isProfileEdit);

    useEffect(() => {
        ContentScriptMessagingClient.getInstance()
            .sendMessage(ExtensionMessageType.GET_PROFILE, null)
            .then(payload => {
                setUser(payload);
            });
    }, []);

    useEffect(() => {
        ContentScriptMessagingClient.getInstance().addHandler(
            ExtensionMessageType.PROFILE_UPDATED,
            (payload: user) => {
                setUser(payload);
            },
        );
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
                    className="st-popup__content box-border w-[300px] rounded-[12px] bg-spec-menu-background absolute right-0 top-[40px] z-[2300]"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                >
                    {isProfileEdit && <Profile changePage={changePage} user={user} />}
                    {!isProfileEdit && <Room changePage={changePage} user={user} />}
                </div>
            )}
        </div>
    );
};

export default Popup;
