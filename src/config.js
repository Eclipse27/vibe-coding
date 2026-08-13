// Energy tariff configuration
// This is an estimated, configurable rate — not a real provider's published tariff.
export const TARIFF_PER_KWH = 9; // ₹ per kWh
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

// Peak detection threshold (kW)
export const PEAK_THRESHOLD_KW = 5.0;

// Efficiency target (kWh per day — lower is better)
export const EFFICIENCY_TARGET_KWH = 40;

// Areas/categories
export const AREAS = ['HVAC', 'Lighting', 'Computing', 'Kitchen', 'Other'];

// Status thresholds
export const STATUS_THRESHOLDS = {
  high: 4.0,    // kW — above this is "High"
  medium: 2.0,  // kW — above this is "Medium"
  // below medium is "Normal"
};

// API configuration
export const API_URL = import.meta.env.VITE_API_URL || '';
