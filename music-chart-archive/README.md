# UK Music Chart Archive

A static, searchable archive of UK chart pages from 1956–1990. It is designed to work in two ways:

- **GitHub Pages:** browsing and search work online; the private music library is not uploaded.
- **At home:** put the `Music` folder beside `index.html`, start the local server, and existing track links play from your collection.

## Use it locally

1. Copy or move your existing `Music` folder into this project folder. Do not commit it; `.gitignore` excludes it.
2. Right-click `start-local.ps1` and choose **Run with PowerShell**. It uses Python or Node.js if either is installed; your existing IIS setup can also serve the folder.
3. Open <http://localhost:8080> if it does not open automatically.

The expected layout is:

```text
music-chart-archive/
  index.html
  Music/                 # private, local, not in Git
  scripts/
```

## Update the search catalogue

After changing a yearly chart page, run:

```powershell
npm run build
```

This rebuilds `search-data.js` from all `chart-YYYY.htm` files.

## Publish with GitHub Pages

1. Create an empty GitHub repository.
2. Add this folder to it and push the `main` branch.
3. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the source.

Every push to `main` rebuilds the search catalogue and publishes the site. The `Music` directory and common backup/source files are excluded from Git.

## Important privacy note

Before publishing, check that the repository does not contain `Music/`, personal playlists, or workbook source files. Audio files are both too large for this site and generally should not be made public unless you have the necessary rights.
