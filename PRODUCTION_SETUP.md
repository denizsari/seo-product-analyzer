# 🌐 Production Domain Configuration

## 📋 **Required Production Domain**
**https://seo-product-analyzer.vercel.app/**

All API requests must use this specific domain for proper functionality.

## 🔧 **n8n Webhook Configuration**

### **Critical: Update Your n8n "Send to Backend" Node**

**URL**: `https://seo-product-analyzer.vercel.app/api/seo-results`
**Method**: `POST`
**Body**: `{{ JSON.stringify($json) }}`

### **n8n Workflow Steps:**

1. **Open your n8n workflow**
2. **Click on "Send to Backend" node**
3. **Update the URL** to: `https://seo-product-analyzer.vercel.app/api/seo-results`
4. **Ensure Method is POST**
5. **Save and Activate workflow**

## 🎯 **API Endpoints**

### **Frontend API Calls**
- **Test Mode**: `https://seo-product-analyzer.vercel.app/api/test-seo`
- **Live Mode**: `https://seo-product-analyzer.vercel.app/api/seo`
- **Webhook**: `https://seo-product-analyzer.vercel.app/api/seo-results`

### **n8n Trigger Webhook**
- **URL**: `https://dnzsrslk.app.n8n.cloud/webhook/cb04381c-f75c-403e-8dee-0ccc087fd732`
- **Method**: `POST`
- **Payload**: `{"title": "Product Title", "requestId": "unique-id"}`

## 🔄 **Complete Request Flow**

```
1. Frontend (seo-product-analyzer.vercel.app)
   ↓ POST /api/seo
2. API triggers n8n webhook
   ↓ POST to n8n webhook
3. n8n processes workflow
   ↓ POST to /api/seo-results
4. API resolves promise
   ↓ Returns data to frontend
5. Frontend displays results
```

## 🧪 **Testing Instructions**

### **Test the Production Domain:**

1. **Visit**: https://seo-product-analyzer.vercel.app/
2. **Check Test Mode** for immediate results
3. **Or uncheck Test Mode** for live n8n integration

### **Test n8n Integration:**

1. **Ensure n8n workflow is activated**
2. **Verify "Send to Backend" URL**: `https://seo-product-analyzer.vercel.app/api/seo-results`
3. **Test with a product title**
4. **Check browser console** for request flow logs

## ⚙️ **Environment Variables**

### **For Development:**
```env
N8N_WEBHOOK_URL=https://dnzsrslk.app.n8n.cloud/webhook/cb04381c-f75c-403e-8dee-0ccc087fd732
NEXT_PUBLIC_BACKEND_URL=https://seo-product-analyzer.vercel.app
```

### **For Production (Vercel):**
- `N8N_WEBHOOK_URL`: `https://dnzsrslk.app.n8n.cloud/webhook/cb04381c-f75c-403e-8dee-0ccc087fd732`
- `NEXT_PUBLIC_BACKEND_URL`: `https://seo-product-analyzer.vercel.app`

## 🚨 **Critical Points**

1. **Use EXACT domain**: `https://seo-product-analyzer.vercel.app/`
2. **n8n must send responses to**: `https://seo-product-analyzer.vercel.app/api/seo-results`
3. **Workflow must be ACTIVATED** (not just executed)
4. **Both webhooks use POST method**

## 🔍 **Troubleshooting**

### **If n8n doesn't respond:**
- Check n8n workflow is activated
- Verify "Send to Backend" URL is exactly: `https://seo-product-analyzer.vercel.app/api/seo-results`
- Check browser console for detailed logs

### **If frontend doesn't update:**
- Open browser console and check for API errors
- Verify you're using the production domain
- Ensure response format matches expected structure