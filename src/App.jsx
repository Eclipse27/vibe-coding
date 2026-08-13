import { useState } from 'react';
import { useEnergyData } from './hooks/useEnergyData';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import SummaryCards from './components/SummaryCards';
import ConsumptionChart from './components/ConsumptionChart';
import AreaBreakdown from './components/AreaBreakdown';
import UsageTable from './components/UsageTable';
import AlertsPanel from './components/AlertsPanel';
import Recommendations from './components/Recommendations';
import Forecasting from './components/Forecasting';
import AddReading from './components/AddReading';
import DataExplorer from './components/DataExplorer';
import Settings from './components/Settings';

export default function App() {
  const { 
    data, 
    previousData,
    allData, 
    isCloudConnected, 
    loading, 
    period, 
    setPeriod, 
    refresh,
    settings,
    updateSettings,
    addReading,
    deleteReading,
    resetData,
    exportCSV,
    toasts
  } = useEnergyData();

  const [activePage, setActivePage] = useState('dashboard');

  if (loading) {
    return (
      <div className="app" style={{ background: 'var(--white)' }}>
        <div className="loading-wrap">
          <div className="loading-spin"></div>
          <div className="loading-text">Initializing Energy Engine...</div>
        </div>
      </div>
    );
  }

  // Render view based on active sidebar item
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <>
            <SummaryCards data={data} previousData={previousData} settings={settings} />
            <Forecasting data={allData} settings={settings} />
            <div className="grid-2">
              <ConsumptionChart data={data} period={period} onPeriodChange={setPeriod} settings={settings} />
              <AreaBreakdown data={data} settings={settings} />
            </div>
            <UsageTable data={data} settings={settings} />
          </>
        );
      case 'analytics':
        return (
          <>
            <Forecasting data={allData} settings={settings} />
            <ConsumptionChart data={data} period={period} onPeriodChange={setPeriod} settings={settings} />
            <div style={{ marginTop: 24 }}>
              <AreaBreakdown data={data} settings={settings} />
            </div>
          </>
        );
      case 'alerts':
        return <AlertsPanel data={data} settings={settings} />;
      case 'recommendations':
        return <Recommendations data={data} settings={settings} />;
      case 'add-reading':
        return <AddReading onAdd={addReading} />;
      case 'data':
        return <DataExplorer data={allData} onDelete={deleteReading} settings={settings} />;
      case 'settings':
        return <Settings settings={settings} onSave={updateSettings} onResetData={resetData} />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Sidebar 
        active={activePage} 
        onNavigate={setActivePage} 
        isLive={!isCloudConnected} // Local simulation is "live"
        siteName={settings?.siteName}
      />
      
      <div className="main-area">
        <Topbar 
          page={activePage} 
          onRefresh={refresh}
          onExport={activePage === 'data' ? exportCSV : null}
          loading={loading}
        />
        
        <main className="page-content">
          {renderContent()}
        </main>
        
        {/* Footer info bar */}
        <div className="footer-bar">
          <div>Local Energy Simulation Engine v2.0</div>
          <div>Data mode: {isCloudConnected ? 'Cloud AWS' : 'Local Indexed (Real-time)'}</div>
        </div>
      </div>

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
