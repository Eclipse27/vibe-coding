import { TrendingUp, Calendar, Clock, Activity } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../config';
import { avgConsumption } from '../utils/calculations';

export default function Forecasting({ data, settings }) {
  const tariff = settings?.tariffPerKwh || 9;
  const avgDaily = avgConsumption(data);

  if (data.length === 0 || avgDaily === 0) {
    return null;
  }

  // Calculate projections
  const projections = [
    {
      label: 'Weekly Forecast',
      period: '7 days',
      icon: Clock,
      kwh: Math.round(avgDaily * 7),
      cost: Math.round(avgDaily * 7 * tariff),
      color: 'var(--blue)',
      bg: 'var(--blue-50)'
    },
    {
      label: 'Monthly Forecast',
      period: '30 days',
      icon: Calendar,
      kwh: Math.round(avgDaily * 30),
      cost: Math.round(avgDaily * 30 * tariff),
      color: 'var(--amber)',
      bg: 'var(--amber-50)'
    },
    {
      label: 'Yearly Forecast',
      period: '365 days',
      icon: TrendingUp,
      kwh: Math.round(avgDaily * 365),
      cost: Math.round(avgDaily * 365 * tariff),
      color: 'var(--purple)',
      bg: 'var(--purple-50)'
    }
  ];

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="card-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={16} color="var(--blue)" />
          <span className="card-head-title">Predictive Forecasting</span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Based on current avg of {avgDaily} kWh/day</span>
      </div>
      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          {projections.map((proj) => (
            <div key={proj.label} style={{ 
              padding: 16, 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}>
              <div style={{ 
                width: 48, height: 48, 
                borderRadius: 12, 
                background: proj.bg, 
                color: proj.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <proj.icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {proj.label}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>
                  {CURRENCY_SYMBOL}{proj.cost.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
                  {proj.kwh.toLocaleString('en-IN')} kWh
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
