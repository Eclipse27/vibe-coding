import { API_URL } from '../config';

// Fetch energy data from AWS API Gateway
export async function fetchEnergyData() {
  if (!API_URL) {
    return { success: false, data: null, error: 'No API URL configured' };
  }

  try {
    const response = await fetch(`${API_URL}/consumption`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

// Post energy data (optional endpoint)
export async function postEnergyData(record) {
  if (!API_URL) {
    return { success: false, error: 'No API URL configured' };
  }

  try {
    const response = await fetch(`${API_URL}/consumption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
