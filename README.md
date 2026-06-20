# Places Explorer - Frontend

Modern, beautiful React frontend for searching and exporting business data from Google Maps.

## Features

✨ **Beautiful UI** - Modern, responsive design with smooth animations
🔍 **Smart Search** - Natural language search with location-based filtering
📊 **Advanced Results** - Expandable cards with complete business information
📥 **One-Click Export** - Export all results to CSV/Google Sheets
⚡ **Fast & Efficient** - Real-time search with automatic caching
📱 **Responsive** - Works perfectly on desktop, tablet, and mobile

---

## Quick Start (5 Minutes)

### Prerequisites
- Node.js >= 14
- npm or yarn
- Running backend API on http://localhost:3000

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Start development server
npm start
```

Server runs on http://localhost:3000

---

## Environment Variables

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:3000

# Google Sheets Integration (Optional)
REACT_APP_GOOGLE_SHEETS_ID=your_sheet_id_here
REACT_APP_GOOGLE_API_KEY=your_google_api_key_here
```

---

## Usage

### Basic Search
1. Enter a search query (e.g., "restaurants in Seattle")
2. Press Enter or click "Search"
3. Results appear below
4. Click "Export to Google Sheets" to download data

### Location-Based Search
1. Check "Search by Location"
2. Enter latitude/longitude or click "Current Location"
3. Enter radius in meters (1-50,000)
4. Click "Search"

### Quick Searches
Use quick search buttons for popular categories:
- 🍽️ Restaurants
- ☕ Coffee Shops
- 🏨 Hotels
- 🏥 Hospitals
- 🏦 Banks
- 💪 Gyms

### Export Data

#### Option 1: CSV Download (Default)
- Click "Export to Google Sheets"
- File downloads as `.csv`
- Open in Excel or Google Sheets

#### Option 2: Google Sheets (Requires Setup)
- Set `REACT_APP_GOOGLE_SHEETS_ID` in `.env`
- Click "Export to Google Sheets"
- Data appends to your Google Sheet
- Sheet opens automatically

---

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # App styles
│   ├── components/
│   │   ├── SearchForm.jsx      # Search form component
│   │   ├── SearchForm.css
│   │   ├── ResultsList.jsx     # Results display component
│   │   ├── ResultsList.css
│   │   ├── ExportButton.jsx    # Export button component
│   │   ├── ExportButton.css
│   │   ├── UtilityComponents.jsx  # Loading, Error, Stats
│   │   └── UtilityComponents.css
│   ├── utils/
│   │   └── googleSheetsExporter.js  # Export functionality
│   └── index.js
├── package.json
├── .env.example
└── README.md
```

---

## Components

### SearchForm
- Text input with autocomplete suggestions
- Location-based search with coordinates
- Radius filtering
- Current location detection
- Quick search buttons

### ResultsList
- Grid/list display of results
- Filterable by contact info availability
- Expandable cards for details
- Copy to clipboard functionality
- Google Maps integration

### ExportButton
- One-click CSV export
- Google Sheets integration
- Loading states
- Success/error notifications
- Result count display

---

## Features in Detail

### 🔍 Smart Search
- Natural language query support
- Location-based search
- Radius filtering (1-50,000 meters)
- Real-time search suggestions
- Quick search templates

### 📊 Advanced Results
- Business name, phone, website
- Complete address
- Latitude/Longitude coordinates
- Place ID for API reference
- Google Maps link

### 📥 Export Options
```
CSV Export:
- Automatic download
- Works offline
- Compatible with Excel, Google Sheets

Google Sheets:
- Direct integration
- Real-time sync
- Shareable link
- Auto-formatting
```

### 📱 Responsive Design
- Desktop optimized
- Tablet friendly
- Mobile responsive
- Touch-friendly buttons
- Automatic layout adjustment

---

## Styling

Uses CSS variables for easy customization:

```css
:root {
  --primary: #3b82f6;
  --secondary: #10b981;
  --error: #ef4444;
  /* ... more colors */
}
```

Colors automatically adapt for:
- Light/dark backgrounds
- Status states (loading, success, error)
- Interactive elements

---

## Data Export Format

### CSV Export
```
Business Name,Phone,Website,Address,Latitude,Longitude,Place ID,Search Query,Export Date
Restaurant Name,+1-555-123-4567,https://...,123 Main St,40.7128,-74.0060,ChIJ...,restaurants,1/15/2024
...
```

### Google Sheets
- Headers: Business Name, Phone, Website, Address, Lat, Lng, Place ID, Query, Date
- Auto-formatted columns
- Sortable/filterable
- Shareable with team

---

## API Integration

The frontend communicates with the backend API:

```
POST /api/v1/search
{
  "query": "restaurants",
  "location": {"lat": 40.7128, "lng": -74.0060},
  "radius": 5000
}

Response:
{
  "query": "restaurants",
  "total": 523,
  "pages": 26,
  "results": [
    {
      "name": "...",
      "phone": "...",
      "website": "...",
      "address": "...",
      "lat": 40.7128,
      "lng": -74.0060,
      "place_id": "..."
    }
  ]
}
```

---

## Performance

- **Search Time**: 10-30 seconds (depending on results)
- **Export Time**: < 1 second
- **First Load**: ~3 seconds (includes bundle)
- **Responsive**: All interactions < 200ms

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## Troubleshooting

### API Connection Error
```
Check:
1. Backend running: npm run dev (in backend folder)
2. Port 3000 accessible
3. REACT_APP_API_URL in .env is correct
4. CORS enabled on backend
```

### Export Not Working
```
Check:
1. Google Sheets API key valid
2. Spreadsheet ID correct in .env
3. Google account has permission
4. Fallback CSV export should work
```

### Geolocation Not Working
```
Check:
1. Browser allows location access
2. HTTPS connection (required for production)
3. Grant permission in browser settings
4. Try entering coordinates manually
```

### Slow Search
```
Solutions:
1. Check network speed
2. Reduce search radius
3. Be more specific with query
4. Try location-based search
```

---

## Customization

### Colors
Edit `src/App.css` CSS variables:

```css
:root {
  --primary: #your-color;
  --secondary: #your-color;
  /* ... */
}
```

### Branding
- Change header text in `App.jsx`
- Update logo icon (emoji)
- Modify footer text

### Quick Searches
Edit `SearchForm.jsx`:

```jsx
const quickSearches = [
  { query: 'Your Category', icon: '🎯' },
  // ...
];
```

---

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Follow prompts, set environment variables
```

### Netlify
```bash
npm run build
# Upload 'build' folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual VPS
```bash
npm run build
# Copy 'build' folder to web server
# Configure reverse proxy (nginx)
```

---

## Advanced Usage

### Batch Processing
- Export multiple searches
- Combine into single spreadsheet
- Compare results

### Data Analysis
- Filter by contact availability
- Analyze geographic distribution
- Track competitor data

### Integration
- Copy data to CRM
- Integrate with email tools
- Sync to databases

---

## Security

- ✅ No sensitive data stored
- ✅ Environment variables for API keys
- ✅ CORS-enabled backend
- ✅ No authentication required (optional in production)
- ✅ HTTPS recommended for production

---

## Limitations

- Max 1000 results per search (backend configured)
- Export limited to active results
- Geolocation requires user permission
- Google Sheets API rate limits apply

---

## Future Features

- [ ] Saved searches
- [ ] Favorites list
- [ ] Data comparison
- [ ] Advanced filtering
- [ ] Custom reports
- [ ] API integrations
- [ ] Team collaboration
- [ ] Data history

---

## Support

For issues or questions:
1. Check troubleshooting section
2. Review backend README
3. Check browser console for errors
4. Verify environment variables

---

## License

MIT

---

## Related Documentation

- [Backend README](../README.md) - API backend
- [Deployment Guide](../DEPLOYMENT_GUIDE.md) - Production setup
- [API Reference](../README.md#api-endpoints) - API endpoints
- [Google Sheets API](https://developers.google.com/sheets/api) - Export integration

---

**Ready to explore places! 🚀**

Start searching and exporting business data in seconds.
