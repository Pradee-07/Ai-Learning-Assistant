# AI Learning Assistant - Production Deployment Guide

## Overview
This guide covers deploying both the backend and frontend of the AI Learning Assistant to production.

---

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or self-hosted MongoDB)
- Google Gemini API key
- A domain name
- SSL certificate (recommended)
- Hosting platform (Heroku, Railway, Render, Vercel, Netlify, etc.)

---

## Backend Deployment

### 1. Environment Setup

#### Create `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=8000
NODE_ENV=production

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?appName=AILearning

# JWT Configuration (generate strong secret)
JWT_SECRET=<generate-a-strong-random-string-min-32-chars>
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=10485760

# Google Gemini API
GEMINI_API_KEY=<your-api-key>

# CORS - Add your frontend domain(s)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2. Database Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with strong password
4. Add your server IP to whitelist (or 0.0.0.0 for all)
5. Get connection string and update `MONGODB_URI`

### 3. API Keys

- **Google Gemini API**: Get from [Google AI Studio](https://aistudio.google.com/apikey)
- Add to `GEMINI_API_KEY` in `.env`

### 4. Deploy Backend

**Option A: Heroku**
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set \
  MONGODB_URI="your-mongodb-uri" \
  JWT_SECRET="your-jwt-secret" \
  GEMINI_API_KEY="your-api-key" \
  NODE_ENV="production" \
  ALLOWED_ORIGINS="https://yourdomain.com"

# Deploy
git push heroku main
```

**Option B: Railway / Render**
1. Connect your GitHub repository
2. Create new service
3. Select Node.js
4. Add environment variables
5. Deploy

**Option C: Self-hosted (Ubuntu/Linux)**
```bash
# Install PM2 for process management
npm install -g pm2

# Start server with PM2
pm2 start server.js --name "ai-learning-backend"

# Save PM2 config
pm2 save

# Setup PM2 auto-restart on reboot
pm2 startup
```

### 5. Configure CORS

Update `ALLOWED_ORIGINS` in `.env` to your frontend domain:
```
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## Frontend Deployment

### 1. Environment Setup

Create `.env.production` in frontend directory:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=AI Learning Assistant
VITE_MAX_FILE_SIZE=10485760
```

Update `VITE_API_BASE_URL` to match your backend URL.

### 2. Build Production Bundle

```bash
cd frontend/Ai-learning-assistant

# Install dependencies
npm install

# Build for production
npm run build

# Test the build locally
npm run preview
```

### 3. Deploy Frontend

**Option A: Vercel (Recommended for Vite)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Option B: Netlify**
1. Go to [Netlify](https://www.netlify.com)
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify UI
6. Deploy

**Option C: AWS S3 + CloudFront**
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**Option D: Self-hosted (Nginx)**
```bash
# Build
npm run build

# Copy dist folder to server
scp -r dist/ user@server:/var/www/yourdomain/

# Configure Nginx
# Create /etc/nginx/sites-available/yourdomain config
```

**Nginx Config Example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    root /var/www/yourdomain;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass https://api.yourdomain.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Post-Deployment Configuration

### 1. Enable HTTPS
- Use Let's Encrypt (free SSL certificates)
- Or purchase from a trusted provider

### 2. Setup Domain DNS
Point your domain to your hosting provider

### 3. Environment Variables Checklist

**Backend (.env)**
- [ ] `MONGODB_URI` (production database)
- [ ] `JWT_SECRET` (strong, random string)
- [ ] `GEMINI_API_KEY` (Google Gemini API)
- [ ] `NODE_ENV=production`
- [ ] `ALLOWED_ORIGINS` (your frontend domain)
- [ ] `PORT` (usually 8000 or 3000)

**Frontend (.env.production)**
- [ ] `VITE_API_BASE_URL` (backend URL)
- [ ] `VITE_APP_NAME` (app name)
- [ ] `VITE_MAX_FILE_SIZE` (max upload size)

### 4. Database Backups

Setup automatic backups in MongoDB Atlas:
1. Go to Cluster Settings
2. Enable automatic backups
3. Set backup frequency

### 5. Monitoring & Logging

- Setup error tracking (e.g., Sentry, LogRocket)
- Monitor API performance
- Setup alerts for critical errors

---

## Security Checklist

- [ ] JWT_SECRET is strong and random (min 32 characters)
- [ ] Database credentials are never committed to git
- [ ] CORS is restricted to your domain(s)
- [ ] HTTPS is enabled
- [ ] Environment variables are properly set in production
- [ ] .env files are in .gitignore
- [ ] File upload size limits are enforced
- [ ] Rate limiting is configured (optional but recommended)
- [ ] CSRF protection is enabled
- [ ] SQL Injection prevention (using Mongoose ORM)

---

## Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**
- Check MONGODB_URI format
- Ensure IP is whitelisted in MongoDB Atlas
- Verify credentials

**"CORS error"**
- Add frontend URL to `ALLOWED_ORIGINS`
- Restart backend server

**"API Key error"**
- Verify GEMINI_API_KEY is correct
- Check API key is active in Google Cloud Console

### Frontend Issues

**"Cannot reach backend API"**
- Check `VITE_API_BASE_URL` matches backend URL
- Verify backend is running
- Check browser console for CORS errors

**"Build fails"**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (should be 18+)

---

## Scaling Considerations

### For High Traffic:
1. **Database**: Use MongoDB Atlas scaling options
2. **Backend**: Use load balancers (AWS ELB, Nginx)
3. **Frontend**: Use CDN (Cloudflare, CloudFront)
4. **Caching**: Implement Redis for session/data caching
5. **File Storage**: Use S3 for document uploads

### Performance Optimization:
1. Enable gzip compression
2. Minify and bundle code
3. Optimize images and assets
4. Implement lazy loading
5. Use CDN for static assets

---

## Continuous Deployment (CI/CD)

### GitHub Actions Example

**.github/workflows/deploy.yml**
```yaml
name: Deploy

on:
  push:
    branches: [main, production]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          git push heroku main
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
      
      - name: Deploy Frontend
        run: |
          npm run build
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## Support & Maintenance

- Monitor uptime and performance
- Keep dependencies updated
- Regular security audits
- Plan for database scaling
- Implement rate limiting
- Setup automated backups
- Document all configuration changes

---

## Contact & Resources

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Google Gemini API: https://aistudio.google.com
- Heroku: https://www.heroku.com
- Vercel: https://vercel.com
- Netlify: https://www.netlify.com
