# FinishLine: AI-Native Personal CFO

FinishLine is a two-sided, AI-native financial platform. It bridges the gap between consumer financial automation and human-led wealth management. 

For the **consumer**, it acts as a personal AI CFO—connecting to real bank accounts via Plaid, detecting optimization opportunities (idle cash, tax-advantaged account room, salary splits), and explaining them in plain English. 

For the **advisor**, it acts as a co-pilot—maintaining genuine, real-time awareness of every client simultaneously. It calculates financial health scores, detects dormant clients, tracks engagement, and pre-writes personalized outreach based on real data.

---

## 🚀 Features

### Consumer Side
- **Real-Time Bank Synch:** Connects directly to checking, savings, and credit accounts via Plaid.
- **AI Opportunity Engine:** Runs 4 concurrent detectors against live data (Idle Cash, RRSP Deadline, TFSA Room, Salary Autopilot).
- **Conversational RAG Chatbot:** Ask anything about your finances. Uses a vector database (Supabase pgvector) loaded with Canadian and US tax rules to provide accurate, context-aware answers.
- **Agentic Execution:** The chatbot can extract intent, stage actions (e.g., "Move $500 to my TFSA"), and execute them.
- **Financial Goals:** AI automatically calculates the necessary monthly contribution to hit user-defined targets by their deadlines.

### Advisor Side (Advisor Copilot)
- **Client Triage Dashboard:** Sorts the entire book of business by risk level (Urgent, High, All Clear).
- **Automated Health Scores:** Evaluates every client across 5 dimensions (Emergency Fund, Debt, Investing, Spending, Salary) to generate a 0-100 score.
- **Dormant Client Reactivation:** Identifies clients inactive for 60+ days who have pending high-value opportunities, and pre-writes personalized outreach.
- **Engagement Analytics:** Tracks AI-recommendation approval rates to identify Champions vs. Disengaged clients.
- **One-Click Escalation & Alerts:** Advisors can send real-time, customizable alerts directly to a client's dashboard.

---

## 🏗️ Architecture & Tech Stack

FinishLine is built around the philosophy of pushing compute to the backend and keeping the frontend light and purely representational.

*   **Frontend:** React (Vite), React Router, Vanilla CSS, Lucide Icons.
*   **Backend:** FastAPI (Python), Uvicorn.
*   **Database:** Supabase (PostgreSQL, Row Level Security, pgvector).
*   **Banking:** Plaid API.
*   **AI / LLMs:**
    *   **Anthropic Claude (claude-3-haiku):** Used for generating succinct, jargon-free action briefs and chatbot responses.
    *   **OpenAI Embeddings (text-embedding-3-small):** Used for semantic search against the financial knowledge base.

---

## 🛠️ Local Development Setup

To run FinishLine locally, you need to run both the Vite frontend server and the FastAPI backend server.

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- A Supabase project with the schema applied
- A Plaid Developer account (Sandbox keys)
- API Keys for Anthropic and OpenAI

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create a virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file based on the required variables
touch .env
```

**Backend `.env` format:**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_sandbox_secret
PLAID_ENV=sandbox

ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
```

**Run the backend server:**
```bash
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*The API will be available at `http://localhost:8000`. Swagger docs at `/docs`.*

### 2. Frontend Setup (React/Vite)

```bash
# From the project root
npm install

# Create a frontend .env file
touch .env
```

**Frontend `.env` format:**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000/api
```

**Run the frontend development server:**
```bash
npm run dev
```
*The app will be available at `http://localhost:5173`.*

---

## 🔒 Security Notes
- **Row Level Security (RLS)** is enforced on all Supabase tables. Consumer clients can only read/write their own data based on their JWT.
- Advisor endpoints use the Supabase Service Role Key on the backend only after validating the user's JWT contains `role: advisor`.
- Access tokens from Plaid are never exposed to the frontend browser context.

---

## 📝 About
This startup-grade application was built end-to-end to demonstrate the power of deeply integrated, AI-native financial tooling that serves both the consumer and the fiduciary advisor in a compliant, productive manner.
