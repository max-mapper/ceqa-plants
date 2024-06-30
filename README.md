# ceqa-plants

Downloads all new CEQA PDFs uploaded each day from CEQANET and then checks if any of the PDFs mention any of the ~2400 CNPS Rare Plant species

Uses Google Cloud Run, Docker, Node.js and pdftotext from poppler-utils. Generates a website of all rare native plant mentions each day in new CEQA documents under the categories MND and NOP.

# Running your own copy

Set up a Google Cloud Run Build account e.g. https://cloud.google.com/run/docs/quickstarts/jobs/create-execute

Set your `GIT_USER`, `GIT_PASSWORD` (scoped token) and `GOOGLE_CLOUD_PROJECT` env vars and run `./build.sh`

Set your Github Pages to deploy from the `/docs` folder

Create a Cloud Scheduler from the web console to trigger your job on the interval you want (I use `0 2 * * * (America/Los_Angeles)`)

Run `GIT_PASSWORD="token" GIT_USER="user" ./build.sh  && gcloud run jobs execute jobname`
