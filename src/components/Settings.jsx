import { useState, useEffect } from 'react';
import { Save, AlertOctagon } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../config';

export default function Settings({ settings, onSave, onResetData }) {
  const [localSettings, setLocalSettings] = useState(settings || {});
  
  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localSettings);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to delete all local energy data and reset to the default 30-day history? This cannot be undone.")) {
      onResetData();
    }
  };

  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <div className="card-head">
        <span className="card-head-title">Application Settings</span>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          
          <div className="settings-section">
            <h3 className="settings-section-title">General</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="siteName">Site Name</label>
              <input 
                id="siteName"
                type="text" 
                className="form-input" 
                value={localSettings.siteName || ''}
                onChange={(e) => handleChange('siteName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="autoRefresh">Auto-Refresh Interval (Seconds)</label>
              <input 
                id="autoRefresh"
                type="number" 
                min="5" 
                max="3600"
                className="form-input" 
                value={localSettings.autoRefreshSeconds || 30}
                onChange={(e) => handleChange('autoRefreshSeconds', parseInt(e.target.value))}
              />
              <div className="form-hint">How often the live simulation generates new readings (default: 30s).</div>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">Energy Parameters</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="tariff">Tariff ({CURRENCY_SYMBOL}/kWh)</label>
                <input 
                  id="tariff"
                  type="number" 
                  step="0.1" 
                  min="0"
                  className="form-input" 
                  value={localSettings.tariffPerKwh || ''}
                  onChange={(e) => handleChange('tariffPerKwh', parseFloat(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="peak">Peak Threshold (kW)</label>
                <input 
                  id="peak"
                  type="number" 
                  step="0.5" 
                  min="0"
                  className="form-input" 
                  value={localSettings.peakThreshold || ''}
                  onChange={(e) => handleChange('peakThreshold', parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="efficiency">Efficiency Target (kWh/day)</label>
              <input 
                id="efficiency"
                type="number" 
                step="1" 
                min="0"
                className="form-input" 
                value={localSettings.efficiencyTarget || ''}
                onChange={(e) => handleChange('efficiencyTarget', parseInt(e.target.value))}
              />
              <div className="form-hint">Daily consumption target to calculate the 0-100% efficiency score.</div>
            </div>
          </div>

          <div className="form-actions" style={{ borderBottom: '1px solid var(--divider)', paddingBottom: 24, marginBottom: 24 }}>
            <button type="submit" className="btn btn-primary">
              <Save size={14} /> Save Settings
            </button>
          </div>
          
        </form>

        <div className="settings-section" style={{ marginBottom: 0 }}>
          <h3 className="settings-section-title" style={{ color: 'var(--red)', borderColor: 'var(--red-100)' }}>Danger Zone</h3>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>
            Resetting data will wipe your local history and re-generate a fresh 30-day simulation based on the Indian residential models.
          </p>
          <button type="button" className="btn btn-danger" onClick={handleReset}>
            <AlertOctagon size={14} /> Factory Reset Data
          </button>
        </div>

      </div>
    </div>
  );
}
