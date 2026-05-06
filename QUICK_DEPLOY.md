# Quick Start: Production Deployment

This guide provides a quick-start path to deploy your project to production.

## 5-Minute Setup Summary

### Step 1: Prepare Credentials (5 min)
1. Get MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
3. Generate JWT Secret: 
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. Decide your domain name

### Step 2: Update Environment Files (2 min)

**Backend - `backend/.env`**
```env
PORT=8000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname?appName=AILearning
JWT_SECRET=<generated-secret>
JWT_EXPIRE=7d
GEMINI_API_KEY=<your-api-key>
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Frontend - `frontend/Ai-learning-assistant/.env.production`**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=AI Learning Assistant
VITE_MAX_FILE_SIZE=10485760
```

### Step 3: Build & Test Locally (5 min)

```bash
# Backend test
cd backend
npm install
npm run prod

# Frontend build
cd ../frontend/Ai-learning-assistant
npm install
npm run build:prod
npm run preview
```

### Step 4: Choose & Deploy

**Option A: Easiest (Heroku)**
```bash
# Backend
heroku create your-app-name
heroku config:set NODE_ENV=production MONGODB_URI=... JWT_SECRET=... GEMINI_API_KEY=... ALLOWED_ORIGINS=...
git push heroku main

# Frontend (Vercel)
vercel --prod
```

**Option B: Free & Easy (Railway.app)**
1. Push to GitHub
2. Connect repository in Railway
3. Set environment variables
4. Deploy

**Option C: Most Control (AWS)**
- EC2 for backend
- S3 + CloudFront for frontend

---

## Quick Verification Checklist

After deployment, verify:
- [ ] Backend API responds: `curl https://api.yourdomain.com/api/auth/profile`
- [ ] Frontend loads: Visit https://yourdomain.com
- [ ] Can register new user
- [ ] Can login
- [ ] Can upload document
- [ ] Can generate flashcards
- [ ] Can generate quiz
- [ ] API responds in < 1 second

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect to MongoDB" | Check connection string, whitelist IP in Atlas |
| "CORS error" | Ensure domain added to ALLOWED_ORIGINS |
| "API returns 401" | Verify JWT_SECRET matches between frontend and backend |
| "File upload fails" | Check file size limits and server permissions |
| "Slow response times" | Check MongoDB performance, add indexes |

---

## After Deployment

1. **Monitor**: Setup error tracking (Sentry)
2. **Backup**: Enable MongoDB automatic backups
3. **Scale**: Add CDN and load balancer as needed
4. **Security**: Regular security audits and updates

---

## Detailed Guides

- **Full Setup**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Checklist**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Changes**: See [PRODUCTION_CHANGES.md](./PRODUCTION_CHANGES.md)

---

## Support

- MongoDB Issues: [MongoDB Docs](https://docs.mongodb.com)
- Gemini API Help: [Google AI Documentation](https://ai.google.dev)
- Deployment Issues: Check platform-specific docs

