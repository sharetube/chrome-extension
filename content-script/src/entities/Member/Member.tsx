import useAdmin from "@shared/Context/Admin/hooks/useAdmin";
import Mute from "@shared/icons/Mute/Mute";
import Shield from "@shared/icons/Shield/Shield";
import React, { useState } from "react";

interface MemberProps {
    /**
     * Member id
     */
    id: string;
    /**
     * Member nickname
     */
    nickname: string;
    /**
     * Member color
     */
    color: string;
    /**
     * Member muted status
     */
    muted: boolean;
    /**
     * Member admin status
     */
    admin: boolean;
    /**
     * Member online status
     */
    online: boolean;
    /**
     * Member avatar url, default is two letters from nickname
     */
    avatar?: string;
}

const Member: React.FC<MemberProps> = ({
    id,
    nickname,
    avatar,
    color,
    muted,
    online,
    admin,
}) => {
    // Global admin context
    const { is_admin } = useAdmin();

    return (
        <li
            className={`st-member flex items-center  ${online ? "" : "opacity-60"} ${is_admin ? "hover:cursor-pointer" : "hover:cursor-default"}`}
        >
            {/* Avatar */}
            {avatar && (
                <div
                    className={`rounded-full bg-cover bg-center bg-no-repeat h-[30px] w-[30px] select-none ${online ? "" : "animate-pulse"}`}
                    style={{ backgroundImage: `url(${avatar})` }}
                ></div>
            )}
            {/* Not avatar */}
            {!avatar && (
                <div
                    className={`rounded-full bg-cover bg-center bg-no-repeat h-[30px] w-[30px] flex select-none ${online ? "" : "animate-pulse"}`}
                    style={{ backgroundColor: color }}
                >
                    <p className="font-semibold text-[1.4rem] text-center font-secondary m-auto p-0 text-white select-none">
                        {nickname.slice(0, 1)}
                    </p>
                </div>
            )}
            {/* Nickname */}
            <p
                className={`m-0 p-[0_0_0_8px] text-text-primary font-secondary leading-normal text-[1.25rem] font-medium ${online ? "" : "animate-pulse"}`}
                style={{ color: color }}
            >
                {nickname}
            </p>
            {/* Icons */}
            <div className="flex items-center">
                {admin && (
                    <div
                        className={`text-text-primary h-[14px] w-[12px] box-border m-[0_0_0_4px] ${online ? "" : "animate-pulse"}`}
                    >
                        <Shield />
                    </div>
                )}
                {muted && (
                    <div
                        className={`text-text-secondary h-[12px] w-[12px] box-border m-[0_-2px_0_4px] ${online ? "" : "animate-pulse"}`}
                    >
                        <Mute />
                    </div>
                )}
            </div>
        </li>
    );
};

export default Member;
