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

    useEffect(() => {
        ContentScriptMessagingClient.getInstance()
            .sendMessage(ExtensionMessageType.GET_ADMIN_STATUS, null)
            .then(payload => {
                setIsAdmin(payload);
            });
    }, []);

    useEffect(() => {
        ContentScriptMessagingClient.getInstance().addHandler(
            ExtensionMessageType.ADMIN_STATUS_UPDATED,
            payload => {
                setIsAdmin(payload);
            },
        );
    }, []);

    return <AdminContext.Provider value={{ is_admin: isAdmin }}>{children}</AdminContext.Provider>;
};

export { AdminContext, AdminProvider };
