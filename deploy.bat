@echo off
echo 🚀 Deploying SEO Product Analyzer...

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Deploy to Vercel
echo 🌍 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo.
echo 📋 Next steps:
echo 1. Configure environment variables in Vercel dashboard
echo 2. Update n8n workflow with your production URL  
echo 3. Test the integration end-to-end
echo.
echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions
pause