# Unsung Heroes Telemetry Proxy (`/api`)

The backend API is explicitly constructed as a defensive boundary proxy separating the Next.js Client application from official Google Cloud API logic, preventing credential exfiltration and strictly formatting the semantic data returned to the dashboard.

## Endpoint: `/api/analyze-sport`

Generates an aggregated athlete archetype and "Hidden Grind" narrative targeting the specified sport.

### Payload Schema (Zod Validated)
**Method:** `POST`
**Headers:** `Content-Type: application/json`

**Incoming Body Formatter:**
```json
{
  "sport": "wrestling"
}
```
*Note: Any payload failing Zod parsing rules will instantly degrade into a 400 Bad Request error.*

### Strict Response Governance

To prevent unpredictable semantic generation, the backend proxies a hardcoded set of System Instructions restricting outputs to **Conditional Phrasing Outcomes** and restricting **Name, Image, and Likeness (NIL)** tracking.

**Succesful Response Schema:**
```json
{
  "success": true,
  "data": {
    "archetype": "THE LEVERAGED SURVIVOR",
    "hiddenGrind": "In the silence of the regional qualifying halls... Such adaptation could lead to superior tactical resilience."
  }
}
```

**Graceful Degradation Schema (No API Key or Upstream Failure):**
```json
{
  "error": "Failed to generate archetype. Please verify GCP permissions or check quota."
}
```

## Running Tests
Tests assert data boundaries dynamically without utilizing real API credits (Mocking configuration via Jest):
```bash
npm run test -w api
```
