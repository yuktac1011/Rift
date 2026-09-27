# Rift - Runtime Integrity for multi-agent sysTems

Rift continuously monitors autonomous agents, detects drift or faulty actions, and enforces integrity by quarantining or halting deviant agents. 

## Architecture
- **Observation Plane**: Captures actions via OpenTelemetry, queues to Kafka.
- **Verification Plane**: Checks policies (OPA/Rego) and baseline ML semantic drift.
- **Enforcement Plane**: Evaluates severity and escalates via Kubernetes NetworkPolicy.
- **Evidence Plane**: Archives signed decisions in an immutable hash-chain and OpenSearch.
- **Governance Plane**: Alerts via Slack/Teams and visualizes via a React/Tailwind dashboard.

## Running Locally (without Docker)
1. Backend: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --port 8080 --reload`
2. Frontend: `cd frontend && npm install && npm run dev`
3. Sidecar: `cd sidecar && go run main.go`
