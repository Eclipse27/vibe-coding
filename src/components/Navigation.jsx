import { LayoutDashboard, BarChart3, Zap, AlertTriangle, Lightbulb } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'usage', label: 'Energy Usage', icon: Zap },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
];

export default function Navigation({ activeSection, onNavigate }) {
  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
          aria-current={activeSection === item.id ? 'true' : undefined}
          id={`nav-${item.id}`}
        >
          <item.icon size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} aria-hidden="true" />
          {item.label}
        </button>
      ))}
    </nav>
  );
}
