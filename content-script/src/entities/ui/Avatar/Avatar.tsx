import React from "react";

interface AvatarProps {
    url?: string;
    text?: string;
}

const Avatar: React.FC<AvatarProps> = ({ url, text }) => {
    if (url) {
        return (
            <div
                className="h-[40px] w-[40px] rounded-full bg-cover bg-center bg-no-repeat outline outline-2 outline-spec-outline"
                style={{ backgroundImage: `url(${url})` }}
            ></div>
        );
    }

    return (
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-[12px] outline outline-2 outline-spec-outline">
            <p className="text-text-primary">{text}</p>
        </div>
    );
};

export default Avatar;
