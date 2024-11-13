const getVideoInfo = (id: string, retries: number = 3): Promise<any> => {
    return new Promise((resolve, reject) => {
        const fetchVideoInfo = (attempt: number) => {
            fetch(
                "https://www.youtube.com/oembed?url=https://youtube.com/watch?v=" +
                    id,
            )
                .then(res => res.json())
                .then(data => {
                    resolve({
                        title: data.title,
                        author_name: data.author_name,
                        thumbnail_url: data.thumbnail_url,
                        author_url: data.author_url,
                    });
                })
                .catch(error => {
                    if (attempt < retries) {
                        fetchVideoInfo(attempt + 1);
                    } else {
                        reject(error);
                    }
                });
        };

        fetchVideoInfo(0);
    });
};

export default getVideoInfo;
