# Starts everything needed for the Srinivasa Dental Care website on this computer:
#   1. XAMPP MySQL (if not already running)
#   2. The website server on http://localhost:5000 (website + admin panel + API)
# Then opens the website in the browser. Safe to run more than once.
$ErrorActionPreference = 'Stop'
$root    = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root 'backend'
$logs    = Join-Path $backend 'logs'
$pidFile = Join-Path $logs 'server.pid'
$mysqld  = 'C:\xampp\mysql\bin\mysqld.exe'
$myIni   = 'C:\xampp\mysql\bin\my.ini'

# A direct TCP connection is the most reliable "is it listening?" check.
function Test-Port([int]$port) {
  $client = New-Object System.Net.Sockets.TcpClient
  try { return $client.ConnectAsync('127.0.0.1', $port).Wait(700) -and $client.Connected }
  catch { return $false }
  finally { $client.Dispose() }
}

function Wait-Port([int]$port, [int]$seconds) {
  for ($i = 0; $i -lt $seconds * 2; $i++) {
    if (Test-Port $port) { return $true }
    Start-Sleep -Milliseconds 500
  }
  return $false
}

# --- MySQL -------------------------------------------------------------------
# Never start a second mysqld on the same data folder.
if ((Test-Port 3306) -or (Get-Process mysqld -ErrorAction SilentlyContinue)) {
  Write-Host 'MySQL is already running.'
} else {
  Write-Host 'Starting MySQL...'
  Start-Process -FilePath $mysqld -ArgumentList "--defaults-file=$myIni", '--standalone' -WindowStyle Hidden
}
if (-not (Wait-Port 3306 40)) { throw 'MySQL is not accepting connections. Check C:\xampp\mysql\data\mysql_error.log' }

# --- Website server ----------------------------------------------------------
$running = $false
if (Test-Path $pidFile) {
  $old = Get-Process -Id ([int](Get-Content $pidFile)) -ErrorAction SilentlyContinue
  $running = [bool]($old -and $old.ProcessName -eq 'node')
}
if ($running -or (Test-Port 5000)) {
  Write-Host 'Website server is already running.'
} else {
  Write-Host 'Starting website server...'
  New-Item -ItemType Directory -Force $logs | Out-Null
  $node = (Get-Command node).Source
  $p = Start-Process -FilePath $node -ArgumentList 'server.js' -WorkingDirectory $backend -WindowStyle Hidden -PassThru `
    -RedirectStandardOutput (Join-Path $logs 'server.log') `
    -RedirectStandardError (Join-Path $logs 'server-error.log')
  Set-Content -Path $pidFile -Value $p.Id -Encoding ascii
  if (-not (Wait-Port 5000 60)) {
    if ($p.HasExited) { throw 'Website server stopped unexpectedly. Check backend\logs\server-error.log' }
    Write-Host 'The website server is still starting - open the link below in a minute.'
  }
}

Write-Host ''
Write-Host 'Website:      http://localhost:5000'
Write-Host 'Admin panel:  http://localhost:5000/admin'
if (-not $env:SDC_NO_BROWSER) { Start-Process 'http://localhost:5000' }
