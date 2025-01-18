export function getVideoUrlFromLink(link: string): string {
    const match = link.match(/^https:\/\/(www\.)?(youtu\.be|youtube\.com)\/watch\?v=([^&]+)/);
    return match ? match[3] : "";
}
