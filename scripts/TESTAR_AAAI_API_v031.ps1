param([string]$BaseUrl = 'http://localhost/aaai-portal-v1/wordpress/wp-json')
$ErrorActionPreference = 'Stop'
$BaseUrl = $BaseUrl.TrimEnd('/')
$failed = 0
foreach ($endpoint in @('health','services','news','events','projects','partners','slides')) {
    try {
        $data = Invoke-RestMethod -Uri "$BaseUrl/aaai/v1/$endpoint" -TimeoutSec 15
        if ($endpoint -eq 'health' -and $data.version -ne '0.3.1') { throw "Versao inesperada: $($data.version)" }
        Write-Host "OK: $endpoint" -ForegroundColor Green
    } catch {
        $failed++
        Write-Host "FALHOU: $endpoint - $($_.Exception.Message)" -ForegroundColor Red
    }
}
if ($failed -gt 0) { exit 1 }
Write-Host 'TODAS AS ROTAS RESPONDEM.' -ForegroundColor Green
