const songList = document.getElementById("song-list");

let currentlyPlayingAudio = null;


function createSong(song, songIndex) {

    const songCard = document.createElement("article");

    songCard.className = "song-card";


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

            <a
                class="song-link"
                href="song.html?song=${encodeURIComponent(song.id)}"
            >

                <img
                    class="song-cover"
                    src="${song.cover}"
                    alt="${song.title} cover"
                >

            </a>


            <div class="song-details">

                <a
                    class="song-title-link"
                    href="song.html?song=${encodeURIComponent(song.id)}"
                >

                    <h3>
                        ${song.title}
                        ${releaseLabel}
                    </h3>

                </a>

                <p>${song.artist}</p>

                <span class="release-date">
                    ${releaseDate}
                </span>

            </div>

        </div>


        <div class="music-player">

            <button
                class="play-button"
                aria-label="Play ${song.title}"
            >
                ▶
            </button>

            <button
                class="loop-button"
                aria-label="Loop ${song.title}"
                aria-pressed="false"
            >
                LOOP
            </button>


            <div class="player-content">

                <div class="player-top">

                    <span class="player-title">
                        ${song.title}
                    </span>

                    <span class="player-time">
                        0:00 / 0:00
                    </span>

                </div>


                <input
                    type="range"
                    class="progress-bar"
                    value="0"
                    min="0"
                    max="100"
                >


            </div>


            <audio preload="metadata">

                <source
                    src="${song.audio}"
                    type="audio/mpeg"
                >

            </audio>

        </div>

    `;


    const audio =
        songCard.querySelector("audio");

    const playButton =
        songCard.querySelector(".play-button");

    const loopButton =
        songCard.querySelector(".loop-button");

    const progressBar =
        songCard.querySelector(".progress-bar");

    const timeDisplay =
        songCard.querySelector(".player-time");


    let loopEnabled = false;


    /*
    ========================================
    PLAY / PAUSE
    ========================================
    */

    playButton.addEventListener("click", () => {

        if (audio.paused) {

            /*
            Stop any other song that is currently playing.
            */

            if (
                currentlyPlayingAudio &&
                currentlyPlayingAudio !== audio
            ) {

                currentlyPlayingAudio.pause();

                currentlyPlayingAudio.currentTime = 0;

                const oldCard =
                    currentlyPlayingAudio.closest(".song-card");

                const oldButton =
                    oldCard?.querySelector(".play-button");

                if (oldButton) {
                    oldButton.textContent = "▶";
                }

            }


            audio.play();

            currentlyPlayingAudio = audio;

            playButton.textContent = "Ⅱ";

        } else {

            audio.pause();

            playButton.textContent = "▶";

        }

    });


    /*
    ========================================
    LOOP BUTTON
    ========================================
    */

    loopButton.addEventListener("click", () => {

        loopEnabled = !loopEnabled;

        loopButton.setAttribute(
            "aria-pressed",
            loopEnabled
        );


        if (loopEnabled) {

            loopButton.textContent = "LOOP ON";

        } else {

            loopButton.textContent = "LOOP";

        }

    });


    /*
    =========================================
    AUDIO METADATA
    =========================================
    */

    audio.addEventListener("loadedmetadata", () => {

        timeDisplay.textContent =
            `0:00 / ${formatTime(audio.duration)}`;

    });


    /*
    =========================================
    PROGRESS + TIME
    =========================================
    */

    audio.addEventListener("timeupdate", () => {

        if (!audio.duration) return;


        const progress =
            (audio.currentTime / audio.duration) * 100;


        progressBar.value = progress;


        timeDisplay.textContent =
            `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;

    });


    /*
    =========================================
    MANUAL SEEKING
    =========================================
    */

    progressBar.addEventListener("input", () => {

        if (!audio.duration) return;


        audio.currentTime =
            (progressBar.value / 100) * audio.duration;

    });


    /*
    =========================================
    SONG ENDED
    =========================================
    */

    audio.addEventListener("ended", () => {

        /*
        LOOP ENABLED
        */

        if (loopEnabled) {

            audio.currentTime = 0;

            audio.play();

            playButton.textContent = "Ⅱ";

            currentlyPlayingAudio = audio;

            return;

        }


        /*
        NORMAL AUTO-NEXT
        */

        playButton.textContent = "▶";

        progressBar.value = 0;

        timeDisplay.textContent =
            `0:00 / ${formatTime(audio.duration)}`;


        currentlyPlayingAudio = null;


        /*
        Find the next song in the sorted list.
        */

        const nextIndex =
            songIndex + 1;


        if (nextIndex >= sortedSongs.length) {

            return;

        }


        /*
        Find the next song card.
        */

        const allSongCards =
            document.querySelectorAll(".song-card");


        const nextSongCard =
            allSongCards[nextIndex];


        if (!nextSongCard) return;


        const nextAudio =
            nextSongCard.querySelector("audio");

        const nextButton =
            nextSongCard.querySelector(".play-button");


        /*
        Start the next song.
        */

        if (nextAudio) {

            nextAudio.play();

            currentlyPlayingAudio =
                nextAudio;

            if (nextButton) {
                nextButton.textContent = "Ⅱ";
            }

        }

    });


    /*
    =========================================
    AUDIO PAUSED
    =========================================
    */

    audio.addEventListener("pause", () => {

        /*
        Do not reset the song here.
        This allows normal pause/resume behavior.
        */

        if (!audio.ended) {

            playButton.textContent = "▶";

        }

    });


    songList.appendChild(songCard);

}



function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {

        return "0:00";

    }


    const minutes =
        Math.floor(seconds / 60);


    const remainingSeconds =
        Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");


    return `${minutes}:${remainingSeconds}`;

}



function isNewRelease(date) {

    if (!date) return false;


    const release =
        new Date(`${date}T00:00:00`);


    const now =
        new Date();


    const difference =
        now - release;


    const days =
        difference / (1000 * 60 * 60 * 24);


    return days >= 0 && days <= 14;

}



/* =========================================
   SORT NEWEST FIRST
   ========================================= */

const sortedSongs = [...songs].sort((a, b) => {

    return new Date(b.releaseDate) -
           new Date(a.releaseDate);

});



/* =========================================
   LOAD SONGS
   ========================================= */

if (sortedSongs.length === 0) {

    songList.innerHTML = `

        <div class="empty-state">

            <p>
                No music has been released yet.
            </p>

        </div>

    `;

} else {

    songList.innerHTML = "";


    sortedSongs.forEach((song, index) => {

        createSong(song, index);

    });

}
