import log from "@shared/lib/log";

// Fetch link from the server and copy it to the clipboard
//TODO: Add fetch
const copyLink = () => {
    const link = "https://sharetube.io/room/123456";
    navigator.clipboard.writeText(link);
    log("Link copied to clipboard:", link);
};

export default copyLink;
