# Prompts Used

Key prompts used during the Vibe Coding development process, grouped by category.

## Architecture & Planning

- "Create a SKILL.md file defining the complete development rules and architecture for an Energy Consumption Monitoring Dashboard"
- "Define AWS serverless architecture: S3 → API Gateway → Lambda → DynamoDB"

## UI & Frontend

- "Build a SaaS-quality dashboard with summary cards, hourly consumption chart, area breakdown donut, usage table, alerts panel, and recommendations"
- "Use a dark theme with Inter font, CSS custom properties, responsive grid layout"
- "Implement period selector (Today/Week/Month) that re-renders the consumption chart"

## Backend & AWS

- "Create Lambda handler with GET/POST endpoints for DynamoDB CRUD with CORS support"
- "Define DynamoDB table with id as partition key and PAY_PER_REQUEST billing"
- "Build seed script to populate DynamoDB with realistic energy data"

## Data & Analytics

- "Generate deterministic demo data with realistic hourly power profiles per area (HVAC, Lighting, Computing, Kitchen, Other)"
- "Implement peak detection by flagging hours exceeding a configurable threshold"
- "Build rules-driven recommendation engine that generates suggestions from actual consumption values"

## Debugging & Testing

- *Prompts added as issues are encountered during testing*

## Deployment

- *Prompts added during AWS deployment phase*

---

*This document is updated as new prompts are used during development.*
