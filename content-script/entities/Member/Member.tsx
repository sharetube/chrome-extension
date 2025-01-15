import Avatar from "@entities/Avatar/Avatar";
import useAdmin from "@shared/Context/Admin/hooks/useAdmin";
import { ContentScriptMessagingClient } from "@shared/client/client";
import BigShield from "@shared/ui/BigShield/BigShield";
import MemberIcon from "@shared/ui/Member/Member";
import Mute from "@shared/ui/Mute/Mute";
import Shield from "@shared/ui/Shield/Shield";
import React, { useCallback, useEffect, useRef } from "react";
import { ExtensionMessageType } from "types/extensionMessage";
import { MemberType } from "types/member.type";

type MemberProps = MemberType;

const Member: React.FC<MemberProps> = ({
    id,
    username,
    avatar_url,
    color,
    is_ready,
    is_muted,
    is_admin,
}) => {
    const { isAdmin: isAdminStatus } = useAdmin();
    const [menu, setMenu] = React.useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            // Skip if clicking the member element that opens the menu
            if (
                event.target instanceof Node &&
                menuRef.current?.parentElement?.contains(event.target)
            ) {
                return;
            }

            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenu(false);
            }
        },
        [menuRef],
    );
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleClick = useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            if (!isAdminStatus || is_admin) return;
            setMenu(prev => !prev);
        },
        [isAdminStatus, is_admin],
    );

    const sendPromote = useCallback(() => {
        if (!isAdminStatus || is_admin) return;
        setMenu(false);
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.PROMOTE_MEMBER, id);
    }, [id, isAdminStatus, is_admin]);

    const sendKick = useCallback(() => {
        if (!isAdminStatus || is_admin) return;
        setMenu(false);
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.REMOVE_MEMBER, id);
    }, [id, isAdminStatus, is_admin]);

    return (
        <li className="relative">
            <div
                className={`flex items-center ${isAdminStatus && !is_admin ? "hover:cursor-pointer" : "hover:cursor-default"} ${is_ready ? "" : "animate-pulse"}`}
                onClick={handleClick}
            >
                <Avatar size="s" url={avatar_url} color={color} letter={username.slice(0, 1)} />
                {/* Username */}
                <p
                    className={`m-0 p-[0_0_0_8px] text-text-primary font-secondary leading-normal text-[1.25rem] font-medium`}
                    style={{ color }}
                >
                    {username}
                </p>
                {/* Icons */}
                <div className="flex items-center">
                    {is_admin && (
                        <div
                            className={`text-text-primary h-[14px] w-[12px] box-border m-[0_0_0_4px]`}
                        >
                            <Shield />
                        </div>
                    )}
                    {is_muted && (
                        <div
                            className={`text-text-secondary h-[12px] w-[12px] box-border m-[0_-2px_0_4px]`}
                        >
                            <Mute />
                        </div>
                    )}
                </div>
            </div>
            {isAdminStatus && menu && !is_admin && (
                <div
                    ref={menuRef}
                    className="st-member absolute top-[36px] left-0 w-[150px] rounded-lg shadow-box-shadow bg-spec-menu-background z-[2300] p-[8px_0]"
                >
                    <div
                        onClick={sendPromote}
                        className="hover:cursor-pointer hover:bg-spec-button-chip-background-hover"
                    >
                        <button className="p-[0_16px] m-0 flex border-none rounded-[8px] bg-transparent items-center w-[24px] h-[36px] ">
                            <div className="h-[24px] w-[24px] flex items-center justify-center box-border text-text-primary hover:cursor-pointer">
                                <BigShield />
                            </div>
                            <p className="text-[14px] leading-[2rem] font-normal font-secondary text-text-primary m-[0_24px_0_16px] hover:cursor-pointer">
                                Promote
                            </p>
                        </button>
                    </div>
                    <div
                        onClick={sendKick}
                        className="hover:cursor-pointer hover:bg-spec-button-chip-background-hover"
                    >
                        <button className="p-[0_16px] m-0 flex border-none rounded-[8px] bg-transparent items-center w-[24px] h-[36px] hover:cursor-pointer">
                            <div className="h-[24px] w-[24px] flex items-center justify-center box-border text-text-primary hover:cursor-pointer">
                                <MemberIcon />
                            </div>
                            <p className="text-[14px] leading-[2rem] font-normal font-secondary text-text-primary m-[0_24px_0_16px] hover:cursor-pointer">
                                Kick
                            </p>
                        </button>
                    </div>
                </div>
            )}
        </li>
    );
};

export default Member;
