Add-Type -AssemblyName System.Drawing

$brushHeader = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 23, 42))
$fontBar = New-Object System.Drawing.Font("Arial", 36, [System.Drawing.FontStyle]::Bold)
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$brushCard = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
$fontTitle = New-Object System.Drawing.Font("Arial", 32, [System.Drawing.FontStyle]::Bold)
$fontBody = New-Object System.Drawing.Font("Arial", 24)
$brushPrimary = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 23, 42))
$brushGray = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 116, 139))

# Screenshot 1
$bmp1 = New-Object System.Drawing.Bitmap(1080, 1920)
$g1 = [System.Drawing.Graphics]::FromImage($bmp1)
$g1.Clear([System.Drawing.Color]::FromArgb(255, 255, 255))
$g1.FillRectangle($brushHeader, 0, 0, 1080, 160)
$g1.DrawString("BIENESTAU", $fontBar, $brushWhite, 60, 60)

$g1.FillRectangle($brushCard, 60, 220, 960, 500)
$g1.DrawString("Semana Hábitos y Estilos", $fontTitle, $brushPrimary, 100, 260)
$g1.DrawString("Semana de Hábitos y Estilos de vida saludable en la UNICESMAG.", $fontBody, $brushGray, 100, 360)

$g1.FillRectangle($brushCard, 60, 780, 960, 500)
$g1.DrawString("Taller de Integración", $fontTitle, $brushPrimary, 100, 820)
$g1.DrawString("Actividades deportivas y culturales este viernes en el coliseo.", $fontBody, $brushGray, 100, 920)

$output1 = "C:/Users/sergi/Desktop/Practicas/bienestau-frontend-master/assets/images/screenshot_1.jpg"
$bmp1.Save($output1, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g1.Dispose()
$bmp1.Dispose()

# Screenshot 2
$bmp2 = New-Object System.Drawing.Bitmap(1080, 1920)
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.Clear([System.Drawing.Color]::FromArgb(255, 255, 255))
$g2.FillRectangle($brushHeader, 0, 0, 1080, 160)
$g2.DrawString("EVENTOS Y AVISOS", $fontBar, $brushWhite, 60, 60)

$g2.FillRectangle($brushCard, 60, 220, 960, 450)
$g2.DrawString("Aviso Importante", $fontTitle, $brushPrimary, 100, 260)
$g2.DrawString("Mantente al día con todas las convocatorias y recordatorios oficiales.", $fontBody, $brushGray, 100, 360)

$output2 = "C:/Users/sergi/Desktop/Practicas/bienestau-frontend-master/assets/images/screenshot_2.jpg"
$bmp2.Save($output2, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g2.Dispose()
$bmp2.Dispose()

Write-Host "Screenshots generated successfully!"
