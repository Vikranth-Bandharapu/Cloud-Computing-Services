$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
& $edge --headless --no-pdf-header-footer --print-to-pdf="C:\Users\HP\Desktop\cloud computing services\Cloud_Computing_Services_Requirement_and_Design_Document.pdf" "C:\Users\HP\Desktop\cloud computing services\Cloud_Computing_Services_Requirement_and_Design_Document.html"
Start-Sleep -Seconds 4
Write-Host "PDF Result: $(Test-Path 'C:\Users\HP\Desktop\cloud computing services\Cloud_Computing_Services_Requirement_and_Design_Document.pdf')"
