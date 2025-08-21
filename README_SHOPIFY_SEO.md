# Shopify SEO Feature

## 🚀 Overview
Complete Shopify SEO content generator with n8n workflow integration. Generates optimized titles, meta descriptions, product descriptions, keywords, and Shopify-specific tags.

## 📁 Files Created
```
/pages/shopify-seo.tsx              # Frontend page
/pages/api/shopify-seo.ts           # Main API endpoint  
/pages/api/shopify-seo-results.ts   # Webhook results handler
/pages/api/test-shopify-seo.ts      # Mock data for testing
/pages/api/test-shopify-bot.ts      # Automated testing bot
/n8n/shopify-seo-workflow.json     # n8n workflow configuration
```

## 🎯 Features
- ✅ **Clean TailwindCSS UI** with form validation
- ✅ **Real-time character counters** (SEO title: 70, meta: 160)  
- ✅ **Copy-to-clipboard** functionality for all fields
- ✅ **Responsive design** for mobile/desktop
- ✅ **Loading states** with spinner and progress text
- ✅ **Error handling** with detailed validation
- ✅ **Test mode** toggle for immediate testing
- ✅ **Automated bot testing** with validation
- ✅ **TypeScript interfaces** for type safety
- ✅ **n8n workflow integration** via webhooks

## 🔧 API Endpoints

### `POST /api/shopify-seo`
Main endpoint that triggers n8n workflow.

**Request:**
```json
{
  "product_name": "string (required)",
  "shopify_store_type": "dropshipping|private_label|wholesale|handmade",
  "target_price_range": "under_25|25_50|50_100|100_plus", 
  "additional_context": "string (optional)",
  "requestId": "string (required)"
}
```

**Response:**
```json
{
  "status": "success|error",
  "data": {
    "seo_title": "string",
    "meta_description": "string", 
    "product_description": "string",
    "keywords": ["array"],
    "shopify_tags": ["array"],
    "character_counts": {
      "title_length": number,
      "meta_description_length": number
    }
  },
  "timestamp": "ISO string",
  "original_request": {...}
}
```

### `POST /api/test-shopify-seo`
Test endpoint with mock data for UI validation.

### `POST /api/test-shopify-bot`
Automated testing endpoint that validates API functionality.

### `POST /api/shopify-seo-results`
Webhook handler that receives results from n8n workflow.

## 🧪 Testing

### Manual Testing
1. Visit `http://localhost:3003/shopify-seo`
2. Enable "Test mode" for immediate mock results
3. Fill form and click "Generate Shopify SEO Content"

### Bot Testing  
1. Click "🤖 Bot Test" button on the page
2. Check validation results in the bot panel
3. Or call directly: `POST /api/test-shopify-bot`

### n8n Integration Testing
1. Ensure n8n workflow is deployed at: `https://dnzsrslk.app.n8n.cloud/webhook/shopify-seo`
2. Disable test mode
3. Submit form and check n8n workflow execution

## 🚀 Deployment

### Environment Variables
```bash
# Production deployment
N8N_SHOPIFY_WEBHOOK_URL=https://dnzsrslk.app.n8n.cloud/webhook/shopify-seo
NEXT_PUBLIC_BACKEND_URL=https://seo-product-analyzer.vercel.app
```

### Vercel Deployment
```bash
npm run build
vercel --prod
```

### n8n Workflow Setup
1. Import `n8n/shopify-seo-workflow.json` into n8n
2. Configure webhook path: `/webhook/shopify-seo` 
3. Set backend URL in "Send Response" node
4. Activate workflow

## 🔍 Debug Information

### Validation Checks
- ✅ SEO title exists and ≤70 characters
- ✅ Meta description exists and ≤160 characters  
- ✅ Product description exists
- ✅ Keywords array has items
- ✅ Shopify tags array has items
- ✅ Character counts are accurate

### Console Logs
All endpoints include detailed console logging for debugging:
- Request validation
- n8n webhook calls
- Response processing
- Error handling

## 🎨 UI Features

### Form Inputs
- **Product Name**: Required text input
- **Store Type**: Dropdown (dropshipping, private_label, wholesale, handmade)
- **Price Range**: Dropdown (under_25, 25_50, 50_100, 100_plus)
- **Additional Context**: Optional textarea

### Result Display
- **SEO Title**: With character counter (70 max)
- **Meta Description**: With character counter (160 max)  
- **Product Description**: Formatted text area
- **Keywords**: Tag-style display
- **Shopify Tags**: Tag-style display
- **Copy buttons**: Individual field and "Copy All" options

### Status Indicators  
- Loading spinner during processing
- Success/error status badges
- Real-time character counters
- Bot test validation results

## 🔗 Integration Flow

1. **Frontend** → Submit form with product data
2. **API** → Validate input and call n8n webhook
3. **n8n** → Process with AI and format response
4. **Webhook** → Send results back to `/api/shopify-seo-results`
5. **Frontend** → Display formatted results with copy functionality

Ready for production deployment! 🚀