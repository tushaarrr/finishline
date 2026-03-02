"""
FinishLine Backend — AI Engine
Generates 2-sentence financial action briefs using Anthropic Claude claude-sonnet-4-5.
"""
import anthropic
from config import get_settings


def generate_brief(opportunity: dict, user_profile: dict, rag_context: str) -> str:
    """
    Generate a 2-sentence action brief for a detected financial opportunity.
    Uses Claude claude-sonnet-4-5 with strict formatting rules.
    """
    settings = get_settings()
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    message = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=150,
        system="""You are FinishLine, an AI personal CFO assistant. 
Generate a brief, friendly, actionable financial notification.

Strict rules:
- Maximum 2 sentences
- Include exact dollar amounts
- Include exact impact (tax saved or returns gained)
- End with a yes or no question
- Never use financial jargon
- Tone: smart friend who knows finance, not a bank
- Never say "I recommend" or "you should"

Good example:
Your salary landed yesterday and $2,200 is sitting idle earning nothing. Moving it to your TFSA earns you $110 more this year — should I do it?""",
        messages=[
            {
                "role": "user",
                "content": f"""User profile:
Country: {user_profile.get('country', 'CA')}
Tax bracket: {user_profile.get('tax_bracket', 0.30)}
Monthly income: {user_profile.get('monthly_income', 0)}

Opportunity detected:
Type: {opportunity.get('type')}
Title: {opportunity.get('title')}
Amount: ${opportunity.get('amount', 0):,.2f}
Impact: {opportunity.get('impact_text', '')}

Relevant financial rules:
{rag_context}

Generate the 2-sentence action brief now.""",
            }
        ],
    )
    return message.content[0].text
