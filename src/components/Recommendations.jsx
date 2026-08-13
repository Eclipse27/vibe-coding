import { Lightbulb, TrendingDown } from 'lucide-react';
import { generateRecommendations } from '../utils/analytics';
import { CURRENCY_SYMBOL } from '../config';

export default function Recommendations({ data, settings }) {
  const recs = generateRecommendations(data, settings);

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-head-title">Recommendations</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{recs.length} suggestions</span>
      </div>
      <div className="card-body">
        {recs.length === 0 ? (
          <div className="chart-empty" style={{ height: 120 }}>Consumption looks optimal</div>
        ) : (
          <div className="recs-list">
            {recs.map((rec) => (
              <div className="rec-item" key={rec.id}>
                <div className="rec-item-head">
                  <Lightbulb size={14} style={{ color: 'var(--amber)' }} />
                  <span className={`rec-pri ${rec.priority}`}>{rec.priority}</span>
                </div>
                <div className="rec-item-title">{rec.title}</div>
                <div className="rec-item-desc">{rec.description}</div>
                {rec.savings > 0 && (
                  <div className="rec-item-save">
                    <TrendingDown size={14} /> Save {CURRENCY_SYMBOL}{rec.savings}/day
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
