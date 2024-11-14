import React from "react";

import Shield from "@shared/ui/Shield/Shield";

interface MemberProps {
    name: string;
    avatar: string;
    color: string;
    isAdmin: true;
}

const Member: React.FC<MemberProps> = props => {
    return (
        <li className="st-member fill items-center justify-between p-[2px_8px]">
            <div
                className="st-member__avatar bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${props.avatar})`,
                }}
            ></div>
            <div
                className={`bg-cover bg-center bg-no-repeat ${props.avatar}`}
            ></div>
            <p className="">{props.name}</p>
        </li>
    );
};

export default Member;
