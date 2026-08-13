import { useState, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../config';

export default function DataExplorer({ data, onDelete, settings }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const tariff = settings?.tariffPerKwh || 9;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...data];

    if (filterArea !== 'All') {
      result = result.filter(d => d.area === filterArea);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(d => 
        d.area.toLowerCase().includes(term) ||
        d.id.toLowerCase().includes(term) ||
        d.status.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [data, searchTerm, filterArea, sortConfig]);

  // Pagination (simple)
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;
  const totalPages = Math.ceil(filteredAndSorted.length / rowsPerPage);
  const paginatedData = filteredAndSorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-head-title">Data Explorer</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{filteredAndSorted.length} records</span>
      </div>
      <div className="card-body">
        <div className="form-row" style={{ marginBottom: 16 }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search ID, Area, Status..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="form-select" 
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
          >
            <option value="All">All Areas</option>
            {['HVAC', 'Lighting', 'Computing', 'Kitchen', 'Other'].map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="card-body-flush tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th onClick={() => handleSort('timestamp')} style={{ cursor: 'pointer' }}>Time{getSortIcon('timestamp')}</th>
              <th onClick={() => handleSort('area')} style={{ cursor: 'pointer' }}>Area{getSortIcon('area')}</th>
              <th onClick={() => handleSort('powerKw')} style={{ cursor: 'pointer' }}>Power (kW){getSortIcon('powerKw')}</th>
              <th onClick={() => handleSort('energyKwh')} style={{ cursor: 'pointer' }}>Energy (kWh){getSortIcon('energyKwh')}</th>
              <th onClick={() => handleSort('cost')} style={{ cursor: 'pointer' }}>Cost{getSortIcon('cost')}</th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status{getSortIcon('status')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px 0' }}>No records found</td>
              </tr>
            ) : (
              paginatedData.map(row => (
                <tr key={row.id}>
                  <td>
                    {new Date(row.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    {' '}
                    {new Date(row.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="td-bold">{row.area}</td>
                  <td>{row.powerKw}</td>
                  <td>{row.energyKwh}</td>
                  <td>{CURRENCY_SYMBOL}{row.cost}</td>
                  <td>
                    <span className={`badge badge-${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-icon" 
                      style={{ width: 28, height: 28 }}
                      onClick={() => onDelete(row.id)}
                      title="Delete reading"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--divider)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Page {page} of {totalPages}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <button className="btn btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
