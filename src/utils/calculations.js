import { TARIFF_PER_KWH, PEAK_THRESHOLD_KW, EFFICIENCY_TARGET_KWH, AREAS } from '../config';

export function totalConsumption(data) {
  return Math.round(data.reduce((sum, d) => sum + d.energyKwh, 0) * 100) / 100;
}

export function totalCost(data, tariff = TARIFF_PER_KWH) {
  return Math.round(totalConsumption(data) * tariff * 100) / 100;
}

export function peakPower(data) {
  if (data.length === 0) return 0;
  const hourlyTotals = {};
  data.forEach((d) => {
    const hour = d.timestamp.substring(0, 13);
    hourlyTotals[hour] = (hourlyTotals[hour] || 0) + d.powerKw;
  });
  return Math.round(Math.max(...Object.values(hourlyTotals)) * 100) / 100;
}

export function avgConsumption(data) {
  const days = new Set(data.map((d) => d.timestamp.substring(0, 10)));
  if (days.size === 0) return 0;
  return Math.round((totalConsumption(data) / days.size) * 100) / 100;
}

export function efficiencyScore(data, target = EFFICIENCY_TARGET_KWH) {
  const avg = avgConsumption(data);
  if (avg === 0) return 100;
  const ratio = avg / target;
  return Math.round(Math.max(0, Math.min(100, (1 / ratio) * 100)));
}

export function percentChange(currentData, previousData) {
  const curr = totalConsumption(currentData);
  const prev = totalConsumption(previousData);
  if (prev === 0) return 0;
  return Math.round(((curr - prev) / prev) * 100 * 10) / 10;
}

export function hourlyAggregation(data, threshold = PEAK_THRESHOLD_KW) {
  const hourly = {};
  data.forEach((d) => {
    const hour = new Date(d.timestamp).getHours();
    const dateKey = d.timestamp.substring(0, 10);
    const key = `${dateKey}-${String(hour).padStart(2, '0')}`;
    if (!hourly[key]) {
      hourly[key] = { hour, time: `${String(hour).padStart(2, '0')}:00`, energyKwh: 0, powerKw: 0, date: dateKey };
    }
    hourly[key].energyKwh += d.energyKwh;
    hourly[key].powerKw += d.powerKw;
  });

  return Object.values(hourly)
    .sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.hour - b.hour)
    .map((h) => ({
      ...h,
      energyKwh: Math.round(h.energyKwh * 100) / 100,
      powerKw: Math.round(h.powerKw * 100) / 100,
      isPeak: h.powerKw >= threshold,
    }));
}

export function areaBreakdown(data, tariff = TARIFF_PER_KWH) {
  const totals = {};
  AREAS.forEach((a) => { totals[a] = { area: a, energyKwh: 0, powerKw: 0, count: 0 }; });

  data.forEach((d) => {
    if (totals[d.area]) {
      totals[d.area].energyKwh += d.energyKwh;
      totals[d.area].powerKw = Math.max(totals[d.area].powerKw, d.powerKw);
      totals[d.area].count += 1;
    }
  });

  const total = totalConsumption(data);

  return Object.values(totals).map((t) => ({
    ...t,
    energyKwh: Math.round(t.energyKwh * 100) / 100,
    cost: Math.round(t.energyKwh * tariff * 100) / 100,
    percentage: total > 0 ? Math.round((t.energyKwh / total) * 100 * 10) / 10 : 0,
    powerKw: Math.round(t.powerKw * 100) / 100,
  }));
}

export function latestAreaStatus(data) {
  const latest = {};
  data.forEach((d) => {
    if (!latest[d.area] || d.timestamp > latest[d.area].timestamp) {
      latest[d.area] = d;
    }
  });
  return Object.values(latest);
}

export function detectPeaks(data, threshold = PEAK_THRESHOLD_KW) {
  return hourlyAggregation(data, threshold).filter((h) => h.isPeak);
}

export function peakWindow(data, threshold = PEAK_THRESHOLD_KW) {
  const peaks = detectPeaks(data, threshold);
  if (peaks.length === 0) return null;
  const hours = peaks.map((p) => p.hour);
  return {
    start: `${String(Math.min(...hours)).padStart(2, '0')}:00`,
    end: `${String(Math.max(...hours) + 1).padStart(2, '0')}:00`,
  };
}
