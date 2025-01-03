import debounce from "lodash.debounce";
import { useEffect, useState } from "react";

const useFullScreenResize = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const handleFullScreenChange = () => {
            if (document.fullscreenElement) {
                setIsFullScreen(true);
            } else {
                setIsFullScreen(false);
            }
        };

        const handleResize = () => {
            const video = document.querySelector("ytd-player");
            if (video && !document.fullscreenElement) {
                setHeight(video.clientHeight);
            } else if (document.fullscreenElement) {
                setHeight(400);
            }
        };

        const debouncedHandleResize = debounce(handleResize, 100);

        document.addEventListener("fullscreenchange", handleFullScreenChange);
        window.addEventListener("resize", debouncedHandleResize);

        handleResize();

        return () => {
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
            window.removeEventListener("resize", debouncedHandleResize);
        };
    }, []);

    return { isFullScreen, height };
};

export default useFullScreenResize;
