# ceqa-plants

Downloads all new CEQA PDFs uploaded each day from CEQANET and then checks if any of the PDFs mention any of the ~2400 CNPS Rare Plant species

Uses Google Cloud Run, Docker, Node.js and pdftotext from poppler-utils. Generates a website of all rate native plant mentions each day in new CEQA documents under the categories MND and NOP
