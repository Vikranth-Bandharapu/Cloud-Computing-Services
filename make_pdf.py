import subprocess
import os

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
html_path = r"C:\Users\HP\Desktop\cloud computing services\Cloud_Computing_Services_Requirement_and_Design_Document.html"
pdf_path = r"C:\Users\HP\Desktop\cloud computing services\Cloud_Computing_Services_Requirement_and_Design_Document.pdf"

cmd = [
    edge_path,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    html_path
]

print("Running command:", cmd)
res = subprocess.run(cmd, capture_output=True, text=True)
print("Stdout:", res.stdout)
print("Stderr:", res.stderr)
print("PDF Exists:", os.path.exists(pdf_path))
