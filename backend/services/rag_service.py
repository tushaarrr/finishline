"""
FinishLine Backend — RAG Service
Queries Supabase pgvector (match_documents RPC) for relevant financial context.
Uses OpenAI text-embedding-3-small for query embeddings only.
"""
from config import get_settings
from database import get_supabase_admin


def get_relevant_context(opportunity_type: str, user_country: str) -> str:
    """
    Generate an embedding for the opportunity query, then find matching
    financial knowledge documents via Supabase pgvector.
    
    Returns concatenated content from top 3 matching documents.
    """
    settings = get_settings()

    # If no OpenAI key, return empty context (graceful degradation)
    if not settings.openai_api_key:
        return _get_fallback_context(opportunity_type, user_country)

    try:
        from openai import OpenAI

        openai_client = OpenAI(api_key=settings.openai_api_key)
        supabase = get_supabase_admin()

        # 1. Create query embedding
        query = f"{opportunity_type} financial rules for {user_country}"
        embedding_response = openai_client.embeddings.create(
            input=query,
            model="text-embedding-3-small",
        )
        embedding = embedding_response.data[0].embedding

        # 2. Query Supabase match_documents RPC (pgvector similarity search)
        result = supabase.rpc("match_documents", {
            "query_embedding": embedding,
            "match_threshold": 0.7,
            "match_count": 3,
        }).execute()

        # 3. Concatenate matched content
        if not result.data:
            return _get_fallback_context(opportunity_type, user_country)

        return "\n\n".join([doc["content"] for doc in result.data])

    except Exception as e:
        print(f"RAG service error: {e}")
        return _get_fallback_context(opportunity_type, user_country)


def _get_fallback_context(opportunity_type: str, user_country: str) -> str:
    """
    Fallback context when OpenAI embeddings aren't available.
    Provides basic financial rules so Claude can still generate reasonable briefs.
    """
    country = user_country.upper()

    contexts = {
        "idle_cash": {
            "CA": "TFSA annual contribution limit is $7,000 (2024). Contributions are not tax-deductible but all growth and withdrawals are tax-free. High-interest savings accounts in TFSA can earn 4-5% annually.",
            "US": "High-yield savings accounts currently offer 4-5% APY. Consider I-bonds for inflation protection. Money market funds are also a low-risk option.",
        },
        "rrsp_deadline": {
            "CA": "RRSP contribution deadline is March 1 each year for the previous tax year. Contributions are tax-deductible. Maximum contribution is 18% of earned income, up to $31,560 (2024). Tax refund equals contribution × marginal tax rate.",
        },
        "tfsa_room": {
            "CA": "TFSA cumulative room for Canadian residents since 2009 can be up to $95,000 (2024). Annual limit is $7,000. All investment income earned inside a TFSA is tax-free. Withdrawals add back to contribution room the following year.",
        },
    }

    type_contexts = contexts.get(opportunity_type, {})
    return type_contexts.get(country, type_contexts.get("CA", "No specific context available."))
