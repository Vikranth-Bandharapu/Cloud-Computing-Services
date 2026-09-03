$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$html = "C:\Users\HP\Desktop\cloud computing services\Cloud_Computing_Services_Requirement_and_Design_Document.html"
$pdf = "C:\Users\HP\Desktop\cloud computing services\Cloud_Computing_Services_Requirement_and_Design_Document.pdf"

Write-Host "Generating PDF using Start-Process..."
$proc = Start-Process -FilePath $edge -ArgumentList "--headless", "--disable-gpu", "--no-pdf-header-footer", "--print-to-pdf=`"$pdf`"", "`"$html`"" -PassThru -NoNewWindow
$proc.WaitForExit()

Write-Host "PDF Exists: $(Test-Path $pdf)"
