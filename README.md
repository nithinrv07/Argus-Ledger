<div align="center">

# ARGUS-LEDGER
### **The Smart Security Guard & Tamper-Proof Black Box for AI Agents**

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Python](https://img.shields.io/badge/Python-FastAPI-3776AB?logo=python&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_%2B_TypeScript-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Security](https://img.shields.io/badge/Security-Tamper--Proof%20Blockchain%20Style-success)](#how-it-works-in-4-simple-steps)

<p align="center">
  <b>ARGUS monitors AI agents when they do critical tasks (like transferring money or changing passwords), explains every decision in plain English, and locks each action into an unhackable digital record.</b>
</p>

</div>

---

## What is ARGUS-Ledger? (In Simple Words)

Imagine your company hires autonomous AI assistants to run operations—transferring money, paying bills, and managing servers. 

* **The Problem:** If an AI makes a mistake, gets tricked by a hacker, or sends $100,000 to the wrong account, nobody knows *why* it happened, and someone could change the database records to cover it up.
* **The Solution:** **ARGUS-Ledger** acts like a **smart security guard + an airplane flight recorder** for AI. It checks what the AI is trying to do, decides whether to allow it or stop it, explains its reasons in plain everyday language, and seals the record with digital fingerprints so no one can ever tamper with the history.

---

## How It Works (in 4 Simple Steps)

```
[ AI Agent asks to do something ]
             │
             ▼
 1. CHECK SAFETY ──────────── Is the amount too high? Is the device recognized?
             │
             ▼
 2. MAKE A DECISION ───────── ALLOW (Safe)
                              REVIEW (Needs a human manager's sign-off)
                              BLOCK (Danger or hacker attack detected)
             │
             ▼
 3. EXPLAIN IN ENGLISH ────── Writes a 2-sentence human summary + 5-step breakdown
             │
             ▼
 4. LOCK THE RECORD ───────── Seals it in a tamper-proof chain (like a blockchain receipt)
```

1. **Check Safety:** When an AI asks to do something (e.g., pay an invoice or grant admin access), ARGUS inspects the details—who asked, how much money is involved, and which device they are using.
2. **Make a Decision:**
   * **ALLOW (Green):** Safe routine tasks (e.g., small scheduled payments) run automatically.
   * **REVIEW (Yellow):** Big or sensitive actions (e.g., transfers over $50,000) are paused until a human manager approves them.
   * **BLOCK (Red):** Suspicious or dangerous actions (e.g., hacker prompt injection or stealing API keys) are shut down instantly.
3. **Plain-English Explanations:** Instead of confusing computer code, ARGUS generates clear explanations that any manager, auditor, or client can understand in seconds.
4. **Tamper-Proof Receipt:** Each action is locked with a cryptographic digital fingerprint (SHA-256 hash). If anyone tries to edit or delete past records, the system immediately sounds the alarm.

---

## Key Features Anyone Can Use

* **Plain-English AI Explanations:** Explains *why* an action was approved or blocked in simple sentences, not confusing math.
* **Automatic Circuit Breaker:** Stops hacker tricks (like prompt injections and unauthorized data exports) before any harm is done.
* **Tamper-Evident History:** Just like a digital paper trail, past records cannot be edited or deleted without being caught.
* **"Test a Hack" Button:** A built-in demo button lets you simulate a hacker modifying the database. You'll see the system instantly flag the altered record in red.
* **Live Decision Studio:** Try typing custom transactions (e.g., "Send $100,000 to account X") and watch how ARGUS analyzes the risk in real time.
* **Executive Dashboard:** Visual charts showing how many actions were approved, how many needed human review, and which safety rules were triggered most.
* **One-Click Export:** Download official audit reports as a spreadsheet (CSV) or secure digital file (JSON).

---

## Technology Stack (What Powers It)

ARGUS is built with modern, reliable, and industry-standard tools:

| Part | Technology | What It Does |
| :--- | :--- | :--- |
| **User Interface** | **React + TypeScript + Tailwind CSS** | A sleek, easy-to-use web dashboard with interactive controls and live alerts. |
| **Backend Server** | **Python (FastAPI)** | High-speed brain that processes AI requests and runs safety rules in under 0.15 seconds. |
| **AI & Explainability** | **Decision Engine + Plain-English XAI** | Analyzes threat tokens, scores risk from 0% to 100%, and writes human-readable narratives. |
| **Database** | **SQLite + SQLAlchemy** | Reliably stores the history of all transactions and decisions. |
| **Security & Cryptography** | **SHA-256 + Digital Signatures** | Mathematical locks that chain every record to the one before it so history cannot be rewritten. |

---

## How to Run It (Quick Start in 2 Minutes)

### Prerequisites
Make sure you have installed on your computer:
* **Python 3.10+**
* **Node.js 18+**

---

### Step 1: Start the Backend (Brain)
Open your terminal (PowerShell on Windows, or Terminal on Mac):

```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
> Your backend is now running at `http://127.0.0.1:8000`

---

### Step 2: Start the Frontend (Dashboard)
Open a second terminal window:

```bash
cd frontend
npm install
npm run dev
```
> Open **`http://localhost:5173`** in your web browser!

---

## Try It Out! (Cool Things to Test)

1. **Simulate a Hacker Attack:**
   * Go to the top of the dashboard.
   * Click the **"Simulate Tamper Attack"** button.
   * Watch the banner turn red: **"CRITICAL: TAMPER DETECTED"**.
   * Click **"Restore Integrity"** to see it automatically repair itself.

2. **Test Custom Prompts:**
   * Click on **"Live Decision Studio"** in the left menu.
   * Pick **"Normal Settlement"** -> Watch it get approved.
   * Pick **"Prompt Injection Attack"** -> Watch ARGUS catch the threat keyword and block it!

3. **Read the Decision Inspector:**
   * Click **"Decision Inspector"** in the left menu.
   * Select any transaction to read the 5-step plain-English story of what happened.

---

## License
This project is open-source and licensed under the **Apache License 2.0**.
