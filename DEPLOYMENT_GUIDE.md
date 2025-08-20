# Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from this directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Project name: `seo-product-analyzer`
   - Link to existing project: `N`
   - In which directory: `./` (current directory)
   - Want to override settings: `N`

### Option 2: Deploy via GitHub + Vercel (Web Interface)

1. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com/new)
   - Repository name: `seo-product-analyzer`
   - Description: `AI-powered SEO Product Analyzer with Next.js and n8n workflow integration`
   - Make it Public
   - Click "Create repository"

2. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/seo-product-analyzer.git
   git branch -M main
   git push -u origin main
   ```

3. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

## ⚙️ Environment Variables Setup

After deploying, configure these environment variables in Vercel:

### Required Variables:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add these variables**:

   ```env
   N8N_WEBHOOK_URL=https://your-n8n-domain.com/webhook/cb04381c-f75c-403e-8dee-0ccc087fd732
   ```

   ```env
   NEXT_PUBLIC_BACKEND_URL=https://your-project.vercel.app
   ```

   ```env
   GOOGLE_SEARCH_API_KEY=your_google_api_key_here
   ```

   ```env
   GOOGLE_SEARCH_CX=your_google_cx_here
   ```

3. **Redeploy** after adding environment variables

## 🔧 n8n Configuration for Production

After deployment, update your n8n workflow:

1. **Update the "Send to Backend" node URL**:
   ```
   https://your-project.vercel.app/api/seo-results
   ```

2. **Test the integration**:
   ```bash
   curl -X POST https://your-n8n-domain.com/webhook/cb04381c-f75c-403e-8dee-0ccc087fd732 \
     -H "Content-Type: application/json" \
     -d '{"title": "Test Product", "requestId": "test-123"}'
   ```

## 📋 Deployment Checklist

### Pre-deployment:
- [ ] Git repository initialized and committed
- [ ] All dependencies installed (`npm install`)
- [ ] Build successful (`npm run build`)
- [ ] Environment variables template created (`.env.example`)

### Vercel Setup:
- [ ] Vercel account created
- [ ] Project deployed to Vercel
- [ ] Environment variables configured
- [ ] Custom domain configured (optional)

### n8n Integration:
- [ ] n8n workflow imported and configured
- [ ] API credentials set up (Google Search, Gemini)
- [ ] Webhook URLs updated to production
- [ ] End-to-end test completed

### Post-deployment:
- [ ] Application accessible at production URL
- [ ] Test mode working correctly
- [ ] n8n integration functioning
- [ ] Error handling tested
- [ ] Performance verified

## 🌍 Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to Project → Settings → Domains
   - Add your custom domain
   - Configure DNS settings as instructed

2. **Update Environment Variables**:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://your-custom-domain.com
   ```

3. **Update n8n webhook URL** to use your custom domain

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check TypeScript errors: `npm run build`
   - Verify all dependencies: `npm install`

2. **Environment Variables**:
   - Ensure no spaces around `=` in env vars
   - Redeploy after adding env vars

3. **n8n Integration Issues**:
   - Verify webhook URLs are correct
   - Check CORS settings if needed
   - Monitor n8n execution logs

4. **API Timeouts**:
   - Vercel functions timeout at 10s (hobby) / 60s (pro)
   - Consider upgrading Vercel plan for longer workflows

## 📊 Monitoring

- **Vercel Analytics**: Enable in project settings
- **Function Logs**: Monitor in Vercel dashboard
- **n8n Logs**: Check workflow execution logs
- **Error Tracking**: Consider adding Sentry or similar

## 🎯 Production Optimization

1. **Performance**:
   - Enable Vercel Analytics
   - Use Vercel Edge Functions for faster response times
   - Implement caching for repeated requests

2. **Security**:
   - Add rate limiting to API endpoints
   - Validate webhook signatures from n8n
   - Use environment variables for all secrets

3. **Monitoring**:
   - Set up error tracking (Sentry)
   - Monitor API response times
   - Set up uptime monitoring

## 📈 Scaling Considerations

- **Vercel Limits**: Be aware of function execution limits
- **n8n Performance**: Consider n8n cloud for better reliability
- **Database**: Add Redis for request caching if needed
- **CDN**: Vercel includes global CDN automatically