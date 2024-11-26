import Member from "@entities/Member/Member";
import React, { useCallback, useEffect, useState } from "react";

const initialUsers = [
    {
        id: "1",
        avatar: "https://cdn.forbes.ru/forbes-static/new/2022/04/IMG-10983445-624a99e258c99.jpg",
        nickname: "PashaDurov",
        color: "#FF5722",
        admin: true,
        muted: false,
        online: true,
    },
    {
        id: "2",
        avatar: "https://s0.rbk.ru/v6_top_pics/media/img/7/68/756589457932687.jpg",
        nickname: "ArtemkaProhor",
        color: "#4CAF50",
        muted: true,
        admin: false,
        online: true,
    },
    {
        id: "3",
        avatar: "https://i1.sndcdn.com/artworks-000747843388-q3nc5y-t500x500.jpg",
        nickname: "Use(use)",
        color: "#2196F3",
        admin: true,
        muted: true,
        online: false,
    },
    {
        id: "4",
        avatar: "https://i.pinimg.com/originals/6d/4d/4d/6d4d4d900546e1337e5e6deb1db3714c.gif",
        nickname: "Geroin 2",
        color: "#FFC107",
        admin: false,
        muted: true,
        online: true,
    },
    {
        id: "5",
        avatar: "https://static.mk.ru/upload/entities/2023/07/10/20/articles/detailPicture/fc/02/20/47/354f1c68ac686f7d1b0cb10be532b284.jpg",
        nickname: "EvgenikaPonasenk",
        color: "#9C27B0",
        admin: false,
        muted: false,
        online: false,
    },
    {
        id: "6",
        nickname: "MishaZAbivch",
        color: "#E91E63",
        avatar: "https://media4.giphy.com/media/GRk3GLfzduq1NtfGt5/200w.gif",
        admin: false,
        muted: false,
        online: true,
    },
    {
        id: "7",
        nickname: "Vladik",
        color: "#00BCD4",
        admin: true,
        muted: true,
        online: true,
    },
];

interface RoomProps {
    callback: (usersCount: number) => void;
}

const Room: React.FC<RoomProps> = props => {
    const [users, setUsers] = useState(initialUsers);

    const memoizedCallback = useCallback(() => {
        props.callback(users.length);
    }, [props.callback, users.length]);

    useEffect(() => {
        memoizedCallback();
    }, [memoizedCallback]);

    return (
        <ul className="st-room grid grid-cols-2 gap-[16px_0] p-[10px_12px] m-0 relative">
            {users.map(user => (
                <Member
                    key={user.id}
                    id={user.id}
                    nickname={user.nickname}
                    avatar={user.avatar}
                    color={user.color}
                    admin={user.admin}
                    muted={user.muted}
                    online={user.online}
                />
            ))}
        </ul>
    );
};

export default Room;
