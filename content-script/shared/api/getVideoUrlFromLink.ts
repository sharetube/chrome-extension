export function getVideoUrlFromLink(link: string): string {
    const match = link.match(
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/|live\/)?)([\w-]{11})(\S+)?$/,
    );
    return match ? match[5] : "";
}
