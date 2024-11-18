// Extend the Document interface to include vendor-prefixed fullscreen properties
interface Document extends globalThis.Document {
    webkitFullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
}

export default Document;
