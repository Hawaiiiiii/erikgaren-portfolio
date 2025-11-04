# Deployment Guide

This guide covers deployment options for the ErikGaren 3D Portfolio.

## Build for Production

```bash
# Install dependencies
pnpm install

# Create optimized production build
pnpm run build
```

This creates a `dist/` folder with optimized static files ready for deployment.

## Deployment Platforms

### Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
cd erikgaren-portfolio
vercel
```

3. **Configure Project** (if prompted):
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

4. **Production Deploy**:
```bash
vercel --prod
```

### Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Deploy**:
```bash
cd erikgaren-portfolio
netlify deploy
```

3. **Follow prompts**:
   - Build command: `pnpm run build`
   - Publish directory: `dist`

4. **Production deploy**:
```bash
netlify deploy --prod
```

### GitHub Pages

1. **Install gh-pages**:
```bash
pnpm add -D gh-pages
```

2. **Update `vite.config.ts`**:
```ts
export default defineConfig({
  base: '/erikgaren-portfolio/',  // Replace with your repo name
  // ... rest of config
})
```

3. **Add deploy scripts to `package.json`**:
```json
{
  "scripts": {
    "predeploy": "pnpm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. **Deploy**:
```bash
pnpm run deploy
```

### Docker

1. **Create Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Create `nginx.conf`**:
```nginx
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
      try_files $uri $uri/ /index.html;
    }

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
  }
}
```

3. **Build and Run**:
```bash
docker build -t erikgaren-portfolio .
docker run -p 8080:80 erikgaren-portfolio
```

### AWS S3 + CloudFront

1. **Build the project**:
```bash
pnpm run build
```

2. **Install AWS CLI** and configure credentials

3. **Create S3 bucket**:
```bash
aws s3 mb s3://erikgaren-portfolio
```

4. **Enable static website hosting**:
```bash
aws s3 website s3://erikgaren-portfolio --index-document index.html --error-document index.html
```

5. **Upload files**:
```bash
aws s3 sync dist/ s3://erikgaren-portfolio --acl public-read
```

6. **Create CloudFront distribution** (optional, for CDN):
   - Use AWS Console to create a CloudFront distribution
   - Point it to your S3 bucket
   - Configure custom domain if needed

### Railway

1. **Create `railway.json`**:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm run build"
  },
  "deploy": {
    "startCommand": "pnpm run preview",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Deploy**:
   - Push code to GitHub
   - Connect Railway to your repository
   - Railway will auto-deploy

### Custom Server (Node.js)

1. **Create server file `server.js`**:
```javascript
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from dist
app.use(express.static(join(__dirname, 'dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

2. **Update `package.json`**:
```json
{
  "type": "module",
  "scripts": {
    "serve": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

3. **Run**:
```bash
pnpm install
pnpm run build
pnpm run serve
```

## Environment Variables

If you need environment variables:

1. **Create `.env`**:
```env
VITE_API_URL=https://api.example.com
VITE_GA_ID=G-XXXXXXXXXX
```

2. **Access in code**:
```ts
const apiUrl = import.meta.env.VITE_API_URL;
```

3. **Configure on platform**:
   - **Vercel**: Add in Project Settings → Environment Variables
   - **Netlify**: Site Settings → Build & Deploy → Environment
   - **Railway**: Variables tab in project dashboard

## Performance Optimization

### Compression

Enable gzip/brotli compression on your server:

**Nginx**:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

**Express**:
```javascript
import compression from 'compression';
app.use(compression());
```

### Caching

Set cache headers for static assets:

**Nginx**:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

**Netlify** (`netlify.toml`):
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### CDN

Use a CDN for better global performance:
- Vercel (built-in CDN)
- Netlify (built-in CDN)
- Cloudflare
- AWS CloudFront

## Custom Domain

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify

1. Site Settings → Domain Management
2. Add custom domain
3. Configure DNS (Netlify provides DNS hosting)

### GitHub Pages

1. Add `CNAME` file to `public/` folder:
```
erikgaren.dev
```

2. Configure DNS:
```
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
CNAME www   username.github.io
```

## SSL/HTTPS

Most modern platforms provide automatic SSL:
- Vercel: Automatic
- Netlify: Automatic
- GitHub Pages: Automatic (for custom domains)
- Railway: Automatic

For custom servers, use Let's Encrypt with Certbot.

## Monitoring

### Performance Monitoring

1. **Google Lighthouse**: Built into Chrome DevTools
2. **WebPageTest**: https://www.webpagetest.org
3. **GTmetrix**: https://gtmetrix.com

### Error Tracking

Consider integrating:
- Sentry
- LogRocket
- Bugsnag

### Analytics

- Google Analytics
- Plausible
- Fathom Analytics

## Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] All 3D objects render properly
- [ ] Click interactions work
- [ ] Modals open/close correctly
- [ ] Navigation functions
- [ ] Mobile responsive design works
- [ ] Performance is acceptable (Lighthouse score > 80)
- [ ] SSL certificate is valid
- [ ] Custom domain configured (if applicable)
- [ ] Analytics integrated (if applicable)
- [ ] Error tracking configured (if applicable)

## Troubleshooting

### Build Fails

1. Check Node.js version (18+)
2. Clear cache: `rm -rf node_modules .vite dist`
3. Reinstall: `pnpm install`
4. Try build again: `pnpm run build`

### 404 Errors on Refresh

Configure your server for SPA routing:

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Netlify** (`public/_redirects`):
```
/*    /index.html   200
```

**Apache** (`.htaccess`):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### WebGL Not Working

Ensure your hosting platform supports WebGL (most do). Check browser console for errors.

### Large Bundle Size Warning

This is expected with Three.js. To optimize:
1. Enable code splitting
2. Use dynamic imports for heavy components
3. Compress assets
4. Use Draco compression for 3D models

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build
        run: pnpm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```