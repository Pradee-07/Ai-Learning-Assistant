# Production Deployment Checklist

## Pre-Deployment

### Backend
- [ ] Review all environment variables in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `JWT_SECRET` (at least 32 characters)
- [ ] Verify `MONGODB_URI` points to production database
- [ ] Add valid `GEMINI_API_KEY`
- [ ] Set `ALLOWED_ORIGINS` to frontend domain(s)
- [ ] Test all API endpoints locally
- [ ] Run security audit: `npm audit`
- [ ] Check for console.log statements to remove
- [ ] Ensure error handling doesn't expose sensitive data
- [ ] Test file upload limits
- [ ] Verify database indexes are created

### Frontend
- [ ] Update `VITE_API_BASE_URL` in `.env.production`
- [ ] Review API endpoints for hardcoded localhost
- [ ] Test build output: `npm run build`
- [ ] Verify bundle size is reasonable
- [ ] Test locally with production build: `npm run preview`
- [ ] Check for console errors/warnings
- [ ] Verify all environment variables are used
- [ ] Test all critical user flows
- [ ] Check responsive design on mobile
- [ ] Verify error boundaries are in place

## Deployment

### Backend Deployment
- [ ] Choose hosting platform (Heroku, Railway, Render, etc.)
- [ ] Create application/dyno
- [ ] Set environment variables in hosting platform
- [ ] Deploy code
- [ ] Verify deployment logs for errors
- [ ] Test API endpoints in production
- [ ] Setup process monitoring (PM2, supervisor)
- [ ] Configure auto-restart on crashes
- [ ] Setup log aggregation

### Frontend Deployment
- [ ] Build production bundle
- [ ] Choose CDN/hosting (Vercel, Netlify, AWS S3, etc.)
- [ ] Deploy to production
- [ ] Verify all routes work
- [ ] Test API connectivity
- [ ] Check CSS/styling loads correctly
- [ ] Verify images load properly
- [ ] Test file uploads
- [ ] Setup auto-deployments (CI/CD)

## Post-Deployment

### Monitoring
- [ ] Setup error tracking (Sentry, Rollbar)
- [ ] Enable database monitoring
- [ ] Setup uptime monitoring
- [ ] Configure alerts for critical errors
- [ ] Monitor API response times
- [ ] Track user metrics

### Security
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall rules
- [ ] Configure DDoS protection
- [ ] Enable CORS properly
- [ ] Setup rate limiting
- [ ] Regular security audits
- [ ] Review access logs
- [ ] Setup automated backups

### Performance
- [ ] Setup CDN for static assets
- [ ] Enable gzip compression
- [ ] Optimize database queries
- [ ] Monitor database size
- [ ] Setup caching strategy
- [ ] Test page load times

### Maintenance
- [ ] Document all deployment steps
- [ ] Setup backup procedures
- [ ] Plan scaling strategy
- [ ] Schedule security updates
- [ ] Monitor dependencies for updates
- [ ] Plan disaster recovery

## Verification Steps

1. **Test User Registration**
   - [ ] Can create new account
   - [ ] Email validation works
   - [ ] Password requirements enforced

2. **Test Authentication**
   - [ ] Can login
   - [ ] JWT token works
   - [ ] Token expires correctly
   - [ ] Refresh token works

3. **Test Core Features**
   - [ ] Can upload documents
   - [ ] Can generate flashcards
   - [ ] Can generate quizzes
   - [ ] Can use AI chat feature
   - [ ] File downloads work

4. **Test Error Handling**
   - [ ] 404 errors display properly
   - [ ] 500 errors don't expose stack traces
   - [ ] Timeout errors are handled
   - [ ] Network errors show user-friendly messages

5. **Performance Testing**
   - [ ] Page loads in < 3 seconds
   - [ ] API responses in < 1 second
   - [ ] Database queries are optimized
   - [ ] No memory leaks

## Rollback Plan

If deployment fails:
1. [ ] Rollback to previous version
2. [ ] Verify services are back online
3. [ ] Notify users if needed
4. [ ] Debug issues
5. [ ] Prepare hot fix
6. [ ] Redeploy with fixes

## Documentation

- [ ] Update deployment guide
- [ ] Document environment variables
- [ ] Create runbook for common issues
- [ ] Document scaling procedures
- [ ] Create disaster recovery plan

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Status**: ☐ Successful  ☐ Failed  ☐ Partial

**Notes**: 

