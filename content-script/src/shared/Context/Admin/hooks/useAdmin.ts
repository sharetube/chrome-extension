import log from "@shared/lib/log";
import { useContext } from "react";

import { AdminContext } from "../Admin";

const useAdmin = () => {
    const context = useContext(AdminContext);

    if (context === undefined) {
        log("useAdmin must be used within a AdminProvider");
    }

    return context;
};

export default useAdmin;
