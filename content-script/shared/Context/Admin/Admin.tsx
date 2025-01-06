import { ContentScriptMessagingClient } from "@shared/client/client";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { log } from "shared/log";
import {
    ExtensionMessagePayloadMap as EMPM,
    ExtensionMessageResponseMap as EMRM,
    ExtensionMessageType as EMType,
} from "types/extensionMessage";

interface AdminContextType {
    isAdmin: boolean;
}

const AdminContext = createContext<AdminContextType>({
    isAdmin: false,
});

interface MyProviderProps {
    children: ReactNode;
}

const AdminProvider: React.FC<MyProviderProps> = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const messagingClient = new ContentScriptMessagingClient();

    useEffect(() => {
        ContentScriptMessagingClient.sendMessage(EMType.GET_IS_ADMIN).then(
            (res: EMRM[EMType.GET_IS_ADMIN]) => {
                log("isAdmin set", res);
                setIsAdmin(res);
            },
        );

        messagingClient.addHandler(
            EMType.ADMIN_STATUS_UPDATED,
            (payload: EMPM[EMType.ADMIN_STATUS_UPDATED]) => {
                setIsAdmin(payload);
            },
        );
    }, []);

    return <AdminContext.Provider value={{ isAdmin }}>{children}</AdminContext.Provider>;
};

export { AdminContext, AdminProvider };
