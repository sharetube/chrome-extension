class State {
    constructor() {
        this.roomId = null;
        this.videos = [];
        this.videoId = null;
        this.members = [];
        this.creatorId = null;
    }

    init(roomId, videos, videoId, members, creatorId) {
        this.roomId = roomId;
        this.videos = videos;
        this.videoId = videoId;
        this.members = members;
        this.creatorId = creatorId;
    }
}
