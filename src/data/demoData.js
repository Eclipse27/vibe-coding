// Real-time energy data engine
// Simulates patterns from the "Individual household electric power consumption" Kaggle dataset
// Maps sub-metering points (Kitchen, HVAC, etc.) to Indian residential patterns.

import { TARIFF_PER_KWH, AREAS, STATUS_THRESHOLDS } from '../config';

const STORAGE_KEY = 'energy_readings';
const SETTINGS_KEY = 'energy_settings';

// Realistic appliance power ratings (kW) for Indian households/offices
const APPLIANCE_DATA = {
  HVAC: {
    devices: ['Split AC 1.5T', 'Split AC 1T', 'Ceiling Fans', 'Exhaust Fans'],
    baseLoadKw: [1.5, 1.0, 0.075, 0.04],
    // Hour-by-hour usage probability (0-1) — Indian climate pattern
    hourlyProfile: [0.3,0.2,0.2,0.15,0.15,0.2,0.4,0.6,0.75,0.85,0.9,0.95,1.0,1.0,0.95,0.9,0.85,0.8,0.85,0.9,0.8,0.65,0.5,0.35],
  },
  Lighting: {
    devices: ['LED Panels', 'Tube Lights', 'Desk Lamps', 'Corridor Lights'],
    baseLoadKw: [0.04, 0.036, 0.01, 0.02],
    hourlyProfile: [0.1,0.1,0.1,0.1,0.1,0.15,0.6,0.9,0.7,0.5,0.5,0.5,0.5,0.5,0.5,0.6,0.7,0.85,1.0,1.0,0.9,0.7,0.4,0.15],
  },
  Computing: {
    devices: ['Desktop PCs', 'Monitors', 'Server/NAS', 'Printer'],
    baseLoadKw: [0.3, 0.04, 0.15, 0.05],
    hourlyProfile: [0.1,0.05,0.05,0.05,0.05,0.05,0.15,0.7,0.95,1.0,1.0,0.95,0.7,0.85,1.0,1.0,0.9,0.75,0.4,0.25,0.15,0.1,0.1,0.1],
  },
  Kitchen: {
    devices: ['Refrigerator', 'Microwave', 'Water Purifier', 'Electric Kettle'],
    baseLoadKw: [0.15, 1.2, 0.06, 1.5],
    // Fridge runs 24/7, others spike at meal times
    hourlyProfile: [0.15,0.15,0.15,0.15,0.15,0.15,0.35,0.8,0.6,0.2,0.15,0.3,0.9,0.7,0.2,0.15,0.2,0.5,0.85,0.9,0.4,0.2,0.15,0.15],
  },
  Other: {
    devices: ['Water Pump', 'Washing Machine', 'Iron', 'Miscellaneous'],
    baseLoadKw: [0.75, 0.5, 1.0, 0.1],
    hourlyProfile: [0.05,0.05,0.05,0.05,0.05,0.1,0.4,0.6,0.3,0.15,0.1,0.1,0.1,0.1,0.1,0.15,0.2,0.35,0.5,0.4,0.2,0.1,0.05,0.05],
  },
};

// Day-of-week multipliers (Mon=1 to Sun=7)
const DAY_MULTIPLIERS = [1.0, 1.0, 1.0, 1.0, 0.95, 0.7, 0.65]; // lower on weekends

// Seasonal multiplier (month 0-11)
const MONTH_MULTIPLIERS = [0.75, 0.8, 0.9, 1.05, 1.15, 1.1, 0.95, 0.9, 0.9, 0.85, 0.8, 0.75];

function getStatus(kw) {
  if (kw >= STATUS_THRESHOLDS.high) return 'High';
  if (kw >= STATUS_THRESHOLDS.medium) return 'Medium';
  return 'Normal';
}

// Deterministic-ish but varied random
function stableRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate a single reading for a specific area at a specific time
function generateReading(area, timestamp) {
  const dt = new Date(timestamp);
  const hour = dt.getHours();
  const dayOfWeek = dt.getDay() === 0 ? 6 : dt.getDay() - 1; // Mon=0
  const month = dt.getMonth();
  const minuteSeed = dt.getMinutes();

  const profile = APPLIANCE_DATA[area];
  const hourlyFactor = profile.hourlyProfile[hour];
  const dayFactor = DAY_MULTIPLIERS[dayOfWeek];
  const monthFactor = MONTH_MULTIPLIERS[month];

  // Calculate total base load for this area
  const totalBaseKw = profile.baseLoadKw.reduce((sum, kw, i) => {
    // Each device has probability of being on based on hour
    const deviceVariation = stableRandom(hour * 100 + i * 17 + dt.getDate() * 7 + minuteSeed);
    const isActive = deviceVariation < hourlyFactor;
    return sum + (isActive ? kw * (0.8 + deviceVariation * 0.4) : kw * 0.05); // standby
  }, 0);

  // Apply multipliers with some natural noise
  const noise = 0.85 + stableRandom(dt.getTime() / 60000 + area.charCodeAt(0)) * 0.3;
  const powerKw = Math.round(totalBaseKw * hourlyFactor * dayFactor * monthFactor * noise * 100) / 100;
  const energyKwh = Math.round(powerKw * 1 * 100) / 100; // 1-hour interval
  const cost = Math.round(energyKwh * TARIFF_PER_KWH * 100) / 100;

  return {
    id: `${dt.toISOString().split('T')[0]}-${String(hour).padStart(2, '0')}-${area}-${minuteSeed}`,
    timestamp: dt.toISOString(),
    area,
    powerKw,
    energyKwh,
    cost,
    status: getStatus(powerKw),
    devices: profile.devices,
  };
}

// Generate historical data for N days
export function generateHistoricalData(days = 30) {
  const data = [];
  const now = new Date();

  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(now.getDate() - d);
    date.setHours(0, 0, 0, 0);

    const maxHour = d === 0 ? now.getHours() : 23;

    for (let h = 0; h <= maxHour; h++) {
      const ts = new Date(date);
      ts.setHours(h, 0, 0, 0);

      for (const area of AREAS) {
        data.push(generateReading(area, ts));
      }
    }
  }
  return data;
}

// Generate a real-time reading (current moment)
export function generateLiveReading() {
  const now = new Date();
  return AREAS.map((area) => generateReading(area, now));
}

// ── localStorage persistence ──

export function saveReadings(readings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
  } catch (e) {
    console.warn('Could not save readings:', e);
  }
}

export function loadReadings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not load readings:', e);
  }
  return null;
}

export function clearReadings() {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Settings persistence ──

export function loadSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { /* ignore */ }
  return null;
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) { /* ignore */ }
}

// ── Manual reading ──

export function createManualReading({ area, powerKw, timestamp }) {
  const dt = new Date(timestamp || Date.now());
  const kw = parseFloat(powerKw) || 0;
  const energyKwh = Math.round(kw * 100) / 100;
  const cost = Math.round(energyKwh * TARIFF_PER_KWH * 100) / 100;

  return {
    id: `manual-${Date.now()}-${area}`,
    timestamp: dt.toISOString(),
    area,
    powerKw: kw,
    energyKwh,
    cost,
    status: getStatus(kw),
    manual: true,
  };
}

// ── Data filtering ──

export function filterByPeriod(data, period) {
  const now = new Date();
  let cutoff;

  switch (period) {
    case 'today':
      cutoff = new Date(now);
      cutoff.setHours(0, 0, 0, 0);
      break;
    case 'week':
      cutoff = new Date(now);
      cutoff.setDate(now.getDate() - 7);
      break;
    case 'month':
      cutoff = new Date(now);
      cutoff.setDate(now.getDate() - 30);
      break;
    default:
      cutoff = new Date(now);
      cutoff.setHours(0, 0, 0, 0);
  }

  return data.filter((d) => new Date(d.timestamp) >= cutoff);
}

export function filterPreviousPeriod(data, period) {
  const now = new Date();
  let start, end;

  switch (period) {
    case 'today':
      end = new Date(now); end.setHours(0, 0, 0, 0);
      start = new Date(end); start.setDate(start.getDate() - 1);
      break;
    case 'week':
      end = new Date(now); end.setDate(now.getDate() - 7);
      start = new Date(end); start.setDate(end.getDate() - 7);
      break;
    case 'month':
      end = new Date(now); end.setDate(now.getDate() - 30);
      start = new Date(end); start.setDate(end.getDate() - 30);
      break;
    default:
      return [];
  }

  return data.filter((d) => {
    const dt = new Date(d.timestamp);
    return dt >= start && dt < end;
  });
}
