import { areaBreakdown, latestAreaStatus } from '../utils/calculations';
import { CURRENCY_SYMBOL } from '../config';

export default function UsageTable({ data, settings }) {
  const tariff = settings?.tariffPerKwh || 9;
  const breakdown = areaBreakdown(data, tariff);
  const statuses = latestAreaStatus(data);
  const statusMap = {};
  statuses.forEach((s) => { statusMap[s.area] = s.status; });

  if (breakdown.length === 0) {
    return (
      <div className="card">
        <div className="card-head"><span className="card-head-title">Usage Breakdown</span></div>
        <div className="chart-wrap"><div className="chart-empty">No data</div></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-head"><span className="card-head-title">Usage Breakdown</span></div>
      <div className="card-body-flush tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Area</th>
              <th>Current Power</th>
              <th>Consumption</th>
              <th>Est. Cost</th>
              <th>Share</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((row) => (
              <tr key={row.area}>
                <td className="td-bold">{row.area}</td>
                <td>{row.powerKw} kW</td>
                <td>{row.energyKwh} kWh</td>
                <td>{CURRENCY_SYMBOL}{row.cost}</td>
                <td>{row.percentage}%</td>
                <td>
                  <span className={`badge badge-${(statusMap[row.area] || 'Normal').toLowerCase()}`}>
                    <span className="badge-dot"></span>
                    {statusMap[row.area] || 'Normal'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
