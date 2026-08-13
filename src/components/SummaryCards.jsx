import { Zap, IndianRupee, TrendingUp, Gauge, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../config';
import { totalConsumption, totalCost, peakPower, efficiencyScore, percentChange } from '../utils/calculations';

function Trend({ value, inverse }) {
  // inverse = true means down is bad (like efficiency drop)
  if (value > 0) {
    return (
      <span className={`summary-card-trend ${inverse ? 'trend-down' : 'trend-up'}`}>
        <ArrowUpRight size={13} /> +{value}%
        <span className="trend-vs">vs prev</span>
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className={`summary-card-trend ${inverse ? 'trend-up' : 'trend-down'}`}>
        <ArrowDownRight size={13} /> {value}%
        <span className="trend-vs">vs prev</span>
      </span>
    );
  }
  return (
    <span className="summary-card-trend trend-flat">
      <Minus size={13} /> 0%
      <span className="trend-vs">vs prev</span>
    </span>
  );
}

export default function SummaryCards({ data, previousData, settings }) {
  const tariff = settings?.tariffPerKwh || 9;
  const target = settings?.efficiencyTarget || 40;

  const consumption = totalConsumption(data);
  const cost = Math.round(consumption * tariff * 100) / 100;
  const peak = peakPower(data);
  const efficiency = efficiencyScore(data, target);
  const change = percentChange(data, previousData);

  const prevPeak = peakPower(previousData);
  const peakChange = prevPeak > 0 ? Math.round(((peak - prevPeak) / prevPeak) * 100 * 10) / 10 : 0;

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <div className="summary-card-top">
          <span className="summary-card-label">Total Consumption</span>
          <div className="summary-card-icon icon-blue"><Zap size={16} /></div>
        </div>
        <div className="summary-card-value">{consumption} <small style={{fontSize: 14, fontWeight: 400, color: 'var(--text-3)'}}>kWh</small></div>
        <Trend value={change} />
      </div>

      <div className="summary-card">
        <div className="summary-card-top">
          <span className="summary-card-label">Estimated Cost</span>
          <div className="summary-card-icon icon-green"><IndianRupee size={16} /></div>
        </div>
        <div className="summary-card-value">{CURRENCY_SYMBOL}{cost.toLocaleString('en-IN')}</div>
        <Trend value={change} />
      </div>

      <div className="summary-card">
        <div className="summary-card-top">
          <span className="summary-card-label">Peak Load</span>
          <div className="summary-card-icon icon-red"><TrendingUp size={16} /></div>
        </div>
        <div className="summary-card-value">{peak} <small style={{fontSize: 14, fontWeight: 400, color: 'var(--text-3)'}}>kW</small></div>
        <Trend value={peakChange} />
      </div>

      <div className="summary-card">
        <div className="summary-card-top">
          <span className="summary-card-label">Efficiency Score</span>
          <div className="summary-card-icon icon-amber"><Gauge size={16} /></div>
        </div>
        <div className="summary-card-value">{efficiency}<small style={{fontSize: 14, fontWeight: 400, color: 'var(--text-3)'}}>%</small></div>
        <Trend value={efficiency >= 80 ? 0 : -(100 - efficiency)} inverse />
      </div>
    </div>
  );
}
