# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- AWS CLI configured (`aws configure`)
- AWS account with free tier access

## Step 1: Build Frontend

```bash
npm install
npm run build
```

This produces a `dist/` folder with the static site.

## Step 2: Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name EnergyConsumption \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1
```

Or use the JSON definition:

```bash
aws dynamodb create-table --cli-input-json file://backend/dynamodb/table-definition.json --region ap-south-1
```

## Step 3: Seed DynamoDB (Optional)

```bash
cd backend/dynamodb
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
TABLE_NAME=EnergyConsumption AWS_REGION=ap-south-1 node seed.js
```

## Step 4: Create Lambda Function

1. Go to AWS Lambda console
2. Create function: `EnergyConsumptionAPI`
3. Runtime: Node.js 18.x
4. Upload `backend/lambda/index.js` (zip it first)
5. Set environment variable: `TABLE_NAME = EnergyConsumption`
6. Attach IAM policy with DynamoDB access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Scan",
        "dynamodb:PutItem",
        "dynamodb:GetItem"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/EnergyConsumption"
    }
  ]
}
```

## Step 5: Create API Gateway

1. Go to API Gateway console
2. Create HTTP API
3. Add integration → Lambda → `EnergyConsumptionAPI`
4. Add routes:
   - `GET /consumption` → Lambda
   - `POST /consumption` → Lambda
   - `OPTIONS /consumption` → Lambda (CORS preflight)
5. Configure CORS:
   - Allow Origins: `*` (or your S3 URL)
   - Allow Methods: `GET, POST, OPTIONS`
   - Allow Headers: `Content-Type`
6. Deploy → Note the invoke URL

## Step 6: Set Frontend API URL

```bash
echo "VITE_API_URL=https://YOUR-API-ID.execute-api.ap-south-1.amazonaws.com" > .env
npm run build
```

## Step 7: Deploy Frontend to S3

```bash
# Create bucket
aws s3 mb s3://energy-dashboard-YOUR-ID --region ap-south-1

# Enable static website hosting
aws s3 website s3://energy-dashboard-YOUR-ID --index-document index.html --error-document index.html

# Set public access policy
aws s3api put-public-access-block \
  --bucket energy-dashboard-YOUR-ID \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Upload
aws s3 sync dist/ s3://energy-dashboard-YOUR-ID --delete

# Add bucket policy for public read
aws s3api put-bucket-policy --bucket energy-dashboard-YOUR-ID --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicRead",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::energy-dashboard-YOUR-ID/*"
  }]
}'
```

## Step 8: Verify

1. Open `http://energy-dashboard-YOUR-ID.s3-website.ap-south-1.amazonaws.com`
2. Check cloud status indicator shows "Cloud Connected"
3. Verify charts display data from DynamoDB
4. Test refresh button

## Troubleshooting

| Issue | Solution |
|-------|---------|
| CORS error | Verify API Gateway CORS config and Lambda returns CORS headers |
| 403 on S3 | Check bucket policy allows public read |
| "Demo Mode" shown | Verify VITE_API_URL is set before `npm run build` |
| Lambda timeout | Increase timeout to 10s in Lambda config |
| Empty data | Run the seed script to populate DynamoDB |
