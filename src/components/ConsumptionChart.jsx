import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, AreaChart, Area } from 'recharts';
import { hourlyAggregation } from '../utils/calculations';

function ChartTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <div className="label">{d.time || d.date}</div>
      <div className="value">Energy: {d.energyKwh} kWh</div>
      <div className="value">Power: {d.powerKw} kW</div>
      {d.isPeak && <div className="peak-flag">⚡ Peak threshold exceeded</div>}
    </div>
  );
}

export default function ConsumptionChart({ data, period, onPeriodChange, settings }) {
  const threshold = settings?.peakThreshold || 5;

  // Build chart data based on period
  let chartData;
  if (period === 'today') {
    chartData = hourlyAggregation(data, threshold);
  } else {
    const byDate = {};
    data.forEach((d) => {
      const date = d.timestamp.substring(0, 10);
      if (!byDate[date]) byDate[date] = { date, time: date.substring(5), energyKwh: 0, powerKw: 0 };
      byDate[date].energyKwh += d.energyKwh;
      byDate[date].powerKw = Math.max(byDate[date].powerKw, d.powerKw);
    });
    chartData = Object.values(byDate)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({
        ...d,
        energyKwh: Math.round(d.energyKwh * 100) / 100,
        powerKw: Math.round(d.powerKw * 100) / 100,
        isPeak: d.powerKw >= threshold,
      }));
  }

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-head-title">
          {period === 'today' ? 'Hourly Consumption' : period === 'week' ? 'Daily (7 days)' : 'Daily (30 days)'}
        </span>
        <div className="chips">
          {[{ v: 'today', l: 'Today' }, { v: 'week', l: '7 Days' }, { v: 'month', l: '30 Days' }].map((p) => (
            <button
              key={p.v}
              className={`chip ${period === p.v ? 'active' : ''}`}
              onClick={() => onPeriodChange(p.v)}
            >
              {p.l}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-wrap">
        {chartData.length === 0 ? (
          <div className="chart-empty">No data for this period</div>
        ) : period === 'today' ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} unit=" kWh" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(37,99,235,0.04)' }} />
              <ReferenceLine y={threshold} stroke="#dc2626" strokeDasharray="4 4"
                label={{ value: `Peak ${threshold} kW`, fill: '#dc2626', fontSize: 10, position: 'insideTopRight' }} />
              <Bar dataKey="energyKwh" radius={[3, 3, 0, 0]} maxBarSize={32}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.isPeak ? '#dc2626' : '#2563eb'} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} unit=" kWh" />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="energyKwh" stroke="#2563eb" strokeWidth={2}
                fill="url(#areaFill)" dot={{ fill: '#2563eb', r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
