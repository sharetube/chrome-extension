import data from '../types/data';

const video = (id: string, retries: number = 3): Promise<data> => {
    const fetchVideoInfo = (attempt: number): Promise<data> =>
        fetch(`https://www.youtube.com/oembed?url=https://youtube.com/watch?v=${id}`)
            .then(res => res.json())
            .then(data => ({
                title: data.title,
                author_name: data.author_name,
                thumbnail_url: data.thumbnail_url,
                author_url: data.author_url,
            }))
            .catch(error => {
                if (attempt < retries) return fetchVideoInfo(attempt + 1);
                throw error;
            });

    return fetchVideoInfo(0);
};

export default video;
