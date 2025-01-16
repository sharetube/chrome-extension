const getVideoUrlFromLink = (link: string): Promise<string> =>
    new Promise((resolve, reject) => {
        if (link.length < 11) {
            reject("Invalid URL");
            return;
        }

        const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
        const match = link.match(regex);
        if (match && match[2].length === 11) {
            resolve(match[2]);
        } else {
            reject("Invalid URL");
        }
    });

export default getVideoUrlFromLink;
