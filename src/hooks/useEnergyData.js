import { useState, useEffect, useCallback, useRef } from 'react';
import {
  generateHistoricalData,
  generateLiveReading,
  saveReadings,
  loadReadings,
  clearReadings,
  createManualReading,
  filterByPeriod,
  filterPreviousPeriod,
  loadSettings,
  saveSettings,
} from '../data/demoData';
import { fetchEnergyData } from '../services/api';
import { TARIFF_PER_KWH, PEAK_THRESHOLD_KW, EFFICIENCY_TARGET_KWH } from '../config';

const DEFAULT_SETTINGS = {
  tariffPerKwh: TARIFF_PER_KWH,
  peakThreshold: PEAK_THRESHOLD_KW,
  efficiencyTarget: EFFICIENCY_TARGET_KWH,
  autoRefreshSeconds: 30,
  siteName: 'Main Office',
};

export function useEnergyData() {
  const [allData, setAllData] = useState([]);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('today');
  const [settings, setSettingsState] = useState(() => loadSettings() || DEFAULT_SETTINGS);
  const [toasts, setToasts] = useState([]);
  const timerRef = useRef(null);

  // Toast helper
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // Load initial data
  const loadData = useCallback(async () => {
    setLoading(true);

    // Try cloud API first
    const result = await fetchEnergyData();
    if (result.success && result.data && result.data.length > 0) {
      setAllData(result.data);
      setIsCloudConnected(true);
      saveReadings(result.data);
      setLoading(false);
      return;
    }

    // Try localStorage
    const stored = loadReadings();
    if (stored && stored.length > 0) {
      setAllData(stored);
    } else {
      // Generate fresh historical data
      const historical = generateHistoricalData(30);
      setAllData(historical);
      saveReadings(historical);
    }

    setIsCloudConnected(false);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Real-time auto-refresh
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const liveReadings = generateLiveReading();
      setAllData((prev) => {
        const updated = [...prev, ...liveReadings];
        saveReadings(updated);
        return updated;
      });
    }, (settings.autoRefreshSeconds || 30) * 1000);

    return () => clearInterval(timerRef.current);
  }, [settings.autoRefreshSeconds]);

  // Add manual reading
  const addReading = useCallback((readingInput) => {
    const reading = createManualReading(readingInput);
    setAllData((prev) => {
      const updated = [...prev, reading];
      saveReadings(updated);
      return updated;
    });
    addToast(`Reading added: ${reading.area} — ${reading.powerKw} kW`);
    return reading;
  }, [addToast]);

  // Delete reading
  const deleteReading = useCallback((id) => {
    setAllData((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      saveReadings(updated);
      return updated;
    });
    addToast('Reading deleted');
  }, [addToast]);

  // Update settings
  const updateSettings = useCallback((newSettings) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
    addToast('Settings saved');
  }, [addToast]);

  // Reset all data
  const resetData = useCallback(() => {
    clearReadings();
    const fresh = generateHistoricalData(30);
    setAllData(fresh);
    saveReadings(fresh);
    addToast('Data reset to initial state');
  }, [addToast]);

  // Export CSV
  const exportCSV = useCallback(() => {
    const filtered = filterByPeriod(allData, period);
    const headers = 'ID,Timestamp,Area,Power (kW),Energy (kWh),Cost (₹),Status\n';
    const rows = filtered.map((d) =>
      `${d.id},${d.timestamp},${d.area},${d.powerKw},${d.energyKwh},${d.cost},${d.status}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energy-data-${period}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('CSV exported');
  }, [allData, period, addToast]);

  // Filtered data
  const data = filterByPeriod(allData, period);
  const previousData = filterPreviousPeriod(allData, period);

  return {
    data,
    previousData,
    allData,
    isCloudConnected,
    loading,
    period,
    setPeriod,
    settings,
    updateSettings,
    addReading,
    deleteReading,
    resetData,
    exportCSV,
    refresh: loadData,
    toasts,
    addToast,
  };
}
