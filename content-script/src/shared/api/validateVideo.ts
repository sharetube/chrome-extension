const validateVideo = (url: string): Promise<string> =>
    new Promise((resolve, reject) => {
        const regex =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

        const match = url.match(regex);
        if (match && match[2].length === 11) {
            fetch("https://www.youtube.com/oembed?url=" + url).then(res =>
                res.status === 200 ? resolve(match[2]) : reject("Invalid URL"),
            );
        } else {
            reject("Invalid URL");
        }
    });

export default validateVideo;
