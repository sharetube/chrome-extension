import { AdminContext } from "../Admin";
import log from "@shared/lib/log";
import { useContext } from "react";

const useAdmin = () => {
    const context = useContext(AdminContext);

    if (context === undefined) {
        log("useAdmin must be used within a AdminProvider");
    }

    return context;
};

export default useAdmin;
