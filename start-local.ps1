$ErrorActionPreference = "Stop"
$SiteRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Starting UK Music Chart Archive at http://localhost:8080"
Write-Host "Press Ctrl+C to stop."
Set-Location $SiteRoot
Start-Process "http://localhost:8080"

if (Get-Command py -ErrorAction SilentlyContinue) {
    py -m http.server 8080
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server 8080
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    npx --yes serve . --listen 8080
} else {
    Write-Host ""
    Write-Host "A small local web server is needed. Install Python or Node.js, then run this file again."
    Write-Host "If you already use IIS, you can also point it at this folder."
    Read-Host "Press Enter to close"
}
