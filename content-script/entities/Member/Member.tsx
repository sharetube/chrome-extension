import Avatar from "@entities/Avatar/Avatar";
import useAdmin from "@shared/Context/Admin/hooks/useAdmin";
import { ContentScriptMessagingClient } from "@shared/client/client";
import BigShield from "@shared/ui/BigShield/BigShield";
import MemberIcon from "@shared/ui/Member/Member";
import Mute from "@shared/ui/Mute/Mute";
import Shield from "@shared/ui/Shield/Shield";
import React, { useEffect } from "react";
import { memo } from "react";
import { ExtensionMessageType } from "types/extensionMessage";
import { Member as IMember } from "types/serverMessage";

type MemberProps = IMember;

const Member: React.FC<MemberProps> = ({
    id,
    username,
    avatar_url,
    color,
    is_ready,
    is_muted,
    ...props
}) => {
    const { is_admin } = useAdmin();
    const [menu, setMenu] = React.useState(false);

    const handleClick = (e: MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains("st-member")) return;
        setMenu(false);
    };

    useEffect(() => {
        const handleDocumentClick = (e: MouseEvent) => handleClick(e);

        if (menu) {
            document.addEventListener("click", handleDocumentClick);
        } else {
            document.removeEventListener("click", handleDocumentClick);
        }

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [menu]);

    const openMenu = () => {
        if (!is_admin) return;
        setMenu(true);
    };

    const promote = () => {
        if (!is_admin) return;
        setMenu(false);
        ContentScriptMessagingClient.getInstance().sendMessage(
            ExtensionMessageType.PROMOTE_USER,
            id,
        );
    };

    const kick = () => {
        if (!is_admin) return;
        setMenu(false);
        ContentScriptMessagingClient.getInstance().sendMessage(
            ExtensionMessageType.REMOVE_MEMBER,
            id,
        );
    };

    return (
        <li
            className={`relative flex items-center  ${is_ready ? "" : "opacity-100"} ${is_admin ? "hover:cursor-pointer" : "hover:cursor-default"}`}
            onClick={openMenu}
        >
            <Avatar size="s" url={avatar_url} color={color} letter={username.slice(0, 1)} />
            {/* Nickname */}
            <p
                className={`m-0 p-[0_0_0_8px] text-text-primary font-secondary leading-normal text-[1.25rem] font-medium ${is_ready ? "" : "animate-pulse"}`}
                style={{ color: color }}
            >
                {username}
            </p>
            {/* Icons */}
            <div className="flex items-center">
                {props.is_admin && (
                    <div
                        className={`text-text-primary h-[14px] w-[12px] box-border m-[0_0_0_4px] ${is_ready ? "" : "animate-pulse"}`}
                    >
                        <Shield />
                    </div>
                )}
                {is_muted && (
                    <div
                        className={`text-text-secondary h-[12px] w-[12px] box-border m-[0_-2px_0_4px] ${is_ready ? "" : "animate-pulse"}`}
                    >
                        <Mute />
                    </div>
                )}
            </div>
            {is_admin && menu && !props.is_admin && (
                <div
                    className="st-member absolute top-[36px] left-0 w-[150px] rounded-lg bg-spec-menu-background z-[2300] p-[8px_0]"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                >
                    <button
                        onClick={promote}
                        className="p-[0_16px] m-0 flex border-none rounded-[8px] bg-spec-menu-background items-center w-[24px] h-[36px] hover:cursor-pointer"
                    >
                        <div className="h-[24px] w-[24px] flex items-center justify-center box-border text-text-primary">
                            <BigShield />
                        </div>
                        <p className="text-[14px] leading-[2rem] font-normal font-secondary text-text-primary m-[0_24px_0_16px]">
                            Promote
                        </p>
                    </button>
                    <button
                        onClick={kick}
                        className="p-[0_16px] m-0 flex border-none rounded-[8px] bg-spec-menu-background items-center w-[24px] h-[36px] hover:cursor-pointer"
                    >
                        <div className="h-[24px] w-[24px] flex items-center justify-center box-border text-text-primary">
                            <MemberIcon />
                        </div>
                        <p className="text-[14px] leading-[2rem] font-normal font-secondary text-text-primary m-[0_24px_0_16px]">
                            Kick
                        </p>
                    </button>
                </div>
            )}
        </li>
    );
};

export default Member;
