Add-Type -AssemblyName System.Drawing

$imageDir = Join-Path $PSScriptRoot 'images'
$scenes = @(
  @{ File = '07-morning.png'; Number = '01'; Chinese = '晨光'; English = 'SUNRISE'; X = 0; Y = 96 },
  @{ File = '08-noon.png'; Number = '02'; Chinese = '晴空'; English = 'DAYLIGHT'; X = 1376; Y = 96 },
  @{ File = '09-dusk.png'; Number = '03'; Chinese = '晚霞'; English = 'SUNSET'; X = 0; Y = 781 },
  @{ File = '10-night.png'; Number = '04'; Chinese = '夜色'; English = 'NIGHT SKY'; X = 1376; Y = 781 }
)

$canvas = [System.Drawing.Bitmap]::new(2740, 1454)
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.SmoothingMode = 'AntiAlias'
$graphics.TextRenderingHint = 'AntiAliasGridFit'
$graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#132b37'))
$titleFont = [System.Drawing.Font]::new('Microsoft YaHei', 29, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$subtitleFont = [System.Drawing.Font]::new('Segoe UI', 14, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$labelFont = [System.Drawing.Font]::new('Microsoft YaHei', 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$englishFont = [System.Drawing.Font]::new('Segoe UI', 13, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(244, 247, 244))
$muted = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(171, 192, 197))
$labelBack = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(144, 17, 43, 55))
$labelText = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(245, 249, 246))
$labelSubtext = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(204, 226, 226))

try {
  $graphics.DrawString('天空窗  /  SKY WINDOW', $titleFont, $white, 40, 15)
  $graphics.DrawString('由晨至夜  ·  A DAY IN DEEPSEEK HARNESS', $subtitleFont, $muted, 42, 66)

  foreach ($scene in $scenes) {
    $source = [System.Drawing.Image]::FromFile((Join-Path $imageDir $scene.File))
    try {
      $graphics.DrawImage($source, $scene.X, $scene.Y, 1364, 673)
    } finally {
      $source.Dispose()
    }
    $left = $scene.X + 28
    $top = $scene.Y + 26
    $graphics.FillRectangle($labelBack, $left, $top, 170, 57)
    $graphics.DrawString("$($scene.Number)  $($scene.Chinese)", $labelFont, $labelText, $left + 15, $top + 7)
    $graphics.DrawString($scene.English, $englishFont, $labelSubtext, $left + 49, $top + 33)
  }

  $canvas.Save((Join-Path $imageDir '00-day-in-four-scenes.png'), [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
  $labelSubtext.Dispose(); $labelText.Dispose(); $labelBack.Dispose(); $muted.Dispose(); $white.Dispose()
  $englishFont.Dispose(); $labelFont.Dispose(); $subtitleFont.Dispose(); $titleFont.Dispose()
  $graphics.Dispose(); $canvas.Dispose()
}
