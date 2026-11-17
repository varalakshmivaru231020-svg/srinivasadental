# Stops the website server. MySQL is left running because other XAMPP projects use it.
$pidFile = Join-Path (Split-Path -Parent $PSScriptRoot) 'backend\logs\server.pid'
$ids = @()
if (Test-Path $pidFile) { $ids += [int](Get-Content $pidFile) }
$ids += Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess

$stopped = $false
foreach ($id in ($ids | Select-Object -Unique)) {
  $p = Get-Process -Id $id -ErrorAction SilentlyContinue
  if ($p -and $p.ProcessName -eq 'node') {
    Stop-Process -Id $id -Force
    Write-Host "Stopped website server (PID $id)."
    $stopped = $true
  }
}
if (Test-Path $pidFile) { Remove-Item $pidFile -Force }
if (-not $stopped) { Write-Host 'Website server is not running.' }
