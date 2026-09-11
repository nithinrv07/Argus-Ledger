# ARGUS-Ledger Web Client

Modern React 18 + TypeScript web application for **ARGUS-Ledger** — the Explainable AI (XAI) and Cryptographic Audit Trail Platform for Autonomous Agents.

For full platform documentation, system architecture, API specifications, and compliance standards, refer to the [Root README](../README.md).

---

## 🛠️ Quick Start (Frontend)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
By default, the frontend connects to the FastAPI backend running at `http://127.0.0.1:8000`. You can configure a custom API URL in `.env.local`:
```env
VITE_API_URL=http://127.0.0.1:8000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📱 Features & Views
* **Dashboard Overview (`/overview`)**: Live KPI metrics, agent fleet status, real-time decision feed, and tamper simulator toggle.
* **Live Decision Studio (`/studio`)**: Interactive testing sandbox with one-click presets and live XAI explanation generation.
* **Audit Ledger Explorer (`/ledger`)**: Search, filter, and inspect sequential SHA-256 blocks, with signed JSON & CSV export.
* **Decision Inspector (`/inspector`)**: Deep-dive forensic viewer with side-by-side payloads, Ed25519 signatures, and 5-phase XAI narratives.
* **Compliance Analytics (`/analytics`)**: Policy trigger rates, latency distributions ($P_{50}, P_{95}, P_{99}$), and ISO-42001 / EU AI Act governance metrics.
