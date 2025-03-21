document.addEventListener('DOMContentLoaded', function () {
    const audio = document.querySelector('audio');
    const playlistSource = document.querySelector('ul.playlist');
    const playlist = [];
    let currentTrackIndex = 0;

    // Extract playlist data
    playlistSource.querySelectorAll('li a').forEach(link => {
        const item = {
            source: link.getAttribute('href'),
            title: link.textContent.trim()
        };
        playlist.push(item);
    });

    // Hide the original playlist if desired
    // playlistSource.style.display = 'none';

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function loadTrack(index, autoplay = false) {
        if (index >= 0 && index < playlist.length) {
            currentTrackIndex = index;
            audio.src = playlist[index].source;
            document.querySelector('#titel').textContent = playlist[index].title;

            // Reset player state
            const playPauseButton = document.querySelector('#play-pause-icon');
            const durationCircle = document.querySelector('#duration');
            const circleLength = 2 * Math.PI * parseFloat(durationCircle.getAttribute('r'));

            durationCircle.style.strokeDashoffset = circleLength;

            if (!autoplay) {
                playPauseButton.setAttribute('aria-pressed', 'false');
                playPauseButton.setAttribute('aria-label', 'Play audio');
            } else {
                playPauseButton.setAttribute('aria-pressed', 'true');
                playPauseButton.setAttribute('aria-label', 'Pause audio');
            }

            document.querySelector('#current-time').textContent = '0:00';

            // Load metadata to update duration display
            audio.load();

            // If autoplay is requested, start playing after loading
            if (autoplay) {
                audio.play();
            }
        }
    }

    function createPlayer() {
        // Remove default controls
        audio.removeAttribute('controls');

        // Insert custom player HTML
        audio.insertAdjacentHTML('afterend', `
      <div id="audio-player">
        <div id="display">
          <svg viewBox="-49 -49 99 99">
            <circle r="45" id="background"/>
            <circle r="45" id="duration" style="stroke-dasharray: 282; stroke-dashoffset: 282;"/>
          </svg>
          <label for="play-pause-icon">Audio Player</label>
          <button id="play-pause-icon" aria-label="Play audio" aria-pressed="false"></button>
          <p>
            <span id="current-time" class="time">0:00</span> / 
            <span id="duration-time" class="time">0:00</span>
          </p>
        </div>
        <div id="controls">
          <button id="back" aria-label="gehe zum vorherigen Titel" aria-pressed="false"></button>
          <p id="titel">Titel</p>
          <button id="next" aria-label="gehe zum nächsten Titel" aria-pressed="false"></button>
        </div>    
      </div>
    `);

        // Set up play/pause functionality
        const playPauseButton = document.querySelector('#play-pause-icon');
        const durationCircle = document.querySelector('#duration');
        const currentTimeDisplay = document.querySelector('#current-time');
        const durationTimeDisplay = document.querySelector('#duration-time');
        const circleLength = 2 * Math.PI * parseFloat(durationCircle.getAttribute('r'));

        durationCircle.style.strokeDasharray = circleLength;
        durationCircle.style.strokeDashoffset = circleLength;

        playPauseButton.addEventListener('click', function () {
            const isPlaying = playPauseButton.getAttribute('aria-pressed') === 'true';
            if (!isPlaying) {
                // Start audio playback
                audio.play();
                playPauseButton.setAttribute('aria-pressed', 'true');
                playPauseButton.setAttribute('aria-label', 'Pause audio');
            } else {
                // Pause audio playback
                audio.pause();
                playPauseButton.setAttribute('aria-pressed', 'false');
                playPauseButton.setAttribute('aria-label', 'Play audio');
            }
        });

        // Set up next/previous track buttons
        const nextButton = document.querySelector('#next');
        const backButton = document.querySelector('#back');

        nextButton.addEventListener('click', function () {
            const isPlaying = playPauseButton.getAttribute('aria-pressed') === 'true';
            loadTrack((currentTrackIndex + 1) % playlist.length, isPlaying);
        });

        backButton.addEventListener('click', function () {
            const isPlaying = playPauseButton.getAttribute('aria-pressed') === 'true';
            loadTrack((currentTrackIndex - 1 + playlist.length) % playlist.length, isPlaying);
        });

        // Audio event listeners
        audio.addEventListener('loadedmetadata', function () {
            if (audio.duration) {
                durationTimeDisplay.textContent = formatTime(audio.duration);
            }
        });

        audio.addEventListener('timeupdate', function () {
            if (audio.duration) {
                const progress = audio.currentTime / audio.duration;
                const dashOffset = circleLength * (1 - progress);
                durationCircle.style.strokeDashoffset = dashOffset;
                currentTimeDisplay.textContent = formatTime(audio.currentTime);
            }
        });

        audio.addEventListener('ended', function () {
            durationCircle.style.strokeDashoffset = circleLength;
            playPauseButton.setAttribute('aria-pressed', 'false');
            playPauseButton.setAttribute('aria-label', 'Play audio');
            currentTimeDisplay.textContent = '0:00';

            // Auto-play next track when current track ends
            loadTrack((currentTrackIndex + 1) % playlist.length, true);
        });
    }

    // Initialize player
    createPlayer();

    // Load the first track if playlist is not empty
    if (playlist.length > 0) {
        loadTrack(0);
    }
});
