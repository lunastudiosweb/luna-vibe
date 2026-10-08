const params = new URLSearchParams(window.location.search);
const songId = params.get("song");

const songPage = document.getElementById("song-page");

const song = songs.find(song => song.id === songId);

if (!song) {

    songPage.innerHTML = `
        <section class="song-not-found">

            <p class="eyebrow">LUNA VIBE</p>

            <h1>Song not found.</h1>

            <p>
                The song you're looking for doesn't exist
                or may have been removed.
            </p>

            <a href="index.html" class="song-back">
                Back to Luna Vibe
            </a>

        </section>
    `;

} else {

    songPage.innerHTML = `

        <section class="song-page">

            <div class="song-main">

                <img
                    class="song-cover-large"
                    src="${song.cover}"
                    alt="${song.title} cover"
                >

                <div class="song-details-large">

                    <p class="eyebrow">LUNA VIBE</p>

                    <h1>${song.title}</h1>

                    <p class="song-artist">
                        ${song.artist}
                    </p>


                    <div class="song-player">

                        <div class="song-player-controls">

                            <button
                                class="song-player-button"
                                id="play-button"
                                aria-label="Play song"
                            >
                                ▶
                            </button>

                            <div class="song-player-content">

                                <div class="song-player-top">

                                    <span class="song-player-title">
                                        ${song.title}
                                    </span>

                                    <span
                                        class="song-player-time"
                                        id="time-display"
                                    >
                                        0:00 / 0:00
                                    </span>

                                </div>

                                <input
                                    type="range"
                                    class="song-progress"
                                    id="progress"
                                    value="0"
                                    min="0"
                                    max="100"
                                >

                            </div>

                        </div>

                    </div>


                    <div class="song-description">

                        <h2>ABOUT THIS SONG</h2>

                        <p>
                            ${song.description || "No description provided."}
                        </p>

                    </div>

                    <audio id="audio" preload="metadata">
                        <source
                            src="${song.audio}"
                            type="audio/mpeg"
                        >
                    </audio>

                </div>

            </div>

        </section>

    `;


    const audio = document.getElementById("audio");
    const playButton = document.getElementById("play-button");
    const progress = document.getElementById("progress");
    const timeDisplay = document.getElementById("time-display");


    playButton.addEventListener("click", () => {

        if (audio.paused) {

            audio.play();

            playButton.textContent = "Ⅱ";

        } else {

            audio.pause();

            playButton.textContent = "▶";

        }

    });


    audio.addEventListener("loadedmetadata", () => {

        timeDisplay.textContent =
            `0:00 / ${formatTime(audio.duration)}`;

    });


    audio.addEventListener("timeupdate", () => {

        if (!audio.duration) return;

        const percentage =
            (audio.currentTime / audio.duration) * 100;

        progress.value = percentage;

        timeDisplay.textContent =
            `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;

    });


    progress.addEventListener("input", () => {

        if (!audio.duration) return;

        audio.currentTime =
            (progress.value / 100) * audio.duration;

    });


    audio.addEventListener("ended", () => {

        playButton.textContent = "▶";
        progress.value = 0;

    });

}


function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;

}