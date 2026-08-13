import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { areaBreakdown } from '../utils/calculations';
import { CURRENCY_SYMBOL } from '../config';

const COLORS = ['#2563eb', '#7c3aed', '#ec4899', '#f59e0b', '#0d9488'];

function DonutTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <div className="label">{d.area}</div>
      <div className="value">{d.energyKwh} kWh ({d.percentage}%)</div>
      <div className="value">Cost: {CURRENCY_SYMBOL}{d.cost}</div>
    </div>
  );
}

export default function AreaBreakdown({ data, settings }) {
  const tariff = settings?.tariffPerKwh || 9;
  const breakdown = areaBreakdown(data, tariff);

  if (breakdown.every((b) => b.energyKwh === 0)) {
    return (
      <div className="card">
        <div className="card-head"><span className="card-head-title">By Area</span></div>
        <div className="chart-wrap"><div className="chart-empty">No area data</div></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-head"><span className="card-head-title">Consumption by Area</span></div>
      <div className="chart-wrap">
        <div className="chart-row">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={breakdown} dataKey="energyKwh" nameKey="area"
                cx="50%" cy="50%" innerRadius={65} outerRadius={110}
                paddingAngle={2} stroke="none">
                {breakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-legend">
            {breakdown.map((item, i) => (
              <div className="donut-legend-row" key={item.area}>
                <span className="donut-dot" style={{ background: COLORS[i] }}></span>
                <span className="donut-label">{item.area}</span>
                <span className="donut-val">{item.energyKwh} kWh</span>
                <span className="donut-pct">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
