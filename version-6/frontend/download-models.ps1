$ErrorActionPreference = "Stop"

$weightsBase = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
$target = Join-Path $PSScriptRoot "models"

New-Item -ItemType Directory -Force -Path $target | Out-Null

$files = @(
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  "face_expression_model-weights_manifest.json",
  "face_expression_model-shard1"
)

foreach ($f in $files) {
  $url = "$weightsBase/$f"
  $out = Join-Path $target $f
  Write-Host "Downloading $f ..."
  Invoke-WebRequest -Uri $url -OutFile $out
}

Write-Host ""
Write-Host "Done. Models saved to: $target"

