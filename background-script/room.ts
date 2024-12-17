import { BackgroundMessagingClient } from "./api/ExtensionClient";
import { ExtensionMessageType } from "types/extensionMessage";
import { user } from "types/user";

const messagingClient = BackgroundMessagingClient.getInstance();

/**
 * All handlers for frontend test, no logic
 */

messagingClient.addHandler(ExtensionMessageType.GET_ADMIN_STATUS, () => {
    return true;
});

messagingClient.addHandler(ExtensionMessageType.GET_PLAYLIST, () => {
    return [
        {
            id: "JTvcpdfGUtQ",
        },
        {
            id: "1PNS8Iytt0o",
        },
        {
            id: "WJ0rVFr8wLU",
        },
        {
            id: "6Fd3NPLiac8",
        },
        {
            id: "JTvcpdfGUtQ",
        },
        {
            id: "JTvcpdfGUtQ",
        },
        {
            id: "1PNS8Iytt0o",
        },
        {
            id: "WJ0rVFr8wLU",
        },
        {
            id: "6Fd3NPLiac8",
        },
        {
            id: "JTvcpdfGUtQ",
        },
    ];
});

messagingClient.addHandler(ExtensionMessageType.GET_USERS, (): user[] => {
    return [
        {
            id: "1",
            avatar_url:
                "https://cdn.forbes.ru/forbes-static/new/2022/04/IMG-10983445-624a99e258c99.jpg",
            username: "PashaDurov",
            color: "#FF5722",
            admin: false,
            muted: false,
            online: true,
        },
        {
            id: "2",
            avatar_url: "https://s0.rbk.ru/v6_top_pics/media/img/7/68/756589457932687.jpg",
            username: "DA",
            color: "#4CAF50",
            muted: false,
            admin: false,
            online: true,
        },
        {
            id: "3",
            avatar_url: "https://i1.sndcdn.com/artworks-000747843388-q3nc5y-t500x500.jpg",
            username: "Use(use)",
            color: "#2196F3",
            admin: false,
            muted: false,
            online: false,
        },
        {
            id: "4",
            avatar_url:
                "https://i.pinimg.com/originals/6d/4d/4d/6d4d4d900546e1337e5e6deb1db3714c.gif",
            username: "Geroin 2",
            color: "#FFC107",
            admin: false,
            muted: false,
            online: true,
        },
        {
            id: "5",
            avatar_url:
                "https://static.mk.ru/upload/entities/2023/07/10/20/articles/detailPicture/fc/02/20/47/354f1c68ac686f7d1b0cb10be532b284.jpg",
            username: "EvgenikaPonasenk",
            color: "#9C27B0",
            admin: false,
            muted: false,
            online: true,
        },
        {
            id: "6",
            username: "MishaZAbivch",
            color: "#E91E63",
            avatar_url: "https://media4.giphy.com/media/GRk3GLfzduq1NtfGt5/200w.gif",
            admin: false,
            muted: false,
            online: true,
        },
        {
            id: "7",
            avatar_url: "",
            username: "Vladik",
            color: "#00BCD4",
            admin: false,
            muted: false,
            online: true,
        },
    ];
});

messagingClient.addHandler(ExtensionMessageType.ADD_VIDEO, (payload: string) => {
    console.log(payload);
});
