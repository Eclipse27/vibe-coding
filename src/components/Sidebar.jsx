import { Zap, LayoutDashboard, BarChart3, PlusCircle, Settings, Database, AlertTriangle, Lightbulb } from 'lucide-react';

const SECTIONS = [
  { group: 'Monitor' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  { group: 'Manage' },
  { id: 'add-reading', label: 'Add Reading', icon: PlusCircle },
  { id: 'data', label: 'Data Explorer', icon: Database },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ active, onNavigate, isLive, siteName }) {
  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      <div className="sidebar-brand">
        <Zap size={22} />
        <div>
          <div className="sidebar-brand-text">Energy Monitor</div>
          <div className="sidebar-brand-sub">{siteName || 'Main Office'}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {SECTIONS.map((item) => {
          if (item.group) {
            return (
              <div className="sidebar-section-label" key={item.group}>{item.group}</div>
            );
          }
          return (
            <button
              key={item.id}
              className={`sidebar-item ${active === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              id={`nav-${item.id}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className={`sidebar-status ${isLive ? 'status-live' : ''}`}>
          <span className="sidebar-status-dot"></span>
          {isLive ? 'Live monitoring' : 'Offline'}
        </div>
      </div>
    </aside>
  );
}
