import Member from "@entities/Member/Member";
import { ContentScriptMessagingClient } from "@shared/client/client";
import React, { useCallback, useEffect, useState } from "react";
import { ExtensionMessageType } from "types/extensionMessage";
import type { Member as IMember } from "types/serverMessage";

interface RoomProps {
    callback: (usersCount: number) => void;
}

const Room: React.FC<RoomProps> = ({ callback }) => {
    const [users, setUsers] = useState<IMember[]>([]);
    const [loading, setLoading] = useState(true);

    const memoizedCallback = useCallback(() => {
        callback(users.length);
    }, [callback, users.length]);

    useEffect(() => {
        memoizedCallback();
    }, [memoizedCallback]);

    useEffect(() => {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_MEMBERS, null).then(
            payload => {
                setUsers(payload);
                setLoading(false);
            },
        );
    }, []);

    const messagingClient = new ContentScriptMessagingClient();

    useEffect(() => {
        const handler = (payload: IMember[] | null): void => {
            payload && setUsers(payload);
            setLoading(false);
        };

        messagingClient.addHandler(ExtensionMessageType.MEMBERS_UPDATED, handler);

        return () => {
            messagingClient.removeHandler(ExtensionMessageType.MEMBERS_UPDATED);
        };
    }, []);

    if (loading) {
        return <div className="h-[100px]">Loading...</div>;
    }

    return (
        <ul className="st-room grid grid-cols-2 gap-[16px_0] p-[10px_12px] m-0 select-none">
            {users.map(user => (
                <Member key={user.id} {...user} />
            ))}
        </ul>
    );
};

export default Room;