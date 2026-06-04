# Custom Agent Example: Market Research Agent

```python
# agents/market-research-agent/agent.py
from google.adk.agents import Agent
from tools import (
    search_google_trends,
    analyze_reddit_discussions,
    scrape_competitor_blog,
    summarize_findings
)

market_research_agent = Agent(
    name="market_research_agent",
    model="gemini-2.0-flash",
    description="Comprehensive market research for marketing decisions.",
    instruction="""
    You are a market research specialist.
    Task: Gather and analyze market information to support marketing decisions.

    Always:
    1. Confirm research scope first
    2. Use multiple sources
    3. Cross-validate findings
    4. Provide actionable insights, not just raw data
    5. Cite sources for every claim
    """,
    tools=[
        search_google_trends,
        analyze_reddit_discussions,
        scrape_competitor_blog,
        summarize_findings
    ]
)
```
