# Custom Workflow Example: Content Production

```yaml
# workflows/weekly-content.yml
name: weekly-content-production
description: Generate all marketing content for the week

steps:
  - name: research
    agent: market_researcher
    input: "Trending topics this week in [industry]"
    output: research_report

  - name: content-planning
    agent: content_strategist
    input: research_report
    output: content_calendar

  - name: creation
    parallel: true
    steps:
      - agent: blog_writer
        input: content_calendar.blog_topics
        output: blog_drafts

      - agent: social_writer
        input: content_calendar.social_topics
        output: social_drafts

  - name: review
    agent: editor
    input:
      - blog_drafts
      - social_drafts
    output: final_content
```
