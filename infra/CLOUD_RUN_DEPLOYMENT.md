# Google Cloud Run Deployment Playbook

This document exclusively sequences the "Phase 4 - Pressure Test" deployment logic to map the `/api` and `/ui` workspaces onto serverless Cloud Run architectures leveraging secure Vertex AI Native authentication bindings.

## Prerequisites
1. **Google Cloud CLI:** You must possess the `gcloud` CLI installed locally.
2. **Project Authorization:** Ensure you execute all deployments via your validated GCP Account targeting your specific `PROJECT_ID`.
3. **Vertex AI Credentials:** Inside Google Cloud Run, containers natively authenticate themselves via your **Compute Engine Default Service Account**. You literally do NOT need to export your local `.json` credentials. Simply ensure the Default Compute Service Account inside your GCP project has the **"Vertex AI User"** (`roles/aiplatform.user`) role!

---

## Stage 1: Backend Protocol Deployment (/api)

We deploy the isolated REST proxy container first to grab the secure Google generated URL for our frontend to ingest.

Run this exclusively inside the **root** of the repository:

```bash
gcloud run deploy unsung-api \
  --source ./api \
  --allow-unauthenticated \
  --region us-central1 \
  --set-env-vars GCP_PROJECT_ID=gen-lang-client-0767875655,VERTEX_LOCATION=global
```

*Note on `$PORT`: Google Cloud Run automatically resolves and spins up Node.js injecting `process.env.PORT=8080`. Since our `api/index.js` explicitly binds `PORT || 4000`, the server natively binds and accepts traffic directly from Google's routing balancer without manual intervention!*

**⚠️ WAIT HERE:** When this command completes, it will securely return a `Service URL` (e.g., `https://unsung-api-abc123ez-uc.a.run.app`). Copy this URL.

---

## Stage 2: Frontend Data Viz Deployment (/ui)

We deploy the isolated Next.js frontend mapping the URL we gained via Stage 1 directly inside the build context bounds.

Run this exclusively inside the **root** of the repository:

```bash
gcloud run deploy unsung-ui \
  --source ./ui \
  --allow-unauthenticated \
  --region us-central1 \
  --set-env-vars NEXT_PUBLIC_API_URL=https://<YOUR_API_URL_COPIED_FROM_STAGE_1> 
```

### Verification Requirements

Once the frontend deployment succeeds, it will print a final `Service URL`.
Click the URL, load the App, and initiate the SENSORY AUDITORY analysis. If it works, you have perfectly achieved stateless Cloud Run decoupling dynamically leveraging Vertex AI Enterprise bounds!
