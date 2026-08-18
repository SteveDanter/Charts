import { readdir, readFile, writeFile } from 'node:fs/promises';

const siteDir = new URL('../', import.meta.url);
const files = (await readdir(siteDir)).filter(name => /^chart-\d{4}\.htm$/i.test(name)).sort();
const clean = value => value.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&#39;/g, "'").replace(/&quot;/gi, '"').replace(/\s+/g, ' ').trim();
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const entries = [];

for (const file of files) {
  const html = await readFile(new URL(file, siteDir), 'utf8');
  const year = Number(file.match(/\d{4}/)[0]);
  for (const match of html.matchAll(/<tr\b([^>]*)data-chart-row([^>]*)>([\s\S]*?)<\/tr>/gi)) {
    const attributes = `${match[1]} ${match[2]}`;
    const month = (attributes.match(/data-month="([^"]*)"/i) || [,''])[1];
    const cells = [...match[3].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(x => clean(x[1]));
    if (cells.length < 3 || !/^\d+$/.test(cells[0]) || !cells[1] || !cells[2]) continue;
    entries.push({year, month, artist: cells[1], title: cells[2], page: file, anchor: month ? `#${slug(`${month}-${year}`)}` : ''});
  }
}

await writeFile(new URL('../search-data.js', import.meta.url), `window.CHART_SEARCH_DATA=${JSON.stringify(entries)};\n`, 'utf8');
console.log(`Indexed ${entries.length} chart rows from ${files.length} year pages.`);
