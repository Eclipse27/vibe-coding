const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || 'EnergyConsumption';

// CORS headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const method = event.httpMethod || event.requestContext?.http?.method;

  try {
    if (method === 'GET') {
      const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.Items || []),
      };
    }

    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');

      if (!body.id || !body.timestamp || !body.area) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields: id, timestamp, area' }),
        };
      }

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: body.id,
          timestamp: body.timestamp,
          area: body.area,
          powerKw: body.powerKw || 0,
          energyKwh: body.energyKwh || 0,
          cost: body.cost || 0,
          status: body.status || 'Normal',
        },
      }));

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: 'Record created' }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
