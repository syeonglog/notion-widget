let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: 'ink3rZtrTGQ',

        playerVars: {
            autoplay: 0,
            // mute: 1,
            modestbranding: 1,
            rel: 0
        }
    });
}

function playVideo() {
    player.playVideo();
}

function pauseVideo() {
    player.pauseVideo();
}

function toggleMute() {
    if(player.isMuted()) {
        player.unMute();
    }
    else {
        player.mute();
    }
}