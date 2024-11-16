import React, { useEffect, useState } from "react";

import Avatar from "@entities/ui/Avatar/Avatar";
import SharedButton from "@entities/ui/SharedButton/SharedButton";

const initialUsers = [
    {
        id: 1,
        avatar: "https://avatars.githubusercontent.com/u/47269217?v=4",
        nickname: "ArtemkaProhorov",
    },
    {
        id: 2,
        avatar: "https://avatars.githubusercontent.com/u/47269217?v=4",
        nickname: "ArtemkaProhor",
    },
    {
        id: 3,
        avatar: "https://avatars.githubusercontent.com/u/47269217?v=4",
        nickname: "Use(use)",
    },
    {
        id: 4,
        avatar: "https://avatars.githubusercontent.com/u/47269217?v=4",
        nickname: "EvgenikaPonasenk",
    },
    {
        id: 5,
        avatar: "https://avatars.githubusercontent.com/u/47269217?v=4",
        nickname: "EvgenikaPonasenk",
    },
    {
        id: 6,
        nickname: "EvgenikaPonasenk",
    },
    {
        id: 7,
        nickname: "EvgenikaPonasenk",
    },
];

const Room: React.FC = () => {
    const [users, setUsers] = useState(initialUsers);
    const [isFull, setIsFull] = useState(false);

    const addHandler = () => {
        setUsers(prevUsers => [
            ...prevUsers,
            {
                id: prevUsers.length + 1,
                avatar: "https://avatars.githubusercontent.com/u/47269217?v=4",
                nickname: "EvgenikaPonasenk",
            },
        ]);
    };

    useEffect(() => {
        users.length === 9 && setIsFull(true);
    }, [users]);

    return (
        <div className="grid grid-cols-3 grid-rows-3 p-0">
            {users.map(user => (
                <div
                    key={user.id}
                    className="m-[0_0_6px] flex h-[75px] flex-col items-center justify-start"
                >
                    <Avatar
                        url={user.avatar}
                        text={user.avatar ? "" : user.nickname.slice(0, 2)}
                    />
                    <span className="m-[4px_0] text-center text-[12px] text-text-primary">
                        {user.nickname}
                    </span>
                </div>
            ))}
            {!isFull && (
                <div
                    className="m-[0_0_6px] flex h-[75px] flex-col items-center justify-start hover:cursor-pointer"
                    onClick={addHandler}
                >
                    <SharedButton />
                    <span className="m-[4px_0] text-center text-[12px] text-text-primary">
                        Copy link
                    </span>
                </div>
            )}
        </div>
    );
};

export default Room;
