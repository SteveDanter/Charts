(() => {
  const years = Array.from({length: 35}, (_, i) => 1956 + i);
  const collections = [
    ['Top 10 of the 1950s','top-10-of-the-50s.htm'],['Top 10 of the 1960s','top-10-of-the-60s.htm'],['Top 10 of the 1970s','top-10-of-the-70s.htm'],
    ['Top 10 of the 1980s','top-10-of-the-80s.htm'],['Top 10 of the 1990s','top-10-of-the-90s.htm'],['Top 10 of the 2000s','top-10-of-the-00s.htm'],
    ['Top albums of the 1960s','top-10-albums-of-the-60s.htm'],['Top albums of the 1970s','top-10-albums-of-the-70s.htm'],['Top albums of the 1980s','top-10-albums-of-the-80s.htm'],
    ['Top albums of the 1990s','top-10-albums-of-the-90s.htm'],['Top albums of the 2000s','top-10-albums-of-the-00s.htm'],['All-time best singles','all-time-best-ever-singles.htm'],
    ['Eurovision winners','eurovision-winners.htm'],['One-hit wonders','one-hit-wonders.htm']
  ];
  const $ = id => document.getElementById(id);
  const yearGrid = $('yearGrid'), decadeTabs = $('decadeTabs'), yearFilter = $('yearFilter');
  let decade = 'all', shown = 50, matches = [];

  years.forEach(year => yearFilter.add(new Option(year, year)));
  function renderYears() {
    const visible = years.filter(y => decade === 'all' || Math.floor(y / 10) * 10 === Number(decade));
    yearGrid.innerHTML = visible.map(y => `<a class="year-card" href="chart-${y}.htm"><strong>${y}</strong><span>Open charts →</span></a>`).join('');
  }
  ['all',1950,1960,1970,1980,1990].forEach(d => {
    const button = document.createElement('button'); button.type = 'button';
    button.textContent = d === 'all' ? 'All years' : `${d}s`;
    button.className = d === decade ? 'active' : '';
    button.onclick = () => { decade = d; [...decadeTabs.children].forEach(x => x.classList.toggle('active', x === button)); renderYears(); };
    decadeTabs.appendChild(button);
  });
  $('collectionGrid').innerHTML = collections.map(([name,file]) => `<a class="collection-card" href="${file}"><strong>${name}</strong><span>Explore collection →</span></a>`).join('');
  renderYears();

  const data = Array.isArray(window.CHART_SEARCH_DATA) ? window.CHART_SEARCH_DATA : [];
  const input = $('searchInput'), clear = $('clearButton'), status = $('searchStatus');
  status.textContent = data.length ? `${data.length.toLocaleString()} chart entries ready` : 'Catalogue unavailable';
  const normal = s => String(s || '').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  function runSearch() {
    const query = normal(input.value).trim(); const selectedYear = yearFilter.value;
    clear.hidden = !query && !selectedYear; shown = 50;
    if (!query && !selectedYear) { $('resultsSection').hidden = true; return; }
    const terms = query.split(/\s+/).filter(Boolean);
    matches = data.filter(x => (!selectedYear || String(x.year) === selectedYear) && terms.every(t => normal(`${x.artist} ${x.title} ${x.year}`).includes(t)));
    renderResults();
  }
  function renderResults() {
    $('resultsSection').hidden = false;
    $('resultCount').textContent = `${matches.length.toLocaleString()} result${matches.length === 1 ? '' : 's'}`;
    $('results').innerHTML = matches.length ? matches.slice(0, shown).map(x => `<a class="result" href="${x.page}${x.anchor || ''}"><span class="result-year">${x.year || '—'}</span><span class="result-artist">${escape(x.artist)}</span><span class="result-title">${escape(x.title)}</span><span class="result-month">${escape(x.month || 'Open chart')} →</span></a>`).join('') : '<div class="empty">No chart entries match that search. Try fewer words or a different year.</div>';
    $('loadMore').hidden = shown >= matches.length;
  }
  function escape(value) { const node = document.createElement('span'); node.textContent = value || ''; return node.innerHTML; }
  input.addEventListener('input', runSearch); yearFilter.addEventListener('change', runSearch);
  $('searchForm').addEventListener('submit', e => e.preventDefault());
  clear.onclick = () => { input.value=''; yearFilter.value=''; runSearch(); input.focus(); };
  $('loadMore').onclick = () => { shown += 50; renderResults(); };
})();
