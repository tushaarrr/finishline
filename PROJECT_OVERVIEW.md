# FinishLine — AI-Native Personal CFO

## What the human can now do that they couldn't before

A licensed financial advisor at Wealthsimple currently manages 50 to 200 clients. They give good advice, but only to the clients they have time to think about. The rest get generic check-ins, missed deadlines, and opportunities that expire while they wait.

With FinishLine, one advisor maintains genuine awareness of every client simultaneously. They wake up to a ranked list: three clients are Critical, one dormant for 73 days with an RRSP deadline approaching, two who have never acted on a single recommendation. Each has a pre-written personalized message ready, built from real Plaid balances, tax brackets, and pending opportunities. The advisor reviews, edits if needed, and sends. Forty hours of manual review now takes 20 minutes.

On the consumer side: a newcomer to Canada who doesn't know what a TFSA is receives a notification on salary day showing exactly where their $5,200 should go. $800 to RRSP, $600 to TFSA, $780 to credit card debt, one tap to execute all four moves. They didn't ask for this. They didn't know to ask. The AI noticed before they did.

## What AI is responsible for

Scanning 100% of client accounts daily. Detecting idle cash, RRSP deadlines, salary events, and spending drift. Generating action briefs with exact dollar impact. Ranking every client by health score across five dimensions. Writing personalized dormant-client outreach from real data. Answering financial questions using a RAG knowledge base of Canadian and US tax rules. Extracting intent from agent commands and staging confirmations before execution.

## Where AI must stop

The decision to send an alert must remain human. Not because the AI cannot draft a better message than most advisors, it often does. But the advisor carries regulatory and fiduciary responsibility for that communication. CIRO rules exist precisely because the advisor-client relationship cannot be delegated to software. The AI pre-writes. The human sends. Automate that step and the accountability disappears along with the trust.

## What would break first at scale

Opportunity detector false positives. At 10,000 users, a 5% error rate means 500 clients receiving irrelevant alerts. The fix is confidence scoring on every opportunity and a feedback loop where skipped opportunities retrain detection thresholds. The scaffolding exists. The feedback data is not dense enough yet. That is what needs to scale carefully.

## About the Builder

**Salary expectation:** Open to discussion. I am more interested in the problem than the number.

**AI experience:** 1+ years hands-on. Built production RAG pipelines using OpenAI embeddings, pgvector, and LangChain. Developed AI agents with tool use and execution rights using Claude and Codex. Used Claude Code and Cursor IDE daily. Integrated MCP servers for agent-to-tool connectivity. Automated workflows using n8n and custom Python pipelines. Run local LLMs via Ollama and fine-tuned models through Hugging Face. Designed interfaces using Framer. Deployed on GCP with Vertex AI. Built FinishLine end to end: RAG chatbot, opportunity detector, advisor copilot, and agent execution layer using Claude, OpenAI, Plaid, and Supabase.
