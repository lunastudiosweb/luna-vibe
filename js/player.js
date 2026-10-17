
const songList = document.getElementById("song-list");
const searchInput = document.getElementById("song-search");
const searchFilter = document.getElementById("search-filter");
const searchCount = document.getElementById("search-count");
const noSearchResults = document.getElementById("no-search-results");

let currentlyPlayingAudio = null;
let pendingAudio = null;
let playbackRequestId = 0;

/*
========================================
SAFE PLAYBACK SYSTEM
ALWAYS START SONGS AT 0:00
========================================
*/

function waitForAudioMetadata(audio) {
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        let timeoutId;

        const cleanup = () => {
            audio.removeEventListener("loadedmetadata", onLoaded);
            audio.removeEventListener("error", onError);
            clearTimeout(timeoutId);
        };

        const onLoaded = () => {
            cleanup();
            resolve();
        };

        const onError = () => {
            cleanup();
            reject(new Error("Could not load audio metadata."));
        };

        audio.addEventListener("loadedmetadata", onLoaded, { once: true });
        audio.addEventListener("error", onError, { once: true });

        timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error("Audio metadata loading timed out."));
        }, 15000);

        audio.load();
    });
}

function resetAudioToBeginning(audio) {
    return new Promise((resolve, reject) => {
        if (audio.readyState < HTMLMediaElement.HAVE_METADATA) {
            reject(new Error("Audio metadata is not ready."));
            return;
        }

        if (audio.currentTime === 0 && !audio.seeking) {
            resolve();
            return;
        }

        let timeoutId;

        const cleanup = () => {
            audio.removeEventListener("seeked", onSeeked);
            audio.removeEventListener("error", onError);
            clearTimeout(timeoutId);
        };

        const onSeeked = () => {
            if (Math.abs(audio.currentTime) <= 0.05 && !audio.seeking) {
                cleanup();
                resolve();
            } else {
                cleanup();
                reject(new Error("Audio did not reset to 0:00."));
            }
        };

        const onError = () => {
            cleanup();
            reject(new Error("Audio failed during reset."));
        };

        audio.addEventListener("seeked", onSeeked, { once: true });
        audio.addEventListener("error", onError, { once: true });

        timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error("Audio reset timed out."));
        }, 7000);

        try {
            audio.currentTime = 0;

            if (audio.currentTime === 0 && !audio.seeking) {
                cleanup();
                resolve();
            }
        } catch (error) {
            cleanup();
            reject(error);
        }
    });
}

async function playAudioFromBeginning(audio) {
    const requestId = ++playbackRequestId;

    try {
        if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
            currentlyPlayingAudio.pause();
            currentlyPlayingAudio.currentTime = 0;

            const oldButton = currentlyPlayingAudio
                .closest(".song-card")
                ?.querySelector(".play-button");

            if (oldButton) oldButton.textContent = "▶";
        }

        if (pendingAudio && pendingAudio !== audio) {
            pendingAudio.pause();
        }

        audio.pause();
        pendingAudio = audio;

        await waitForAudioMetadata(audio);

        if (requestId !== playbackRequestId) return false;

        await resetAudioToBeginning(audio);

        if (requestId !== playbackRequestId) return false;

        if (Math.abs(audio.currentTime) > 0.05 || audio.seeking) {
            throw new Error("Playback blocked: starting position is not 0:00.");
        }

        await audio.play();

        if (requestId !== playbackRequestId) {
            audio.pause();
            audio.currentTime = 0;
            return false;
        }

        currentlyPlayingAudio = audio;
        return true;

    } catch (error) {
        console.error("Luna Vibe playback safety check failed:", error);

        audio.pause();

        const button = audio.closest(".song-card")
            ?.querySelector(".play-button");

        if (button) button.textContent = "▶";

        return false;

    } finally {
        if (pendingAudio === audio) pendingAudio = null;
    }
}

/*
========================================
FILTER PLACEHOLDER SONGS AND SORT
========================================
*/

const sortedSongs = [...songs]
    .filter(song => {
        const number = song.id.replace("song", "");
        const defaultTitle = `Song ${number} - Coming Soon`;

        return !(
            song.title.trim() === defaultTitle &&
            song.artist.trim() === "Unknown"
        );
    })
    .sort((a, b) => {
        return new Date(b.releaseDate) - new Date(a.releaseDate);
    });

/*
========================================
FORMAT TIME
========================================
*/

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
}

/*
========================================
NEW RELEASE CHECK
========================================
*/

function isNewRelease(date) {
    if (!date) return false;

    const release = new Date(`${date}T00:00:00`);
    const now = new Date();
    const difference = now - release;
    const days = difference / (1000 * 60 * 60 * 24);

    return days >= 0 && days <= 14;
}

/*
========================================
CREATE SONG CARD
========================================
*/

function createSong(song, songIndex) {
    const songCard = document.createElement("article");

    songCard.className = "song-card";
    songCard.dataset.songTitle = song.title.trim().toLowerCase();
    songCard.dataset.songArtist = song.artist.trim().toLowerCase();

    const releaseDate = song.releaseDate
        ? new Date(`${song.releaseDate}T00:00:00`).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        )
        : "Release date unavailable";

    const releaseLabel = isNewRelease(song.releaseDate)
        ? `<span class="new-release">NEW</span>`
        : "";

    songCard.innerHTML = `
        <div class="song-info">
            <a class="song-link"
               href="song.html?song=${encodeURIComponent(song.id)}">
                <img class="song-cover"
                     src="${song.cover}"
                     alt="${song.title} cover">
            </a>

            <div class="song-details">
                <a class="song-title-link"
                   href="song.html?song=${encodeURIComponent(song.id)}">
                    <h3>${song.title} ${releaseLabel}</h3>
                </a>

                <p>${song.artist}</p>
                <span class="release-date">${releaseDate}</span>
            </div>
        </div>

        <div class="music-player">
            <button class="play-button" aria-label="Play ${song.title}">▶</button>

            <button class="loop-button"
                    aria-label="Loop ${song.title}"
                    aria-pressed="false">LOOP</button>

            <div class="volume-control">
                <button class="volume-button"
                        aria-label="Mute ${song.title}"
                        aria-pressed="false">VOL</button>

                <input type="range"
                       class="volume-slider"
                       min="0" max="100" value="100"
                       aria-label="Volume for ${song.title}">
            </div>

            <div class="player-content">
                <div class="player-top">
                    <span class="player-title">${song.title}</span>
                    <span class="player-time">0:00 / 0:00</span>
                </div>

                <input type="range"
                       class="progress-bar"
                       value="0" min="0" max="100"
                       aria-label="Seek through ${song.title}">
            </div>

            <audio preload="metadata">
                <source src="${song.audio}" type="audio/mpeg">
            </audio>
        </div>
    `;

    const audio = songCard.querySelector("audio");
    const playButton = songCard.querySelector(".play-button");
    const loopButton = songCard.querySelector(".loop-button");
    const volumeButton = songCard.querySelector(".volume-button");
    const volumeSlider = songCard.querySelector(".volume-slider");
    const progressBar = songCard.querySelector(".progress-bar");
    const timeDisplay = songCard.querySelector(".player-time");

    let loopEnabled = false;
    let previousVolume = 1;

    /*
    PLAY / PAUSE
    */

    playButton.addEventListener("click", async () => {
        if (!audio.paused || pendingAudio === audio) {
            playbackRequestId++;

            audio.pause();
            playButton.textContent = "▶";

            if (currentlyPlayingAudio === audio) {
                currentlyPlayingAudio = null;
            }

            if (pendingAudio === audio) {
                pendingAudio = null;
            }

            return;
        }

        const started = await playAudioFromBeginning(audio);

        if (started) {
            playButton.textContent = "Ⅱ";
        }
    });

    /*
    VOLUME SLIDER
    */

    volumeSlider.addEventListener("input", () => {
        audio.volume = Number(volumeSlider.value) / 100;

        if (audio.volume > 0) {
            previousVolume = audio.volume;
        }

        updateVolumeButton();
    });

    /*
    MUTE / UNMUTE
    */

    volumeButton.addEventListener("click", () => {
        if (audio.volume > 0) {
            previousVolume = audio.volume;
            audio.volume = 0;
        } else {
            audio.volume = previousVolume || 1;
        }

        volumeSlider.value = audio.volume * 100;
        updateVolumeButton();
    });

    function updateVolumeButton() {
        const muted = audio.volume === 0;

        volumeButton.textContent = muted ? "MUTED" : "VOL";

        volumeButton.setAttribute("aria-pressed", String(muted));

        volumeButton.setAttribute(
            "aria-label",
            muted ? `Unmute ${song.title}` : `Mute ${song.title}`
        );

        volumeSlider.setAttribute(
            "aria-valuetext",
            `${Math.round(audio.volume * 100)}%`
        );
    }

    /*
    LOOP
    */

    loopButton.addEventListener("click", () => {
        loopEnabled = !loopEnabled;

        loopButton.setAttribute("aria-pressed", String(loopEnabled));
        loopButton.textContent = loopEnabled ? "LOOP ON" : "LOOP";
    });

    /*
    AUDIO METADATA
    */

    audio.addEventListener("loadedmetadata", () => {
        timeDisplay.textContent =
            `0:00 / ${formatTime(audio.duration)}`;
    });

    /*
    PROGRESS AND TIME
    */

    audio.addEventListener("timeupdate", () => {
        if (!audio.duration) return;

        progressBar.value = (audio.currentTime / audio.duration) * 100;

        timeDisplay.textContent =
            `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    });

    /*
    MANUAL SEEKING
    */

    progressBar.addEventListener("input", () => {
        if (!audio.duration) return;

        audio.currentTime =
            (Number(progressBar.value) / 100) * audio.duration;
    });

    /*
    SONG ENDED / AUTOPLAY NEXT
    */

    audio.addEventListener("ended", async () => {
        if (loopEnabled) {
            const restarted = await playAudioFromBeginning(audio);
            playButton.textContent = restarted ? "Ⅱ" : "▶";
            return;
        }

        playButton.textContent = "▶";
        progressBar.value = 0;

        timeDisplay.textContent =
            `0:00 / ${formatTime(audio.duration)}`;

        if (currentlyPlayingAudio === audio) {
            currentlyPlayingAudio = null;
        }

        const nextIndex = songIndex + 1;

        if (nextIndex >= sortedSongs.length) return;

        const allSongCards = songList.querySelectorAll(".song-card");
        const nextSongCard = allSongCards[nextIndex];

        if (!nextSongCard) return;

        const nextAudio = nextSongCard.querySelector("audio");
        const nextButton = nextSongCard.querySelector(".play-button");

        if (!nextAudio) return;

        const started = await playAudioFromBeginning(nextAudio);

        if (nextButton) {
            nextButton.textContent = started ? "Ⅱ" : "▶";
        }
    });

    /*
    AUDIO PAUSED
    */

    audio.addEventListener("pause", () => {
        if (!audio.ended) {
            playButton.textContent = "▶";
        }
    });

    /*
    AUDIO PLAYING
    */

    audio.addEventListener("play", () => {
        playButton.textContent = "Ⅱ";
    });

    songList.appendChild(songCard);
}

/*
========================================
SEARCH AND FILTERS
========================================
*/

function filterSongs() {
    const query = searchInput.value.trim().toLowerCase();
    const filter = searchFilter.value;
    const cards = songList.querySelectorAll(".song-card");

    let visibleCount = 0;

    cards.forEach(card => {
        const title = card.dataset.songTitle;
        const artist = card.dataset.songArtist;

        let matches;

        if (!query) {
            matches = true;
        } else if (filter === "artist") {
            matches = artist.includes(query);
        } else if (filter === "title") {
            matches = title.includes(query);
        } else {
            matches = title.includes(query) || artist.includes(query);
        }

        card.hidden = !matches;

        if (matches) visibleCount++;
    });

    noSearchResults.hidden = cards.length === 0 || visibleCount !== 0;

    searchCount.textContent = sortedSongs.length === 0
        ? ""
        : `Showing ${visibleCount} of ${cards.length} songs`;
}

searchInput.addEventListener("input", filterSongs);
searchFilter.addEventListener("change", filterSongs);

/*
========================================
LOAD SONGS
========================================
*/

songList.innerHTML = "";

if (sortedSongs.length === 0) {
    songList.innerHTML = `
        <div class="empty-state">
            <p>No music has been released yet.</p>
        </div>
    `;
} else {
    sortedSongs.forEach((song, index) => {
        createSong(song, index);
    });
}

filterSongs();
