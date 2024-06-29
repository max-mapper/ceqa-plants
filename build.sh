export GOOGLE_CLOUD_PROJECT=ceqaplants
gcloud builds submit -t "gcr.io/${GOOGLE_CLOUD_PROJECT}/ceqagrab"
gcloud run jobs update ceqagrab \
  --max-retries 10 \
  --tasks 1 \
  --image "gcr.io/${GOOGLE_CLOUD_PROJECT}/ceqagrab"