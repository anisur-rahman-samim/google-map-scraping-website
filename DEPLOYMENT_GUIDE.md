# Places Explorer Frontend - Setup & Deployment Guide

## Quick Setup (Local Development)

### Prerequisites
- Node.js >= 14
- npm or yarn
- Backend running on http://localhost:3000

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_GOOGLE_SHEETS_ID=  # Optional
REACT_APP_GOOGLE_API_KEY=    # Optional
```

### Step 3: Start Development Server
```bash
npm start
```

Open http://localhost:3000 in your browser.

---

## Production Build

### Build
```bash
npm run build
```

Creates optimized production build in `build/` folder.

### Run Production Build Locally
```bash
npm install -g serve
serve -s build -l 3000
```

---

## Deployment Options

### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Follow prompts:
1. Connect GitHub
2. Set environment variables
3. Deploy

Your app will be live immediately at `https://your-project.vercel.app`

### Option 2: Netlify

#### Via CLI
```bash
npm install -g netlify-cli
netlify deploy
```

#### Via Web UI
1. Go to https://netlify.com
2. Connect GitHub
3. Select repo
4. Set environment variables
5. Deploy

### Option 3: AWS S3 + CloudFront

```bash
# Build
npm run build

# Deploy to S3
aws s3 sync build/ s3://your-bucket-name

# CloudFront handles caching and HTTPS
```

### Option 4: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV REACT_APP_API_URL=http://localhost:3000

RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=0 /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

Build and run:
```bash
docker build -t places-explorer .
docker run -p 3000:3000 places-explorer
```

### Option 5: Traditional VPS (Ubuntu)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <your-repo>
cd frontend
npm install
npm run build

# Install PM2
sudo npm install -g pm2

# Start with PM2
pm2 start "npm run build && serve -s build -l 3000" --name "places-explorer"
pm2 save
pm2 startup
```

Configure Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable SSL with Certbot:
```bash
sudo certbot certonly --nginx -d yourdomain.com
```

---

## Environment Configuration

### Development
```env
REACT_APP_API_URL=http://localhost:3000
```

### Production
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_GOOGLE_SHEETS_ID=your_sheets_id
REACT_APP_GOOGLE_API_KEY=your_api_key
```

---

## Google Sheets Integration

### Setup (Optional)

1. Create Google Sheets:
   - Go to https://sheets.google.com
   - Create new sheet
   - Share with your app's service account

2. Get Spreadsheet ID:
   - Open sheet
   - URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/...`
   - Copy `SHEET_ID`

3. Get API Key:
   - Go to https://console.cloud.google.com
   - Create project
   - Enable Sheets API
   - Create API key
   - Restrict to Sheets API

4. Add to `.env`:
   ```env
   REACT_APP_GOOGLE_SHEETS_ID=your_sheet_id
   REACT_APP_GOOGLE_API_KEY=your_api_key
   ```

Without this setup, exports default to CSV downloads.

---

## Performance Optimization

### Build Size
```bash
npm run build
# Current: ~150KB gzipped

# Check bundle size
npx webpack-bundle-analyzer
```

### Caching
- Service Worker (add in production)
- Static file caching (handled by CDN/hosting)
- API response caching (backend)

### Code Splitting
- Lazy load components if needed
- Tree shake unused code

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### API Connection Error
```
Check:
1. Backend running: npm run dev (in backend folder)
2. REACT_APP_API_URL in .env
3. CORS enabled on backend
4. Same machine/network
```

### Build Fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Try again
npm run build
```

### Module Not Found
```bash
# Reinstall dependencies
npm ci

# Clear cache
npm cache clean --force
```

---

## Development Workflow

### Local Development
```bash
# Terminal 1: Backend
cd ../
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

### Making Changes
1. Edit files in `src/`
2. Hot reload happens automatically
3. Check console for errors

### Testing Changes
```bash
# Before build
npm run build
npm run test
```

---

## Continuous Deployment

### GitHub Actions Example
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Monitoring & Logging

### Development
- Browser DevTools (F12)
- Console errors/warnings
- Network tab for API calls

### Production
- Sentry for error tracking
- Vercel Analytics
- Error boundaries in React

---

## Security Checklist

- [ ] API URL configured correctly
- [ ] No sensitive data in code
- [ ] Environment variables set
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] API keys protected
- [ ] Content Security Policy headers
- [ ] No console.log for sensitive data

---

## Scaling

For high traffic:
1. Use CDN (Cloudflare, CloudFront)
2. Enable gzip compression
3. Implement service worker for offline support
4. Use lazy loading for images
5. Optimize bundle size
6. Scale backend infrastructure

---

## Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Check security: `npm audit`
- Monitor errors: Check Sentry/hosting logs
- Test functionality: Use Postman for API

### Dependency Updates
```bash
# Check outdated packages
npm outdated

# Update all
npm update

# Update specific
npm install package@latest
```

---

## Support & Documentation

- [React Docs](https://react.dev)
- [Create React App Docs](https://create-react-app.dev)
- [Deployment Guides](https://create-react-app.dev/docs/deployment/)
- Backend [README](../README.md)
- [API Reference](../README.md#api-endpoints)

---

## Quick Reference

```bash
# Development
npm start              # Start dev server
npm run build         # Production build
npm test              # Run tests

# Deployment
npm run build && npm start  # Test production build
vercel                # Deploy to Vercel
netlify deploy        # Deploy to Netlify

# Debugging
npm install           # Install dependencies
npm cache clean       # Clear npm cache
rm -rf node_modules   # Remove dependencies
```

---

**Ready to deploy! 🚀**

Choose your hosting platform and follow the instructions above.
