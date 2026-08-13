import { useState, useEffect } from 'react';
import { RefreshCw, Zap } from 'lucide-react';

export default function Header({ isCloudConnected, onRefresh, loading }) {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatted = dateTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) + ' · ' + dateTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="header" role="banner">
      <div className="header-left">
        <div className="header-logo" aria-hidden="true">
          <Zap size={18} />
        </div>
        <h1 className="header-title">Energy Consumption Monitoring</h1>
      </div>
      <div className="header-right">
        <span className="header-datetime" aria-label="Current date and time">{formatted}</span>
        <div
          className={`cloud-status ${isCloudConnected ? 'connected' : 'demo'}`}
          role="status"
          aria-label={isCloudConnected ? 'Cloud Connected' : 'Demo Mode'}
        >
          <span className="cloud-status-dot" aria-hidden="true"></span>
          {isCloudConnected ? 'Cloud Connected' : 'Demo Mode'}
        </div>
        <button
          className={`btn-refresh ${loading ? 'spinning' : ''}`}
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh data"
          id="btn-refresh"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
    </header>
  );
}
