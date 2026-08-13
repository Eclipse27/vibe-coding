import { PEAK_THRESHOLD_KW, TARIFF_PER_KWH, CURRENCY_SYMBOL } from '../config';
import { areaBreakdown, peakWindow, detectPeaks, totalConsumption, avgConsumption } from './calculations';

// Generate alerts from actual data analysis
export function generateAlerts(data) {
  const alerts = [];
  if (data.length === 0) return alerts;

  const areas = areaBreakdown(data);
  const total = totalConsumption(data);
  const avg = avgConsumption(data);
  const peaks = detectPeaks(data);
  const window = peakWindow(data);

  // Per-area alerts
  areas.forEach((area) => {
    const expectedShare = 100 / areas.length;
    const deviation = area.percentage - expectedShare;

    if (deviation > 10) {
      alerts.push({
        id: `high-${area.area}`,
        type: 'warning',
        title: `${area.area} consumption is ${Math.round(deviation)}% above average share`,
        description: `${area.area} is consuming ${area.energyKwh} kWh (${area.percentage}% of total). Consider reviewing usage patterns.`,
        area: area.area,
        timestamp: new Date().toISOString(),
      });
    } else if (deviation < -5) {
      alerts.push({
        id: `ok-${area.area}`,
        type: 'success',
        title: `${area.area} consumption is within expected range`,
        description: `${area.area} is consuming ${area.energyKwh} kWh (${area.percentage}% of total).`,
        area: area.area,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Peak alerts
  if (window) {
    alerts.push({
      id: 'peak-window',
      type: 'warning',
      title: `Peak consumption detected between ${window.start}–${window.end}`,
      description: `${peaks.length} hours exceeded the ${PEAK_THRESHOLD_KW} kW threshold. Total peak energy: ${Math.round(peaks.reduce((s, p) => s + p.energyKwh, 0) * 100) / 100} kWh.`,
      area: 'All',
      timestamp: new Date().toISOString(),
    });
  }

  // High daily cost alert
  const dailyCost = avg * TARIFF_PER_KWH;
  if (dailyCost > 300) {
    alerts.push({
      id: 'high-cost',
      type: 'error',
      title: `Daily estimated cost is ${CURRENCY_SYMBOL}${Math.round(dailyCost)}`,
      description: `At the current rate of ${avg} kWh/day, monthly cost could reach ${CURRENCY_SYMBOL}${Math.round(dailyCost * 30)}.`,
      area: 'All',
      timestamp: new Date().toISOString(),
    });
  }

  return alerts;
}

// Generate recommendations from actual data analysis
export function generateRecommendations(data) {
  const recs = [];
  if (data.length === 0) return recs;

  const areas = areaBreakdown(data);
  const peaks = detectPeaks(data);
  const window = peakWindow(data);

  // Sort areas by consumption
  const sorted = [...areas].sort((a, b) => b.energyKwh - a.energyKwh);
  const topConsumer = sorted[0];

  // Top consumer recommendation
  if (topConsumer && topConsumer.percentage > 25) {
    recs.push({
      id: 'reduce-top',
      priority: 'high',
      title: `Reduce ${topConsumer.area} usage`,
      description: `${topConsumer.area} accounts for ${topConsumer.percentage}% of consumption (${topConsumer.energyKwh} kWh). Reducing by 15% could save ${CURRENCY_SYMBOL}${Math.round(topConsumer.energyKwh * 0.15 * TARIFF_PER_KWH)}/day.`,
      savings: Math.round(topConsumer.energyKwh * 0.15 * TARIFF_PER_KWH),
    });
  }

  // Peak shifting
  if (window) {
    const peakEnergy = peaks.reduce((s, p) => s + p.energyKwh, 0);
    recs.push({
      id: 'shift-peak',
      priority: 'high',
      title: 'Shift high-energy tasks off-peak',
      description: `Peak window ${window.start}–${window.end} consumes ${Math.round(peakEnergy * 100) / 100} kWh. Shifting 20% of load to off-peak hours could save ${CURRENCY_SYMBOL}${Math.round(peakEnergy * 0.2 * TARIFF_PER_KWH)}/day.`,
      savings: Math.round(peakEnergy * 0.2 * TARIFF_PER_KWH),
    });
  }

  // Lighting optimization
  const lighting = areas.find((a) => a.area === 'Lighting');
  if (lighting && lighting.energyKwh > 5) {
    recs.push({
      id: 'lighting-opt',
      priority: 'medium',
      title: 'Optimize lighting zones',
      description: `Lighting uses ${lighting.energyKwh} kWh. Turning off unused zones during low-occupancy hours (22:00–06:00) could save up to ${CURRENCY_SYMBOL}${Math.round(lighting.energyKwh * 0.25 * TARIFF_PER_KWH)}/day.`,
      savings: Math.round(lighting.energyKwh * 0.25 * TARIFF_PER_KWH),
    });
  }

  // HVAC scheduling
  const hvac = areas.find((a) => a.area === 'HVAC');
  if (hvac && hvac.percentage > 20) {
    recs.push({
      id: 'hvac-schedule',
      priority: 'medium',
      title: 'Schedule HVAC pre-cooling',
      description: `HVAC consumes ${hvac.energyKwh} kWh (${hvac.percentage}%). Pre-cooling before peak hours and raising setpoints by 1°C could save 8-12% on HVAC energy.`,
      savings: Math.round(hvac.energyKwh * 0.1 * TARIFF_PER_KWH),
    });
  }

  // Standby power
  const other = areas.find((a) => a.area === 'Other');
  if (other && other.energyKwh > 3) {
    recs.push({
      id: 'standby',
      priority: 'low',
      title: 'Reduce standby power consumption',
      description: `"Other" category uses ${other.energyKwh} kWh. Review standby devices and consider smart power strips to cut phantom loads.`,
      savings: Math.round(other.energyKwh * 0.3 * TARIFF_PER_KWH),
    });
  }

  return recs.sort((a, b) => {
    const pri = { high: 0, medium: 1, low: 2 };
    return pri[a.priority] - pri[b.priority];
  });
}
