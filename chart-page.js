(() => {
  const remote = location.protocol === 'https:' || location.hostname.endsWith('github.io');
  if (!remote) return;
  const message = document.getElementById('localMessage');
  document.querySelectorAll('a.track-link[href^="Music/"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      message.hidden = false;
      message.classList.remove('show');
      void message.offsetWidth;
      message.classList.add('show');
    });
  });
})();
