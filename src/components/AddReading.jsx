import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { AREAS } from '../config';

export default function AddReading({ onAdd }) {
  const [area, setArea] = useState('HVAC');
  const [powerKw, setPowerKw] = useState('');
  const [timestamp, setTimestamp] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // datetime-local format
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!powerKw || parseFloat(powerKw) <= 0) return;

    onAdd({
      area,
      powerKw: parseFloat(powerKw),
      timestamp: new Date(timestamp).toISOString(),
    });

    setPowerKw('');
    // Reset timestamp to now
    setTimestamp(new Date().toISOString().slice(0, 16));
  };

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <div className="card-head">
        <span className="card-head-title">Add Manual Reading</span>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reading-area">Area</label>
              <select
                id="reading-area"
                className="form-select"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              >
                {AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reading-power">Power (kW)</label>
              <input
                id="reading-power"
                type="number"
                step="0.01"
                min="0"
                max="100"
                className="form-input"
                placeholder="e.g. 2.5"
                value={powerKw}
                onChange={(e) => setPowerKw(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reading-time">Timestamp</label>
            <input
              id="reading-time"
              type="datetime-local"
              className="form-input"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            />
            <div className="form-hint">Defaults to current time. Change to log past readings.</div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={14} /> Add Reading
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
