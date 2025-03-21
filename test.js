document.addEventListener('DOMContentLoaded', function () {
  const audio = document.querySelector('audio');

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function createPlayer() {
    audio.removeAttribute('controls');
    audio.insertAdjacentHTML('afterend',
      `
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
                <div id="controls"><button id="back" aria-label="gehe zum vorherigen Titel" aria-pressed="false"></button>
                    <p id="titel">Titel</p>
                    <button id="next" aria-label="gehe zum nächsten Titel" aria-pressed="false"></button>
                </div>    
            </div>
        `
    );
    // Eventlistener für den Play/Pause-Button
    const playPauseButton = document.querySelector('#play-pause-icon');
    const durationCircle = document.querySelector('#duration');
    const currentTimeDisplay = document.querySelector('#current-time');
    const durationTimeDisplay = document.querySelector('#duration-time');
    const circleLength = 2 * Math.PI * parseFloat(durationCircle.getAttribute(
      'r'));
    durationCircle.style.strokeDasharray = circleLength;
    durationCircle.style.strokeDashoffset = circleLength;
    playPauseButton.addEventListener('click', function () {
      const isPlaying = playPauseButton.getAttribute('aria-pressed') ===
        'true';
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
    });
  }
  createPlayer();
});
document.addEventListener('DOMContentLoaded', function () {
  const playlistSource = document.querySelector('ul.playlist');
  const playlist = [];
  // Loop through all list items and extract data
  playlistSource.querySelectorAll('li a')
    .forEach(link => {
      const item = {
        source: link.getAttribute('href'),
        title: link.textContent.trim()
      };
      playlist.push(item);
    });
  console.log(JSON.stringify(playlist, null, 2));
});

