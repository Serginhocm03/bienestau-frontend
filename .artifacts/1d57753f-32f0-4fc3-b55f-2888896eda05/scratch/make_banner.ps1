Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap(1024, 500)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(15, 23, 42))
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 58, 138))
$g.FillRectangle($brush, 0, 380, 1024, 120)
$fontTitle = New-Object System.Drawing.Font("Arial", 72, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Arial", 32)
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$brushBlue = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(147, 197, 253))
$g.DrawString("Bienestau", $fontTitle, $brushWhite, 80, 140)
$g.DrawString("Bienestar Universitario", $fontSub, $brushBlue, 80, 260)
$output = "C:/Users/sergi/Desktop/Practicas/bienestau-frontend-master/assets/images/google_play_feature_graphic.jpg"
$bmp.Save($output, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose()
$bmp.Dispose()
Write-Host "Generated banner at $output"
