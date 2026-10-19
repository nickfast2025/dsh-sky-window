param(
    [ValidateRange(1024, 65535)][int]$Port = 3081,
    [switch]$NoOpen
)
$ErrorActionPreference = 'Stop'
$skyWorkspace = $PSScriptRoot
$skyPlugin = Join-Path $skyWorkspace 'dsh-sky-window'
$skyRuntimeHome = Join-Path $skyWorkspace '.runtime\dsh-home'
$skyProfile = Join-Path $skyRuntimeHome 'profiles\web'
$skyProfileModules = Join-Path $skyProfile 'node_modules'
$skyPluginLink = Join-Path $skyProfileModules 'dsh-sky-window'
$skyDshCommand = Get-Command dsh -ErrorAction Stop
$skyDshPackage = Join-Path (Split-Path $skyDshCommand.Source -Parent) 'node_modules\@deepseek-ai\dsh'
$skyDshManifest = Join-Path $skyDshPackage 'package.json'
if (-not (Test-Path -LiteralPath $skyDshManifest)) { throw 'Cannot locate the installed @deepseek-ai/dsh package beside its CLI.' }
$skyVersion = (Get-Content -LiteralPath $skyDshManifest -Raw | ConvertFrom-Json).version

Push-Location -LiteralPath $skyWorkspace
$skyPriorDshHome = $env:DSH_HOME
try {
    & node (Join-Path $skyPlugin 'build.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Sky Window client build failed.' }
    New-Item -ItemType Directory -Path $skyProfileModules -Force | Out-Null
    if (Test-Path -LiteralPath $skyPluginLink) {
        $skyExistingLink = Get-Item -LiteralPath $skyPluginLink
        if ($skyExistingLink.LinkType -ne 'Junction' -or [IO.Path]::GetFullPath(@($skyExistingLink.Target)[0]) -ne [IO.Path]::GetFullPath($skyPlugin)) {
            throw "An unexpected entry exists at $skyPluginLink. It has been preserved."
        }
    } else {
        New-Item -ItemType Junction -Path $skyPluginLink -Target $skyPlugin | Out-Null
    }
    $skyProfileManifest = @{
        name = 'dsh-profile-sky-window-dev'
        private = $true
        dependencies = @{ 'dsh-sky-window' = "link:$($skyPlugin.Replace('\','/'))" }
        dsh = @{ profile = @{ bundles = @('@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app', 'dsh-sky-window') } }
    }
    $skyProfileManifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $skyProfile 'package.json') -Encoding utf8
    $skyProfilePatchPath = Join-Path $skyProfile 'cordis.patch.yml'
    $skyProfilePatchTemplate = Join-Path $skyWorkspace 'dsh-profile.patch.yml'
    if (-not (Test-Path -LiteralPath $skyProfilePatchPath) -or
        (Get-Content -LiteralPath $skyProfilePatchPath -Raw) -match '(?m)^\[\]\s*$') {
        Copy-Item -LiteralPath $skyProfilePatchTemplate -Destination $skyProfilePatchPath -Force
    }
    $env:DSH_HOME = $skyRuntimeHome
    Write-Host "DSH $skyVersion + dsh-sky-window 0.1.0"
    Write-Host "Development home: $skyRuntimeHome"
    Write-Host "DSH will print a browser sign-in URL for http://127.0.0.1:$Port. Open that full URL."
    $skyDshArguments = @((Join-Path $skyDshPackage 'lib\bin.js'), 'web', '--host', '127.0.0.1', '--port', "$Port")
    if ($NoOpen) { $skyDshArguments += '--no-open' }
    & node @skyDshArguments
    if ($LASTEXITCODE -ne 0) { throw "DSH exited with code $LASTEXITCODE." }
} finally {
    $env:DSH_HOME = $skyPriorDshHome
    Pop-Location
}
