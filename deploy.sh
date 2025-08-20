#!/bin/bash

# SEO Product Analyzer - Deployment Script
echo "🚀 Deploying SEO Product Analyzer..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Deploy to Vercel
echo "🌍 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure environment variables in Vercel dashboard"
echo "2. Update n8n workflow with your production URL"
echo "3. Test the integration end-to-end"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"