import log from "@shared/lib/log";
import React, { ReactNode, createContext, useEffect, useState } from "react";

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
    const [isAdmin, setIsAdmin] = useState<boolean>(true);

    useEffect(() => {}, []);

    return <AdminContext.Provider value={{ is_admin: isAdmin }}>{children}</AdminContext.Provider>;
};

export { AdminContext, AdminProvider };
