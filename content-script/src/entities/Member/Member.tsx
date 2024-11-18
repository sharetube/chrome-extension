import React from "react";

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
     * Member avatar url, default is two letters from nickname
     */
    avatar?: string;
    /**
     * Member color
     */
    color: string;
}

const Member: React.FC<MemberProps> = ({ id, nickname, avatar, color }) => {
    return (
        <li className="st-member flex items-center">
            {/* Avatar */}
            <div className="rounded-full bg-cover bg-center bg-no-repeat">
                {/* Show two letters if no avatar */}
                {avatar && <p>{nickname}</p>}
            </div>
        </li>
    );
};

export default Member;
