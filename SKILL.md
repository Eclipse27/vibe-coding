# SKILL.md: Development Rules and Architecture

## 1. Project Overview
Energy Consumption Monitoring Dashboard. This project is a Vibe Coding application built for the Cloud Strategy course, Activity FT1.

## 2. Problem Statement
Monitoring energy consumption is crucial for understanding usage patterns, reducing costs, and promoting sustainability. Many existing solutions are overly complex or difficult to deploy quickly.

## 3. Project Objective
To build a functional, cloud-hosted Energy Consumption Monitoring Dashboard using AWS serverless architecture within a short academic timeframe, prioritizing reliability and rapid deployment.

## 4. Target Users
- Students demonstrating cloud architecture concepts.
- Individuals wanting a simple dashboard to monitor simulated or actual energy data.

## 5. Core Functional Requirements
- Display energy consumption data on a dashboard.
- Provide interactive visualizations of energy trends.
- Support realistic demo data for offline/unconfigured environments.
- Retrieve data from an API endpoint backed by a cloud database.

## 6. Non-Functional Requirements
- High token efficiency during AI development (no long explanations).
- Fast deployment and teardown on AWS.
- Lightweight and minimal dependencies.
- Reliable fallback mechanisms (e.g., demo data).

## 7. UI/UX Requirements
- Clean, modern, responsive interface.
- Intuitive data visualization (charts/graphs).
- Clear indicators of cloud vs. demo data source.

## 8. AWS Architecture
**User -> AWS-hosted frontend -> API endpoint -> AWS Lambda -> Amazon DynamoDB**
- Frontend Hosting: Amazon S3 (static website hosting) or AWS Amplify.
- API Gateway: Amazon API Gateway (HTTP API).
- Compute: AWS Lambda (Node.js or Python).
- Database: Amazon DynamoDB.

## 9. AWS Services Being Used
- S3 / Amplify
- API Gateway
- Lambda
- DynamoDB

## 10. Frontend Technology
- React
- Vite
- JavaScript / TypeScript
- CSS / TailwindCSS (based on preference)

## 11. Backend Technology
- Node.js or Python (for Lambda).

## 12. Database Structure
- DynamoDB Table: `EnergyConsumption`
- Partition Key: `deviceId` (String)
- Sort Key: `timestamp` (String - ISO 8601)
- Attributes: `energyUsage` (Number)

## 13. API Structure
- `GET /consumption`: Retrieve historical energy consumption data.
- `POST /consumption`: (Optional) Insert new energy reading.

## 14. Data Model
```json
{
  "deviceId": "meter-001",
  "timestamp": "2026-08-13T10:00:00Z",
  "energyUsage": 2.5,
  "unit": "kWh"
}
```

## 15. Analytics Requirements
- Calculate total energy consumption over a time period.

## 16. Visualization Requirements
- Line/Bar chart showing energy consumption over time.

## 17. Security Requirements
- **Never hardcode secrets.**
- Do not include AWS access keys, secret keys, passwords, tokens, or other credentials in the repository.

## 18. Deployment Requirements
- Frontend built as a static site and uploaded to S3/Amplify.
- Backend deployed as a Lambda function + API Gateway.

## 19. GitHub Requirements
- Always keep the repository GitHub-ready.
- Use `.gitignore` to exclude dependencies and secrets.

## 20. Testing Requirements
- Focus on manual integration testing.
- Ensure frontend gracefully falls back to demo data.

## 21. Documentation Requirements
- Maintain this `SKILL.md` as the source of truth.

## 22. AI/Vibe Coding Rules
- Working functionality is more important than unnecessary complexity.
- Do not introduce technologies that are not required.
- Do not rewrite working components unnecessarily.
- Do not consume AI tokens on long explanations.
- Always prefer the smallest reliable implementation.
- Never hardcode secrets.
- Always keep the repository GitHub-ready.

## 23. Scope-Control Rules
- Focus on the dashboard first, then cloud integration.
