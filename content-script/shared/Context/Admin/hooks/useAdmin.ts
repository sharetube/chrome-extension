import { AdminContext } from "../Admin";
import { useContext } from "react";

const useAdmin = () => {
    const context = useContext(AdminContext);

    if (context === undefined) {
        console.log("useAdmin must be used within a AdminProvider");
    }

    return context;
};

export default useAdmin;
