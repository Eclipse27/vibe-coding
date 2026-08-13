# Architecture

## Component Overview

| Component | Purpose |
|-----------|---------|
| **React Frontend** | SPA dashboard with charts, tables, alerts, and recommendations |
| **Amazon S3** | Static website hosting for the built frontend |
| **API Gateway** | HTTP API endpoint exposing GET/POST for energy data |
| **AWS Lambda** | Serverless handler that reads/writes to DynamoDB |
| **Amazon DynamoDB** | NoSQL storage for energy consumption records |

## Data Flow

```
1. User loads dashboard from S3
2. React app calls API Gateway endpoint (GET /consumption)
3. API Gateway invokes Lambda function
4. Lambda scans DynamoDB EnergyConsumption table
5. Data returned to frontend as JSON
6. Frontend calculates summaries, renders charts and analytics
7. If API call fails → fallback to local demo data (seamless)
```

## Why Serverless

- **Zero server management**: No EC2 instances to configure or maintain
- **Pay-per-use**: Lambda charges only for execution time; DynamoDB on-demand billing
- **Auto-scaling**: Handles variable load without manual configuration
- **Fast deployment**: Upload code and configuration, no infrastructure provisioning
- **Academic fit**: Minimal setup, demonstrates cloud concepts effectively

## Scalability

- DynamoDB on-demand mode scales reads/writes automatically
- Lambda concurrency handles burst traffic
- S3 + CloudFront can serve millions of requests
- API Gateway throttling prevents abuse

## Security

- No credentials in the repository (enforced via .gitignore)
- Lambda uses IAM role for DynamoDB access (no embedded keys)
- API Gateway CORS configured to restrict origins in production
- Frontend uses VITE_API_URL env var (public endpoint only)

**Tradeoff note**: The API endpoint is public (no authentication). For a production system, add Cognito or API key authentication. For this academic project, the tradeoff is acceptable — the API only serves read-only energy data.

## Cost Estimate (AWS Free Tier)

| Service | Free Tier | Expected Usage |
|---------|-----------|---------------|
| S3 | 5 GB storage, 20K GET | Well within limits |
| Lambda | 1M requests/month | < 1K requests |
| API Gateway | 1M API calls/month | < 1K calls |
| DynamoDB | 25 GB, 25 RCU/WCU | < 1 MB, minimal RCU |

**Estimated monthly cost: $0** (within free tier)
