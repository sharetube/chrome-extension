import Avatar from "@entities/Avatar/Avatar";
import useAdmin from "@shared/Context/Admin/hooks/useAdmin";
import Mute from "@shared/ui/Mute/Mute";
import Shield from "@shared/ui/Shield/Shield";
import React from "react";
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

    return (
        <li
            className={`flex items-center  ${is_ready ? "" : "opacity-60"} ${is_admin ? "hover:cursor-pointer" : "hover:cursor-default"}`}
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
        </li>
    );
};

export default Member;
