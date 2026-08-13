# Testing Plan

## Test Cases

| # | Test Case | Steps | Expected Result | Actual Result | Status |
|---|-----------|-------|-----------------|---------------|--------|
| 1 | Dashboard loads | Open app in browser | All sections render, no blank screen | Dashboard loads with demo data | ✅ |
| 2 | Summary cards | Check 4 summary cards | Show consumption, cost, peak, efficiency with values derived from data | Values computed correctly | ✅ |
| 3 | Trend indicators | Compare with previous period | Show % change arrows (up/down/flat) | Trend indicators display | ✅ |
| 4 | Consumption chart | View hourly bar chart | Bars render, peaks highlighted in red, tooltip on hover | Chart renders correctly | ✅ |
| 5 | Period selector | Click Today/Week/Month | Chart and cards re-render with filtered data | Period filtering works | ✅ |
| 6 | Area breakdown | View donut chart | 5 areas shown with kWh, %, and cost | Donut + legend render | ✅ |
| 7 | Usage table | View breakdown table | 5 rows with power, consumption, cost, status badges | Table renders correctly | ✅ |
| 8 | Status badges | Check badge colors | High=red, Medium=yellow, Normal=green | Badges display correctly | ✅ |
| 9 | Energy alerts | View alerts panel | Dynamic alerts based on consumption patterns | Alerts generated from data | ✅ |
| 10 | Recommendations | View recommendations | Data-driven suggestions with savings amounts | Recommendations generated | ✅ |
| 11 | Cloud status (demo) | Load without VITE_API_URL | Shows "Demo Mode" indicator | Demo mode indicator shows | ✅ |
| 12 | Cloud status (connected) | Set VITE_API_URL to valid API | Shows "Cloud Connected" indicator | Pending AWS deployment | ⏳ |
| 13 | API failure fallback | Set VITE_API_URL to invalid URL | Falls back to demo data silently | Fallback works correctly | ✅ |
| 14 | Refresh button | Click refresh | Data reloads, spinner animates | Refresh works | ✅ |
| 15 | Live clock | Watch header clock | Updates every second | Clock updates | ✅ |
| 16 | Responsive (tablet) | Resize to 768–1024px | 2-column card grid, stacked charts | Layout adapts | ✅ |
| 17 | Responsive (mobile) | Resize to <768px | 1-column layout, hidden datetime | Layout adapts | ✅ |
| 18 | Empty data | Remove all data | Empty state messages shown | Empty states render | ✅ |
| 19 | Production build | Run `npm run build` | Build succeeds with no errors | Build successful | ✅ |
| 20 | No console errors | Check browser console | Zero errors | Clean console | ✅ |
| 21 | .gitignore | Check tracked files | No node_modules, .env, or credentials | Properly excluded | ✅ |
| 22 | Deployment | Upload to S3 | App serves from S3 URL | Pending deployment | ⏳ |

## Summary

- **Passed**: 20/22
- **Pending**: 2 (require AWS deployment)
- **Failed**: 0
