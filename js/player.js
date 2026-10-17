
const songList = document.getElementById("song-list");
const searchInput = document.getElementById("song-search");
const searchFilter = document.getElementById("search-filter");
const searchCount = document.getElementById("search-count");
const noSearchResults = document.getElementById("no-search-results");

/*
========================================
MINI PLAYER ELEMENTS
========================================
*/

const miniPlayer = document.getElementById("mini-player");
const miniCover = document.getElementById("mini-cover");
const miniTitle = document.getElementById("mini-title");
const miniArtist = document.getElementById("mini-artist");
const miniPlay = document.getElementById("mini-play");
const miniStop = document.getElementById("mini-stop");
const miniClose = document.getElementById("mini-close");
const miniProgress = document.getElementById("mini-progress");
const miniCurrentTime = document.getElementById("mini-current-time");
const miniDuration = document.getElementById("mini-duration");

let currentlyPlayingAudio = null;
let pendingAudio = null;
let playbackRequestId = 0;
let miniAudio = null;
let miniDismissed = false;

/*
========================================
TIME FORMATTING
========================================
*/

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
}

/*
========================================
MINI PLAYER DISPLAY
========================================
*/

function showMiniPlayer(audio) {
    const card = audio.closest(".song-card");

    if (!card || !miniPlayer) return;

    miniAudio = audio;
    miniDismissed = false;

    const cover = card.querySelector(".song-cover");
    const title = card.querySelector(".song-title-link h3");
    const artist = card.querySelector(".song-details p");

    miniCover.src = cover ? cover.src : "";
    miniCover.alt = cover ? cover.alt : "";
    miniTitle.textContent = title
        ? title.textContent.replace(/\s*NEW\s*$/, "").trim()
        : "Unknown song";
    miniArtist.textContent = artist ? artist.textContent : "";

    miniPlayer.hidden = false;

    updateMiniPlayer();
}

function updateMiniPlayer() {
    if (!miniAudio) return;

    const audio = miniAudio;

    miniPlay.textContent = audio.paused ? "▶" : "Ⅱ";
    miniPlay.setAttribute(
        "aria-label",
        audio.paused ? "Play song" : "Pause song"
    );

    miniCurrentTime.textContent = formatTime(audio.currentTime);
    miniDuration.textContent = formatTime(audio.duration);

    if (
        Number.isFinite(audio.duration) &&
        audio.duration > 0
    ) {
        miniProgress.value =
            (audio.currentTime / audio.duration) * 100;
    } else {
        miniProgress.value = 0;
    }
}

/*
========================================
SAFE AUDIO METADATA LOADING
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

        audio.addEventListener("loadedmetadata", onLoaded);
        audio.addEventListener("error", onError);

        timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error("Audio metadata loading timed out."));
        }, 15000);

        audio.load();
    });
}

/*
========================================
RESET AUDIO AND VERIFY 0:00
========================================
*/

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

        audio.addEventListener("seeked", onSeeked);
        audio.addEventListener("error", onError);

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

/*
========================================
SAFE PLAY FROM 0:00
========================================
*/

async function playAudioFromBeginning(audio) {
    const requestId = ++playbackRequestId;

    try {
        if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
            const oldAudio = currentlyPlayingAudio;
            oldAudio.pause();

            if (oldAudio.readyState >= HTMLMediaElement.HAVE_METADATA) {
                oldAudio.currentTime = 0;
            }

            const oldButton = oldAudio
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
            throw new Error("Playback blocked: audio is not at 0:00.");
        }

        await audio.play();

        if (requestId !== playbackRequestId) {
            audio.pause();

            if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
                audio.currentTime = 0;
            }

            return false;
        }

        currentlyPlayingAudio = audio;
        showMiniPlayer(audio);

        return true;

    } catch (error) {
        console.error("Luna Vibe playback safety check failed:", error);

        audio.pause();

        const button = audio.closest(".song-card")
            ?.querySelector(".play-button");

        if (button) button.textContent = "▶";

        return false;

    } finally {
        if (pendingAudio === audio) {
            pendingAudio = null;
        }
    }
}

/*
========================================
MINI PLAYER PLAY / PAUSE
========================================
*/

miniPlay.addEventListener("click", async () => {
    if (!miniAudio) return;

    const audio = miniAudio;

    if (!audio.paused) {
        audio.pause();
        updateMiniPlayer();
        return;
    }

    // If stopped or finished, start safely from 0:00.
    if (audio.ended || audio.currentTime === 0) {
        await playAudioFromBeginning(audio);
        updateMiniPlayer();
        return;
    }

    // Resume this song from its current position.
    const requestId = ++playbackRequestId;

    try {
        if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
            currentlyPlayingAudio.pause();
        }

        if (pendingAudio && pendingAudio !== audio) {
            pendingAudio.pause();
        }

        pendingAudio = audio;

        await waitForAudioMetadata(audio);

        if (requestId !== playbackRequestId) return;

        await audio.play();

        if (requestId !== playbackRequestId) {
            audio.pause();
            return;
        }

        currentlyPlayingAudio = audio;
        showMiniPlayer(audio);

    } catch (error) {
        console.error("Could not resume Luna Vibe song:", error);
    } finally {
        if (pendingAudio === audio) {
            pendingAudio = null;
        }

        updateMiniPlayer();
    }
});

/*
========================================
MINI PLAYER STOP
========================================
*/

miniStop.addEventListener("click", () => {
    if (!miniAudio) return;

    const audio = miniAudio;

    // Cancel any playback request still in progress.
    playbackRequestId++;

    if (pendingAudio === audio) {
        pendingAudio = null;
    }

    audio.pause();

    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        try {
            audio.currentTime = 0;
        } catch (error) {
            console.error("Could not reset song:", error);
        }
    }

    if (currentlyPlayingAudio === audio) {
        currentlyPlayingAudio = null;
    }

    const button = audio.closest(".song-card")
        ?.querySelector(".play-button");

    if (button) button.textContent = "▶";

    updateMiniPlayer();
});

/*
========================================
MINI PLAYER CLOSE
========================================
*/

miniClose.addEventListener("click", () => {
    miniDismissed = true;
    miniPlayer.hidden = true;
});

/*
========================================
MINI PLAYER SEEK BAR
========================================
*/

miniProgress.addEventListener("input", () => {
    if (!miniAudio || !Number.isFinite(miniAudio.duration)) {
        return;
    }

    if (miniAudio.duration <= 0) return;

    miniAudio.currentTime =
        (Number(miniProgress.value) / 100) * miniAudio.duration;

    updateMiniPlayer();
});

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
            <button class="play-button"
                    type="button"
                    aria-label="Play ${song.title}">▶</button>

            <button class="loop-button"
                    type="button"
                    aria-label="Loop ${song.title}"
                    aria-pressed="false">LOOP</button>

            <div class="volume-control">
                <button class="volume-button"
                        type="button"
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

            updateMiniPlayer();
            return;
        }

        const started = await playAudioFromBeginning(audio);

        playButton.textContent = started ? "Ⅱ" : "▶";
    });

    /*
    VOLUME
    */

    volumeSlider.addEventListener("input", () => {
        audio.volume = Number(volumeSlider.value) / 100;

        if (audio.volume > 0) {
            previousVolume = audio.volume;
        }

        updateVolumeButton();
    });

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

        if (miniAudio === audio) {
            updateMiniPlayer();
        }
    });

    /*
    TIME AND PROGRESS
    */

    audio.addEventListener("timeupdate", () => {
        if (audio.duration > 0) {
            progressBar.value =
                (audio.currentTime / audio.duration) * 100;

            timeDisplay.textContent =
                `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        }

        if (miniAudio === audio) {
            updateMiniPlayer();
        }
    });

    /*
    SONG CARD SEEKING
    */

    progressBar.addEventListener("input", () => {
        if (!audio.duration) return;

        audio.currentTime =
            (Number(progressBar.value) / 100) * audio.duration;
    });

    /*
    AUDIO PLAY / PAUSE EVENTS
    */

    audio.addEventListener("play", () => {
        playButton.textContent = "Ⅱ";
        showMiniPlayer(audio);
    });

    audio.addEventListener("pause", () => {
        if (!audio.ended) {
            playButton.textContent = "▶";
        }

        if (miniAudio === audio) {
            updateMiniPlayer();
        }
    });

    /*
    SONG ENDED / AUTOPLAY NEXT
    */

    audio.addEventListener("ended", async () => {
        playButton.textContent = "▶";
        progressBar.value = 0;

        timeDisplay.textContent =
            `0:00 / ${formatTime(audio.duration)}`;

        if (currentlyPlayingAudio === audio) {
            currentlyPlayingAudio = null;
        }

        if (miniAudio === audio) {
            updateMiniPlayer();
        }

        if (loopEnabled) {
            const restarted = await playAudioFromBeginning(audio);
            playButton.textContent = restarted ? "Ⅱ" : "▶";
            return;
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

    noSearchResults.hidden =
        cards.length === 0 || visibleCount !== 0;

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
