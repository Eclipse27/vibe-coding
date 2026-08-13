// Seed script: generates demo data and inserts it into DynamoDB
// Usage: TABLE_NAME=EnergyConsumption AWS_REGION=ap-south-1 node seed.js

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = process.env.TABLE_NAME || 'EnergyConsumption';
const AREAS = ['HVAC', 'Lighting', 'Computing', 'Kitchen', 'Other'];
const TARIFF = 9;

const PROFILES = {
  HVAC: [1.2,1.0,1.0,0.8,0.8,1.0,1.5,2.0,2.8,3.0,3.2,3.5,3.8,4.0,3.8,3.5,3.2,3.0,3.5,3.8,3.2,2.5,1.8,1.4],
  Lighting: [0.3,0.2,0.2,0.2,0.2,0.3,0.8,1.2,1.0,0.8,0.8,0.8,0.8,0.8,0.8,0.9,1.0,1.2,1.5,1.5,1.2,0.8,0.5,0.3],
  Computing: [0.5,0.3,0.3,0.3,0.3,0.3,0.5,1.5,2.2,2.5,2.5,2.3,1.8,2.0,2.5,2.5,2.2,1.8,1.0,0.8,0.6,0.5,0.5,0.5],
  Kitchen: [0.2,0.1,0.1,0.1,0.1,0.2,0.8,1.5,1.0,0.3,0.3,0.5,1.8,1.5,0.3,0.3,0.5,1.2,2.0,1.8,0.5,0.3,0.2,0.2],
  Other: [0.3,0.2,0.2,0.2,0.2,0.2,0.3,0.5,0.6,0.6,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.6,0.8,0.8,0.6,0.4,0.3,0.3],
};

function getStatus(kw) {
  if (kw >= 4.0) return 'High';
  if (kw >= 2.0) return 'Medium';
  return 'Normal';
}

async function seed() {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  const today = new Date();
  let count = 0;

  for (let d = 6; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    date.setHours(0, 0, 0, 0);

    for (let hour = 0; hour < 24; hour++) {
      for (const area of AREAS) {
        const base = PROFILES[area][hour];
        const variation = 1 + (Math.random() - 0.5) * 0.3;
        const powerKw = Math.round(base * variation * 100) / 100;
        const energyKwh = powerKw;
        const cost = Math.round(energyKwh * TARIFF * 100) / 100;

        const ts = new Date(date);
        ts.setHours(hour, 0, 0, 0);

        await docClient.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            id: `${date.toISOString().split('T')[0]}-${String(hour).padStart(2,'0')}-${area}`,
            timestamp: ts.toISOString(),
            area,
            powerKw,
            energyKwh,
            cost,
            status: getStatus(powerKw),
          },
        }));
        count++;
      }
    }
  }

  console.log(`Seeded ${count} records into ${TABLE_NAME}`);
}

seed().catch(console.error);
