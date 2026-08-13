import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { generateAlerts } from '../utils/analytics';

const ICONS = { warning: AlertTriangle, error: AlertCircle, success: CheckCircle, info: Info };

export default function AlertsPanel({ data, settings }) {
  const alerts = generateAlerts(data, settings);

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-head-title">Alerts</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{alerts.length} active</span>
      </div>
      <div className="card-body-flush">
        {alerts.length === 0 ? (
          <div className="chart-wrap"><div className="chart-empty" style={{ height: 120 }}>All systems normal</div></div>
        ) : (
          <div>
            {alerts.map((alert) => {
              const Icon = ICONS[alert.type] || Info;
              return (
                <div className={`alert-row ${alert.type}`} key={alert.id}>
                  <div className="alert-dot"><Icon size={14} /></div>
                  <div className="alert-body">
                    <div className="alert-body-title">{alert.title}</div>
                    <div className="alert-body-desc">{alert.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
