
const songs = [
    {
        id: "song1",
        title: "Gonna go Gambling",
        artist: "Oricade",
        cover: "images/covers/song1.jpg",
        audio: "music/song1.mp3",
        description: "The first release.",
        releaseDate: "2026-10-08"
    },
    {
        id: "song2",
        title: "Pick The Other Side",
        artist: "Oricade",
        cover: "images/covers/song2.jpg",
        audio: "music/song2.mp3",
        description: "The second release.",
        releaseDate: "2026-10-09"
    },
    {
        id: "song3",
        title: "Locked Away",
        artist: "CG5",
        cover: "images/covers/song3.jpg",
        audio: "music/song3.mp3",
        description: "The third release.",
        releaseDate: "2026-10-10"
    },
    {
        id: "song4",
        title: "Your Silly Femboy DocterDaryl Cover",
        artist: "DocterDaryl",
        cover: "images/covers/song4.png",
        audio: "music/song4.mp3",
        description: "The fourth release.",
        releaseDate: "2026-10-10"
    },
    {
        id: "song5",
        title: "Your Little Warden",
        artist: "Oricade",
        cover: "images/covers/song5.jpg",
        audio: "music/song5.mp3",
        description: "The fifth release.",
        releaseDate: "2026-10-11"
    },
    {
        id: "song6",
        title: "plot twist 10",
        artist: "Oricade",
        cover: "images/covers/song6.jpg",
        audio: "music/song6.mp3",
        description: "The sixth release.",
        releaseDate: "2026-10-12"
    },
    {
        id: "song7",
        title: "forgettable smile",
        artist: "Oricade",
        cover: "images/covers/song7.jpg",
        audio: "music/song7.mp3",
        description: "The seventh release.",
        releaseDate: "2026-10-13"
    },
    {
        id: "song8",
        title: "Over And Over Again",
        artist: "Oricade",
        cover: "images/covers/song8.jpg",
        audio: "music/song8.mp3",
        description: "The eighth release.",
        releaseDate: "2026-10-14"
    },
    {
        id: "song9",
        title: "taking my whole life tonight",
        artist: "Oricade",
        cover: "images/covers/song9.jpg",
        audio: "music/song9.mp3",
        description: "The ninth release.",
        releaseDate: "2026-10-15"
    },
    {
        id: "song10",
        title: "i think that i'm dead",
        artist: "Oricade",
        cover: "images/covers/song10.jpg",
        audio: "music/song10.mp3",
        description: "The tenth release.",
        releaseDate: "2026-10-16"
    },
    {
        id: "song11",
        title: "Can't stay with you",
        artist: "Oricade",
        cover: "images/covers/song11.jpg",
        audio: "music/song11.mp3",
        description: "The eleventh release.",
        releaseDate: "2026-10-17"
    },
    {
        id: "song12",
        title: "LOCKED IN AMMONIA",
        artist: "Oricade",
        cover: "images/covers/song12.jpg",
        audio: "music/song12.mp3",
        description: "The twelfth release.",
        releaseDate: "2026-10-18"
    },
    {
        id: "song13",
        title: "Slow Ride Alive",
        artist: "Oricade",
        cover: "images/covers/song13.jpg",
        audio: "music/song13.mp3",
        description: "The thirteenth release.",
        releaseDate: "2026-10-19"
    },
    {
        id: "song14",
        title: "I always wanted you",
        artist: "Oricade",
        cover: "images/covers/song14.jpg",
        audio: "music/song14.mp3",
        description: "The fourteenth release.",
        releaseDate: "2026-10-20"
    },
    {
        id: "song15",
        title: "locked in pneumonia",
        artist: "Oricade",
        cover: "images/covers/song15.jpg",
        audio: "music/song15.mp3",
        description: "The fifteenth release.",
        releaseDate: "2026-10-21"
    },
    {
        id: "song16",
        title: "your microwave",
        artist: "Oricade",
        cover: "images/covers/song16.jpg",
        audio: "music/song16.mp3",
        description: "The sixteenth release.",
        releaseDate: "2026-10-22"
    },
    {
        id: "song17",
        title: "RDX",
        artist: "Oricade",
        cover: "images/covers/song17.jpg",
        audio: "music/song17.mp3",
        description: "The seventeenth release.",
        releaseDate: "2026-10-23"
    },
    {
        id: "song18",
        title: "Sleep Well",
        artist: "CG5",
        cover: "images/covers/song18.jpg",
        audio: "music/song18.mp3",
        description: "The eighteenth release.",
        releaseDate: "2026-10-24"
    },
    {
        id: "song19",
        title: "Lyin 2 me - Among us",
        artist: "CG5",
        cover: "images/covers/song19.jpg",
        audio: "music/song19.mp3",
        description: "The nineteenth release.",
        releaseDate: "2026-10-25"
    },
    {
        id: "song20",
        title: "I see a dreamer",
        artist: "CG5",
        cover: "images/covers/song20.jpg",
        audio: "music/song20.mp3",
        description: "The twentieth release.",
        releaseDate: "2026-10-26"
    },
    {
        id: "song21",
        title: "Masquerade party",
        artist: "CG5",
        cover: "images/covers/song21.jpg",
        audio: "music/song21.mp3",
        description: "The twenty-first release.",
        releaseDate: "2026-10-27"
    },
    {
        id: "song22",
        title: "Song 22 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song22.jpg",
        audio: "music/song22.mp3",
        description: "The twenty-second release.",
        releaseDate: "2026-10-28"
    },
    {
        id: "song23",
        title: "Song 23 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song23.jpg",
        audio: "music/song23.mp3",
        description: "The twenty-third release.",
        releaseDate: "2026-10-29"
    },
    {
        id: "song24",
        title: "Song 24 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song24.jpg",
        audio: "music/song24.mp3",
        description: "The twenty-fourth release.",
        releaseDate: "2026-10-30"
    },
    {
        id: "song25",
        title: "Song 25 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song25.jpg",
        audio: "music/song25.mp3",
        description: "The twenty-fifth release.",
        releaseDate: "2026-10-31"
    },
    {
        id: "song26",
        title: "Song 26 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song26.jpg",
        audio: "music/song26.mp3",
        description: "The twenty-sixth release.",
        releaseDate: "2026-11-01"
    },
    {
        id: "song27",
        title: "Song 27 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song27.jpg",
        audio: "music/song27.mp3",
        description: "The twenty-seventh release.",
        releaseDate: "2026-11-02"
    },
    {
        id: "song28",
        title: "Song 28 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song28.jpg",
        audio: "music/song28.mp3",
        description: "The twenty-eighth release.",
        releaseDate: "2026-11-03"
    },
    {
        id: "song29",
        title: "Song 29 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song29.jpg",
        audio: "music/song29.mp3",
        description: "The twenty-ninth release.",
        releaseDate: "2026-11-04"
    },
    {
        id: "song30",
        title: "Song 30 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song30.jpg",
        audio: "music/song30.mp3",
        description: "The thirtieth release.",
        releaseDate: "2026-11-05"
    },
    {
        id: "song31",
        title: "Song 31 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song31.jpg",
        audio: "music/song31.mp3",
        description: "The thirty-first release.",
        releaseDate: "2026-11-06"
    },
    {
        id: "song32",
        title: "Song 32 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song32.jpg",
        audio: "music/song32.mp3",
        description: "The thirty-second release.",
        releaseDate: "2026-11-07"
    },
    {
        id: "song33",
        title: "Song 33 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song33.jpg",
        audio: "music/song33.mp3",
        description: "The thirty-third release.",
        releaseDate: "2026-11-08"
    },
    {
        id: "song34",
        title: "Song 34 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song34.jpg",
        audio: "music/song34.mp3",
        description: "The thirty-fourth release.",
        releaseDate: "2026-11-09"
    },
    {
        id: "song35",
        title: "Song 35 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song35.jpg",
        audio: "music/song35.mp3",
        description: "The thirty-fifth release.",
        releaseDate: "2026-11-10"
    },
    {
        id: "song36",
        title: "Song 36 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song36.jpg",
        audio: "music/song36.mp3",
        description: "The thirty-sixth release.",
        releaseDate: "2026-11-11"
    },
    {
        id: "song37",
        title: "Song 37 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song37.jpg",
        audio: "music/song37.mp3",
        description: "The thirty-seventh release.",
        releaseDate: "2026-11-12"
    },
    {
        id: "song38",
        title: "Song 38 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song38.jpg",
        audio: "music/song38.mp3",
        description: "The thirty-eighth release.",
        releaseDate: "2026-11-13"
    },
    {
        id: "song39",
        title: "Song 39 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song39.jpg",
        audio: "music/song39.mp3",
        description: "The thirty-ninth release.",
        releaseDate: "2026-11-14"
    },
    {
        id: "song40",
        title: "Song 40 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song40.jpg",
        audio: "music/song40.mp3",
        description: "The fortieth release.",
        releaseDate: "2026-11-15"
    },
    {
        id: "song41",
        title: "Song 41 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song41.jpg",
        audio: "music/song41.mp3",
        description: "The forty-first release.",
        releaseDate: "2026-11-16"
    },
    {
        id: "song42",
        title: "Song 42 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song42.jpg",
        audio: "music/song42.mp3",
        description: "The forty-second release.",
        releaseDate: "2026-11-17"
    },
    {
        id: "song43",
        title: "Song 43 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song43.jpg",
        audio: "music/song43.mp3",
        description: "The forty-third release.",
        releaseDate: "2026-11-18"
    },
    {
        id: "song44",
        title: "Song 44 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song44.jpg",
        audio: "music/song44.mp3",
        description: "The forty-fourth release.",
        releaseDate: "2026-11-19"
    },
    {
        id: "song45",
        title: "Song 45 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song45.jpg",
        audio: "music/song45.mp3",
        description: "The forty-fifth release.",
        releaseDate: "2026-11-20"
    },
    {
        id: "song46",
        title: "Song 46 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song46.jpg",
        audio: "music/song46.mp3",
        description: "The forty-sixth release.",
        releaseDate: "2026-11-21"
    },
    {
        id: "song47",
        title: "Song 47 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song47.jpg",
        audio: "music/song47.mp3",
        description: "The forty-seventh release.",
        releaseDate: "2026-11-22"
    },
    {
        id: "song48",
        title: "Song 48 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song48.jpg",
        audio: "music/song48.mp3",
        description: "The forty-eighth release.",
        releaseDate: "2026-11-23"
    },
    {
        id: "song49",
        title: "Song 49 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song49.jpg",
        audio: "music/song49.mp3",
        description: "The forty-ninth release.",
        releaseDate: "2026-11-24"
    },
    {
        id: "song50",
        title: "Song 50 - Coming Soon",
        artist: "Unknown",
        cover: "images/covers/song50.jpg",
        audio: "music/song50.mp3",
        description: "The fiftieth release.",
        releaseDate: "2026-11-25"
    }
];
