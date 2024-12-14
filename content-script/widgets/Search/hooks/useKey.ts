import { useEffect, useRef } from "react";

function useKey(key: string) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            if (event.key === key) {
                inputRef.current?.focus();
                event.preventDefault();
            }
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }, [key]);

    return inputRef;
}

export default useKey;
