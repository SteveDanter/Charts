(() => {
  const remote = location.protocol === 'https:' || location.hostname.endsWith('github.io');
  const message = document.getElementById('localMessage');
  const links = document.querySelectorAll('a.track-link[href^="Music/"]');

  if (remote) {
    links.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        message.hidden = false;
        message.classList.remove('show');
        void message.offsetWidth;
        message.classList.add('show');
      });
    });
    return;
  }

  const player = document.createElement('aside');
  player.className = 'track-player';
  player.hidden = true;
  player.setAttribute('aria-label', 'Music player');
  player.innerHTML = `
    <div class="player-copy"><strong></strong><span></span></div>
    <audio controls preload="metadata"></audio>
    <a class="player-fallback" target="_blank" rel="noopener" hidden>Open separately</a>
    <button class="player-stop" type="button">Stop</button>`;
  document.body.appendChild(player);

  const audio = player.querySelector('audio');
  const song = player.querySelector('strong');
  const artist = player.querySelector('.player-copy span');
  const fallback = player.querySelector('.player-fallback');
  const stopButton = player.querySelector('.player-stop');
  let activeLink = null;

  function stopPlayback(returnFocus = false) {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    player.hidden = true;
    fallback.hidden = true;
    document.body.classList.remove('player-active');
    if (returnFocus && activeLink) activeLink.focus({preventScroll: true});
    activeLink = null;
  }

  links.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      activeLink = link;
      const row = link.closest('tr');
      song.textContent = row?.querySelector('.title span')?.textContent || 'Selected track';
      artist.textContent = row?.querySelector('.artist')?.textContent || '';
      fallback.href = link.href;
      fallback.hidden = true;
      player.hidden = false;
      document.body.classList.add('player-active');
      audio.src = link.href;
      audio.play().catch(() => { fallback.hidden = false; });
    });
  });

  audio.addEventListener('ended', () => stopPlayback(false));
  audio.addEventListener('error', () => { if (audio.src) fallback.hidden = false; });
  stopButton.addEventListener('click', () => stopPlayback(true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !player.hidden) stopPlayback(true);
  });
})();
