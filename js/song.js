
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

                    <p class="song-artist">${song.artist}</p>

                    <div class="song-player">
                        <div class="song-player-controls">
                            <button
                                class="song-player-button"
                                id="play-button"
                                aria-label="Play song"
                            >▶</button>

                            <div class="song-player-content">
                                <div class="song-player-top">
                                    <span class="song-player-title">
                                        ${song.title}
                                    </span>

                                    <span
                                        class="song-player-time"
                                        id="time-display"
                                    >0:00 / 0:00</span>
                                </div>

                                <input
                                    type="range"
                                    class="song-progress"
                                    id="progress"
                                    value="0"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    aria-label="Song progress"
                                >
                            </div>
                        </div>

                        <div class="song-extra-controls">
                            <div class="volume-control">
                                <button
                                    class="volume-button"
                                    id="volume-button"
                                    type="button"
                                    aria-label="Mute"
                                    aria-pressed="false"
                                >VOL</button>

                                <input
                                    type="range"
                                    class="volume-slider"
                                    id="volume-slider"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value="1"
                                    aria-label="Volume"
                                >
                            </div>

                            <button
                                class="volume-button"
                                id="loop-button"
                                type="button"
                                aria-pressed="false"
                            >LOOP OFF</button>
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

    const volumeButton = document.getElementById("volume-button");
    const volumeSlider = document.getElementById("volume-slider");
    const loopButton = document.getElementById("loop-button");

    let previousVolume = 1;

    // PLAY / PAUSE

    playButton.addEventListener("click", async () => {
        if (audio.paused) {
            try {
                await audio.play();
            } catch (error) {
                console.error("Unable to play song:", error);
            }
        } else {
            audio.pause();
        }
    });

    audio.addEventListener("play", () => {
        playButton.textContent = "Ⅱ";
        playButton.setAttribute("aria-label", "Pause song");
    });

    audio.addEventListener("pause", () => {
        playButton.textContent = "▶";
        playButton.setAttribute("aria-label", "Play song");
    });

    // TIMESTAMPS

    audio.addEventListener("loadedmetadata", () => {
        timeDisplay.textContent =
            `0:00 / ${formatTime(audio.duration)}`;
    });

    audio.addEventListener("timeupdate", () => {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
            return;
        }

        progress.value =
            (audio.currentTime / audio.duration) * 100;

        timeDisplay.textContent =
            `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    });

    // SEEKING

    progress.addEventListener("input", () => {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
            return;
        }

        audio.currentTime =
            (Number(progress.value) / 100) * audio.duration;
    });

    // VOLUME SLIDER

    audio.volume = 1;

    volumeSlider.addEventListener("input", () => {
        const volume = Number(volumeSlider.value);

        audio.volume = volume;
        audio.muted = volume === 0;

        if (volume > 0) {
            previousVolume = volume;
        }

        updateVolumeButton();
    });

    // MUTE / UNMUTE

    volumeButton.addEventListener("click", () => {
        if (audio.muted || audio.volume === 0) {
            audio.muted = false;

            if (audio.volume === 0) {
                audio.volume = previousVolume || 1;
            }
        } else {
            previousVolume = audio.volume;
            audio.muted = true;
        }

        updateVolumeButton();
    });

    function updateVolumeButton() {
        const isMuted = audio.muted || audio.volume === 0;

        volumeButton.textContent = isMuted ? "MUTED" : "VOL";
        volumeButton.setAttribute("aria-pressed", String(isMuted));
        volumeButton.setAttribute(
            "aria-label",
            isMuted ? "Unmute song" : "Mute song"
        );

        volumeSlider.value = isMuted ? 0 : audio.volume;
    }

    // LOOP CURRENT SONG

    loopButton.addEventListener("click", () => {
        audio.loop = !audio.loop;

        loopButton.textContent = audio.loop ? "LOOP ON" : "LOOP OFF";
        loopButton.setAttribute("aria-pressed", String(audio.loop));
    });

    // RESET PLAYER WHEN SONG ENDS

    audio.addEventListener("ended", () => {
        playButton.textContent = "▶";
        playButton.setAttribute("aria-label", "Play song");
        progress.value = 0;
        timeDisplay.textContent =
            `0:00 / ${formatTime(audio.duration)}`;
    });
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
}
