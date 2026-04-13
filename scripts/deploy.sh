#!/bin/bash
set -e

echo "================================================="
echo " UNSUNG HEROES ENGINE - CLOUD RUN DEPLOY PIPELINE"
echo "================================================="

# 1. Enforce Env
if [ ! -f .env.production ]; then
  echo "[ERROR] .env.production file not found!"
  echo "Please copy .env.production.example to .env.production and provide your credentials."
  exit 1
fi

# Load variables natively handling empty mappings cleanly
export $(grep -v '^#' .env.production | xargs)

if [ -z "$GCP_PROJECT_ID" ] || [ -z "$VERTEX_LOCATION" ] || [ -z "$SERVICE_ACCOUNT_NAME" ]; then
  echo "[ERROR] GCP_PROJECT_ID, VERTEX_LOCATION, and SERVICE_ACCOUNT_NAME must be defined in .env.production."
  exit 1
fi

echo "[1/5] Environment validated successfully."

# 2. Idempotent Service Account Architecture
SA_EMAIL="$SERVICE_ACCOUNT_NAME@$GCP_PROJECT_ID.iam.gserviceaccount.com"

echo "[2/5] Establishing Explicit IAM Identity ($SA_EMAIL)..."

if ! gcloud iam service-accounts describe "$SA_EMAIL" --project "$GCP_PROJECT_ID" >/dev/null 2>&1; then
  echo "      -> Creating Custom Service Account: $SERVICE_ACCOUNT_NAME natively..."
  gcloud iam service-accounts create "$SERVICE_ACCOUNT_NAME" \
    --description="Cloud Run Identity exclusively assigned to the Unsung Heroes API Proxy" \
    --display-name="$SERVICE_ACCOUNT_NAME" \
    --project="$GCP_PROJECT_ID" \
    --quiet
else
  echo "      -> Custom Service Account already instantiated. Bypassing creation..."
fi

echo "      -> Binding [roles/aiplatform.user] natively over the project..."
gcloud projects add-iam-policy-binding "$GCP_PROJECT_ID" \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/aiplatform.user" \
  --project="$GCP_PROJECT_ID" \
  --quiet >/dev/null

# 3. Deploy API securely masked behind the explicit Identity
echo "[3/5] Deploying /api workspace securely wrapping explicit Service Account..."
gcloud run deploy unsung-api \
  --source ./api \
  --allow-unauthenticated \
  --region us-central1 \
  --project $GCP_PROJECT_ID \
  --service-account="$SA_EMAIL" \
  --set-env-vars GCP_PROJECT_ID=$GCP_PROJECT_ID,VERTEX_LOCATION=$VERTEX_LOCATION \
  --quiet

# 4. Harvest API URL
echo "[4/5] Harvesting API Gateway Service URL..."
API_URL=$(gcloud run services describe unsung-api --platform managed --region us-central1 --project $GCP_PROJECT_ID --format 'value(status.url)')

if [ -z "$API_URL" ]; then
  echo "[ERROR] Failed to harvest the Cloud Run API URL."
  exit 1
fi

echo "      -> API URL Extracted: $API_URL"

# 5. Deploy UI with injected API URL
echo "[5/5] Deploying /ui workspace and securely injecting dynamic API link..."
gcloud run deploy unsung-ui \
  --source ./ui \
  --allow-unauthenticated \
  --region us-central1 \
  --project $GCP_PROJECT_ID \
  --set-env-vars NEXT_PUBLIC_API_URL=$API_URL \
  --quiet

echo "================================================="
echo " IAM-SECURED DEPLOYMENT COMPLETE! "
echo " Executing entirely bypassing Default Compute accounts!"
echo "================================================="
