import Button from "../shared/Button/Button";
import Input from "../shared/Input/Input";
import Title from "../shared/Title/Title";
import Avatar from "@entities/Avatar/Avatar";
import validate from "@shared/api/validateVideo";
import { ContentScriptMessagingClient } from "@shared/client/client";
import Next from "@shared/ui/Next/Next";
import React, { useEffect, useState } from "react";
import { ExtensionMessageType } from "types/extensionMessage";
import { profile } from "types/profile";

interface RoomProps {
    changePage: () => void;
    user: profile;
}

const Room: React.FC<RoomProps> = ({ user, changePage }) => {
    const [isRoom, setIsRoom] = useState<boolean>(true);

    const MessageClient = new ContentScriptMessagingClient();

    useEffect(() => {
        console.log("Room mounted");
        ContentScriptMessagingClient.sendMessage(
            ExtensionMessageType.CHECK_PRIMARY_TAB_EXISTS,
            null,
        ).then(response => {
            setIsRoom(response);
            setIsNavigateButtonDisabled(!response);
        });
        MessageClient.addHandler(ExtensionMessageType.PRIMARY_TAB_SET, () => {
            console.log("SET");
            setIsRoom(true);
            setIsNavigateButtonDisabled(false);
        });

        MessageClient.addHandler(ExtensionMessageType.PRIMARY_TAB_UNSET, () => {
            console.log("UNSET");
            setIsRoom(false);
            setIsNavigateButtonDisabled(true);
        });
    }, []);

    const [videoURLValue, setInputValue] = useState("");
    const [videoId, setVideoId] = useState("");
    const [isCreateRoomButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isNavigateButtonDisabled, setIsNavigateButtonDisabled] = useState(true);

    const handleVideoURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        if (value.length >= 16) {
            validate(value).then(videoId => {
                setVideoId(videoId);
                setIsButtonDisabled(!videoId);
            });
        }
    };

    const handleCreateRoomButtonClick = () => {
        if (videoId) {
            setInputValue("");
            ContentScriptMessagingClient.sendMessage(ExtensionMessageType.CREATE_ROOM, { videoId });
        }
    };

    const switchToPrimaryTab = () => {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.SWITCH_TO_PRIMARY_TAB, null);
    };

    const [isPrimaryTab, setIsPrimaryTab] = useState(true);
    useEffect(() => {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.IS_PRIMARY_TAB, null).then(
            response => {
                setIsPrimaryTab(response);
            },
        );
    }, [isPrimaryTab]);

    return (
        <React.Fragment>
            <header className="p-4 border-t-0 border-r-0 border-l-0 border-b border-solid border-spec-outline">
                <h1 className="font-secondary text-text-primary text-[16px] leading-[22px] font-normal select-none">
                    ShareTube
                </h1>
            </header>
            <section
                className={`p-[16px_25px_16px_16px] flex items-center justify-between ${isPrimaryTab ? "" : "border-t-0 border-r-0 border-l-0 border-b border-solid border-spec-outline"}  hover:cursor-pointer`}
                onClick={changePage}
                title="ShareTube profile"
            >
                <div className="flex items-center gap-4 select-none">
                    <Avatar
                        size="m"
                        url={user.avatar_url}
                        letter={user.username.slice(0, 1)}
                        color={user.color}
                    />
                    <h2
                        className="text-[16px] leading-[22px] font-normal font-secondary"
                        style={{ color: user.color }}
                    >
                        {user.username}
                    </h2>
                </div>
                <div>
                    <Next />
                </div>
            </section>
            {isRoom && !isPrimaryTab && (
                <section className="flex items-center justify-center p-[16px]">
                    <Button disabled={isNavigateButtonDisabled} onClick={switchToPrimaryTab}>
                        Navigate to player tab
                    </Button>
                </section>
            )}
            {!isRoom && (
                <section className="p-[16px]">
                    <Title>Initial video</Title>
                    <Input value={videoURLValue} onChange={handleVideoURLChange} />
                    <div className="m-[32px_0_0]">
                        <Button
                            onClick={handleCreateRoomButtonClick}
                            disabled={isCreateRoomButtonDisabled}
                        >
                            Create room
                        </Button>
                    </div>
                </section>
            )}
        </React.Fragment>
    );
};

export default Room;
