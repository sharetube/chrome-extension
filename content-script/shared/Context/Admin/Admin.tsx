import { ContentScriptMessagingClient } from "@shared/client/client";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { ExtensionMessageType } from "types/extensionMessage";

interface AdminContextType {
    is_admin: boolean;
}

const AdminContext = createContext<AdminContextType>({
    is_admin: false,
});

interface MyProviderProps {
    children: ReactNode;
}

const AdminProvider: React.FC<MyProviderProps> = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const messagingClient = new ContentScriptMessagingClient();

    useEffect(() => {
        ContentScriptMessagingClient.sendMessage(ExtensionMessageType.GET_IS_ADMIN).then(
            payload => {
                setIsAdmin(payload);
            },
        );

        const handler = (payload: boolean) => {
            setIsAdmin(payload);
        };

        messagingClient.addHandler(ExtensionMessageType.ADMIN_STATUS_UPDATED, handler);
    }, []);

    return <AdminContext.Provider value={{ is_admin: isAdmin }}>{children}</AdminContext.Provider>;
};

export { AdminContext, AdminProvider };
