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
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        log("Admin Provider data", { isAdmin: isAdmin });
        const fetchData = async () => {
            try {
                setIsAdmin(false);
            } catch (error) {
                log("Error from Admin Provider", error);
            }
        };

        fetchData();
    }, []);

    return (
        <AdminContext.Provider value={{ is_admin: isAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};

export { AdminContext, AdminProvider };
