import { readdir, readFile, writeFile } from 'node:fs/promises';

const siteDir = new URL('../', import.meta.url);
const files = (await readdir(siteDir)).filter(name => /^chart-\d{4}\.htm$/i.test(name)).sort();
const decoder = new TextDecoder('windows-1252');
const clean = value => value.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&#39;/g, "'").replace(/&quot;/gi, '"').replace(/\s+/g, ' ').trim();
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const entries = [];

for (const file of files) {
  const html = decoder.decode(await readFile(new URL(file, siteDir)));
  const year = Number(file.match(/\d{4}/)[0]);
  let month = '';
  for (const match of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const row = match[1];
    const heading = clean(row);
    const monthMatch = heading.match(/Top 40 Hits of\s+(.+?)(?:\s+\d{4})?$/i);
    if (monthMatch) { month = monthMatch[1].replace(new RegExp(`\\s+${year}$`), ''); continue; }
    const cells = [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(x => clean(x[1]));
    if (cells.length < 4 || !/^\d+$/.test(cells[1]) || !cells[2] || !cells[3]) continue;
    entries.push({year, month, artist: cells[2], title: cells[3], page: file, anchor: month ? `#top-40-hits-of-${slug(month)}-${year}` : ''});
  }
}

await writeFile(new URL('../search-data.js', import.meta.url), `window.CHART_SEARCH_DATA=${JSON.stringify(entries)};\n`, 'utf8');
console.log(`Indexed ${entries.length} chart rows from ${files.length} year pages.`);
