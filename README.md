# Energy Monitor App

A real-time, interactive energy consumption monitoring application built with React and Vite. Developed as part of the Cloud Strategy course (FT1 Vibe Coding Activity).

## Problem Statement

Monitoring energy consumption is crucial for understanding usage patterns, reducing costs, and promoting sustainability. Many existing solutions are overly complex, difficult to deploy, or lack real-time interactive capabilities. This project provides a clean, Google/SaaS-style application for live energy monitoring, data exploration, and analytics.

## Features

### 📊 Interactive Dashboard
- **Summary Metrics**: Real-time calculations of Total Consumption, Estimated Cost, Peak Load, and Efficiency Score, with trend indicators comparing usage against previous periods.
- **Consumption Chart**: Interactive bar/area charts showing Hourly or Daily consumption. Highlights peak usage in red based on configurable thresholds.
- **Area Breakdown**: Donut chart and detailed data table showing exactly where power is being consumed (HVAC, Lighting, Kitchen, Computing, Other).

### ⚡ Real-Time Energy Engine (Kaggle Modeled)
- **Kaggle-Modeled Dataset**: The internal simulation engine is modeled after the famous Kaggle "Individual household electric power consumption" dataset (UCI), dynamically mapping sub-metering points (HVAC, Kitchen, etc.) to realistic load profiles.
- **Live Monitoring Simulation**: The app runs a simulation engine in the background. Every 30 seconds (configurable), it generates new power readings and updates the dashboard live.
- **Realistic Data Modeling**: Applies day-of-week and seasonal multipliers to baseline loads to ensure the generated data behaves exactly like a real-world smart meter dataset.

### 📈 Predictive Forecasting
- **Extrapolation**: Analyzes current average daily consumption to project future usage.
- **Projections**: Displays immediate weekly, monthly (30-day), and yearly (365-day) consumption and cost forecasts directly on the dashboard.

### 📝 Data Management & Interaction
- **Add Reading Form**: Manually input power (kW) for specific areas at any given date/time. The dashboard instantly updates to reflect manual entries.
- **Data Explorer**: A full interactive data grid to search, sort, filter by area, paginate through historical records, and delete specific readings.
- **CSV Export**: Download all historical and live energy data directly into an Excel-ready CSV format.

### ⚙️ Live Settings & Persistence
- **Configurable Rules**: Change the cost tariff (₹/kWh), peak load thresholds, efficiency targets, and simulation refresh rates dynamically.
- **Local Persistence**: All data, manual readings, and settings are saved securely to your browser's `localStorage`. Data persists across browser sessions without needing an external database.
- **Factory Reset**: Ability to completely wipe the local database and restart the simulation from scratch.

### 💡 Automated Intelligence
- **Alerts Panel**: Dynamically scans data to generate alerts (e.g., detecting if HVAC is consuming above expected average share).
- **Recommendations Engine**: Suggests actionable, data-driven ways to save money, calculating estimated ₹ savings based on your specific custom tariff.

## Tech Stack

- **Frontend**: React + Vite
- **UI & Design**: Custom Google/Material-style CSS (Clean, light mode, responsive)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Storage**: Browser LocalStorage (Persistence layer)

## Local Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application runs fully functional locally using the built-in real-time energy simulation engine. No AWS configuration or external database is required to use all features.

## Project Structure

```
├── src/
│   ├── components/     # React UI components (Sidebar, Topbar, Charts, Forms)
│   ├── data/           # Real-time data simulation engine (demoData.js)
│   ├── hooks/          # React hooks (useEnergyData.js)
│   ├── services/       # External API integrations
│   ├── utils/          # Core calculation logic and analytics algorithms
│   ├── config.js       # Base application configuration
│   ├── App.jsx         # Main application routing and layout
│   ├── main.jsx        # React entry point
│   └── index.css       # Full design system (Google/SaaS style)
```

## AWS Integration (Optional)

While the application operates standalone via `localStorage`, the repository includes backend infrastructure configurations for AWS deployment if required:
- `backend/lambda/index.js` (Serverless CRUD handler)
- `backend/dynamodb/table-definition.json` (Database schema)

To connect the frontend to a deployed AWS API Gateway, create a `.env` file in the root directory:
```
VITE_API_URL=https://your-api-id.execute-api.region.amazonaws.com
```

## Author

Cloud Strategy — FT1 Vibe Coding Activity
