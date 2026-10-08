const form = document.getElementById("submission-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const artist = document.getElementById("artist").value.trim();
    const song = document.getElementById("song").value.trim();
    const email = document.getElementById("email").value.trim();
    const link = document.getElementById("link").value.trim();
    const description = document.getElementById("description").value.trim();
    const rights = document.getElementById("rights").checked;

    if (!rights) {
        status.textContent = "You must confirm that you have the rights to submit this music.";
        return;
    }

    const subject = encodeURIComponent(
        `Luna Vibe Submission — ${song}`
    );

    const body = encodeURIComponent(
`LUNA VIBE MUSIC SUBMISSION

Artist:
${artist}

Song:
${song}

Contact Email:
${email}

Song Link:
${link}

Description:
${description}

Rights Confirmation:
I confirm that I own this music or have permission from the rights holder to submit it to Luna Vibe.`
    );

    window.location.href =
        `mailto:luna.studio.websites@gmail.com?subject=${subject}&body=${body}`;
});