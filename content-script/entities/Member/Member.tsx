import Avatar from '@entities/Avatar/Avatar';
import useAdmin from '@shared/Context/Admin/hooks/useAdmin';
import Mute from '@shared/ui/Mute/Mute';
import Shield from '@shared/ui/Shield/Shield';
import React from 'react';

interface MemberProps {
    id: string;
    nickname: string;
    color: string;
    muted: boolean;
    admin: boolean;
    online: boolean;
    avatar_url: string;
}

const Member: React.FC<MemberProps> = ({id, nickname, avatar_url, color, muted, online, admin}) => {
    const {is_admin} = useAdmin();

    return (
        <li
            className={`flex items-center  ${online ? '' : 'opacity-60'} ${is_admin ? 'hover:cursor-pointer' : 'hover:cursor-default'}`}
        >
            <Avatar size="s" url={avatar_url} color={color} letter={nickname.slice(0, 1)} />
            {/* Nickname */}
            <p
                className={`m-0 p-[0_0_0_8px] text-text-primary font-secondary leading-normal text-[1.25rem] font-medium ${online ? '' : 'animate-pulse'}`}
                style={{color: color}}
            >
                {nickname}
            </p>
            {/* Icons */}
            <div className="flex items-center">
                {admin && (
                    <div
                        className={`text-text-primary h-[14px] w-[12px] box-border m-[0_0_0_4px] ${online ? '' : 'animate-pulse'}`}
                    >
                        <Shield />
                    </div>
                )}
                {muted && (
                    <div
                        className={`text-text-secondary h-[12px] w-[12px] box-border m-[0_-2px_0_4px] ${online ? '' : 'animate-pulse'}`}
                    >
                        <Mute />
                    </div>
                )}
            </div>
        </li>
    );
};

export default Member;
