import { useState, useEffect } from 'react';
import { RefreshCw, Download } from 'lucide-react';

const TITLES = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  alerts: 'Alerts',
  recommendations: 'Recommendations',
  'add-reading': 'Add Reading',
  data: 'Data Explorer',
  settings: 'Settings',
};

export default function Topbar({ page, onRefresh, onExport, loading }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{TITLES[page] || 'Dashboard'}</h1>
      </div>
      <div className="topbar-right">
        <span className="topbar-time">
          {time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          {' · '}
          {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        {onExport && (
          <button className="btn-icon" onClick={onExport} title="Export CSV" aria-label="Export CSV">
            <Download size={16} />
          </button>
        )}
        <button
          className={`btn-icon ${loading ? 'spinning' : ''}`}
          onClick={onRefresh}
          disabled={loading}
          title="Refresh"
          aria-label="Refresh data"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
}
